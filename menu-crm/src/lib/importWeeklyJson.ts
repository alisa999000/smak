import type { PrismaClient } from "@prisma/client";
import { slugify, uniqueCategorySlug, uniqueProductSlug } from "@/lib/slug";
import { normalizeWeekStartISO } from "@/lib/week";

type WeeklyItem = {
  category?: string;
  name?: string;
  composition?: string;
  weight?: string;
  priceRub?: number | null;
};

type WeeklyJson = {
  anchorWeekStart?: string;
  shifts?: Array<{
    id: string;
    days?: Array<{
      dayIndex: number;
      items?: WeeklyItem[];
    }>;
  }>;
};

function parseWeightGrams(raw: string | undefined): number | null {
  if (!raw) return null;
  const m = raw.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

export async function importWeeklyMenuJson(prisma: PrismaClient, data: WeeklyJson) {
  const anchor = normalizeWeekStartISO(data.anchorWeekStart ?? "2026-09-21");
  let productsCreated = 0;
  let productsUpdated = 0;
  let weeklyItems = 0;
  const categoryCache = new Map<string, string>();
  const productCache = new Map<string, string>();

  async function categoryId(name: string) {
    const key = name.trim() || "Прочее";
    const cached = categoryCache.get(key);
    if (cached) return cached;
    const slug = slugify(key);
    let cat = await prisma.category.findFirst({ where: { OR: [{ slug }, { name: key }] } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: key, slug: await uniqueCategorySlug(key) },
      });
    }
    categoryCache.set(key, cat.id);
    return cat.id;
  }

  async function productId(item: WeeklyItem) {
    const name = String(item.name ?? "").trim();
    if (!name) return null;
    const cached = productCache.get(name);
    if (cached) return cached;
    const slug = await uniqueProductSlug(name);
    const catId = await categoryId(String(item.category ?? "Прочее"));
    const weightGrams = parseWeightGrams(String(item.weight ?? ""));
    const priceKop = item.priceRub != null ? Math.round(Number(item.priceRub) * 100) : null;

    let product = await prisma.product.findFirst({ where: { OR: [{ slug }, { name }] } });
    if (product) {
      product = await prisma.product.update({
        where: { id: product.id },
        data: {
          composition: String(item.composition ?? product.composition),
          weightGrams: weightGrams ?? product.weightGrams,
          categoryId: catId,
        },
      });
      productsUpdated++;
    } else {
      product = await prisma.product.create({
        data: {
          name,
          slug,
          composition: String(item.composition ?? ""),
          weightGrams,
          categoryId: catId,
        },
      });
      productsCreated++;
    }

    if (priceKop != null && priceKop > 0) {
      await prisma.price.upsert({
        where: { productId: product.id },
        create: { productId: product.id, amountKop: priceKop },
        update: { amountKop: priceKop },
      });
    }

    productCache.set(name, product.id);
    return product.id;
  }

  for (const shift of data.shifts ?? []) {
    const weekStart = shift.id === "M2" ? addWeeks(anchor, 1) : anchor;
    for (const day of shift.days ?? []) {
      let sortOrder = 0;
      for (const item of day.items ?? []) {
        const pid = await productId(item);
        if (!pid) continue;
        await prisma.weeklyMenuItem.upsert({
          where: {
            weekStart_dayOfWeek_productId: {
              weekStart,
              dayOfWeek: day.dayIndex,
              productId: pid,
            },
          },
          create: { weekStart, dayOfWeek: day.dayIndex, productId: pid, sortOrder: sortOrder++ },
          update: { sortOrder: sortOrder++ },
        });
        weeklyItems++;
      }
    }
  }

  return { productsCreated, productsUpdated, weeklyItems, anchor, categories: categoryCache.size };
}

function addWeeks(iso: string, weeks: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}
