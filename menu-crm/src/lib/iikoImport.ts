import type { PrismaClient } from "@prisma/client";
import type { IikoNom } from "@/lib/iikoClient";
import { iikoFetchNomenclature } from "@/lib/iikoClient";
import { slugify, uniqueCategorySlug, uniqueProductSlug } from "@/lib/slug";

type Nom = IikoNom;

function groupById(nom: Nom): Map<string, { name: string; parentGroup: string | null }> {
  const m = new Map<string, { name: string; parentGroup: string | null }>();
  for (const g of nom.groups ?? []) {
    if (!g?.id || g.isDeleted) {
      continue;
    }
    m.set(g.id, { name: String(g.name ?? ""), parentGroup: g.parentGroup ? String(g.parentGroup) : null });
  }
  for (const c of nom.productCategories ?? []) {
    if (!c?.id || c.isDeleted) {
      continue;
    }
    const name = String(c.name ?? "").trim();
    const parent = c.parentGroup ? String(c.parentGroup) : null;
    const existing = m.get(c.id);
    if (!existing) {
      m.set(c.id, { name, parentGroup: parent });
    } else if (!existing.name.trim() && name.length > 0) {
      m.set(c.id, { name, parentGroup: existing.parentGroup ?? parent });
    }
  }
  return m;
}

/**
 * У позиции `groupId` часто указывает на «внутренний» узел, которого нет в `groups`,
 * а имя и иерархия — у `parentGroup` (проверено по живому API: db8683d2… → parent fc71b1eb… «Я ГОРЯЧЕЕ»).
 */
function resolveCategoryGroupId(
  p: NonNullable<Nom["products"]>[number],
  byGroup: Map<string, { name: string; parentGroup: string | null }>,
): string {
  const gid = String(p.groupId ?? "").trim();
  const pg = String(p.parentGroup ?? "").trim();
  const starts = [gid, pg].filter((x, i, a) => x.length > 0 && a.indexOf(x) === i);

  for (const start of starts) {
    let cur: string | null = start;
    const seen = new Set<string>();
    for (let depth = 0; depth < 40 && cur; depth++) {
      if (seen.has(cur)) {
        break;
      }
      seen.add(cur);
      const meta = byGroup.get(cur);
      const nm = meta?.name?.trim() ?? "";
      if (nm.length > 0) {
        return cur;
      }
      if (meta?.parentGroup) {
        cur = meta.parentGroup;
        continue;
      }
      break;
    }
  }

  return starts[0] ?? gid ?? pg;
}

function groupLabel(groupId: string, byId: Map<string, { name: string; parentGroup: string | null }>): string {
  const g = byId.get(groupId);
  const n = g?.name?.trim();
  return n && n.length > 0 ? n : `Группа ${groupId.slice(0, 8)}…`;
}

/** Цепочка родителей: «Обеды · Горячее» (как в отчётах по группам). */
function groupBreadcrumb(
  groupId: string,
  byId: Map<string, { name: string; parentGroup: string | null }>,
  maxDepth = 24,
): string {
  const parts: string[] = [];
  let cur: string | null = groupId;
  const seen = new Set<string>();
  for (let i = 0; i < maxDepth && cur; i++) {
    if (seen.has(cur)) {
      break;
    }
    seen.add(cur);
    const g = byId.get(cur);
    if (!g) {
      break;
    }
    const n = g.name.trim();
    if (n.length > 0) {
      parts.unshift(n);
    }
    cur = g.parentGroup;
  }
  return parts.join(" · ");
}

/** Первая положительная currentPrice среди всех размеров (не только [0]). */
function pickPriceKop(
  sizePrices: Array<{ price?: { currentPrice?: number } }> | undefined,
): number | null {
  if (!Array.isArray(sizePrices)) {
    return null;
  }
  for (const sp of sizePrices) {
    const cp = sp?.price?.currentPrice;
    if (typeof cp === "number" && Number.isFinite(cp) && cp > 0) {
      return Math.round(cp);
    }
  }
  return null;
}

/**
 * Длинный текст с нумерацией шагов — в CRM кладём в «состав/техкарта», короткое — в описание для гостя
 * (как в выгрузке iiko_menu_products_by_groups_dates: description часто = рецепт).
 */
function splitGuestDescriptionAndComposition(raw: string): { description: string; composition: string } {
  const t = raw.trim();
  if (!t) {
    return { description: "", composition: "" };
  }
  const looksLikeRecipe =
    /\n\s*\d+\./.test(t) ||
    /^\s*\d+\.\s/m.test(t) ||
    t.length > 220 ||
    (t.includes("\n") && /\d+\.\s/.test(t));
  if (looksLikeRecipe) {
    return { description: "", composition: t };
  }
  return { description: t, composition: "" };
}

/** В номенклатуре вес чаще в кг (0.14); если число большое — считаем уже граммами. */
function weightGramsFromIiko(w: number | undefined): number | null {
  if (typeof w !== "number" || !Number.isFinite(w) || w <= 0) {
    return null;
  }
  if (w < 35) {
    return Math.round(w * 1000);
  }
  return Math.round(w);
}

function collectImageUrls(p: NonNullable<Nom["products"]>[number]): string[] {
  const raw = p.imageLinks;
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: string[] = [];
  for (const u of raw) {
    if (typeof u === "string") {
      const s = u.trim();
      if (s.length > 0) {
        out.push(s);
      }
    }
  }
  return out;
}

export async function importNomenclatureFromIiko(prisma: PrismaClient): Promise<{
  createdProducts: number;
  updatedProducts: number;
  categoriesTouched: number;
  skipped: number;
}> {
  const nom = await iikoFetchNomenclature();
  const byGroup = groupById(nom);
  const products = (nom.products ?? []).filter(
    (p) => p?.id && !p.isDeleted && (p.type === "Dish" || p.type === "Goods"),
  );

  let createdProducts = 0;
  let updatedProducts = 0;
  let categoriesTouched = 0;
  let skipped = 0;

  const categoryIdByIikoGroup = new Map<string, string>();

  async function ensureCategory(iikoGroupId: string): Promise<string> {
    const cached = categoryIdByIikoGroup.get(iikoGroupId);
    if (cached) {
      return cached;
    }
    const name = groupBreadcrumb(iikoGroupId, byGroup) || groupLabel(iikoGroupId, byGroup);
    const existing = await prisma.category.findUnique({ where: { iikoGroupId } });
    if (existing) {
      if (existing.name !== name) {
        await prisma.category.update({ where: { id: existing.id }, data: { name } });
      }
      categoryIdByIikoGroup.set(iikoGroupId, existing.id);
      return existing.id;
    }
    const max = await prisma.category.aggregate({ _max: { sortOrder: true } });
    const slug = await uniqueCategorySlug(name);
    const c = await prisma.category.create({
      data: {
        name,
        slug,
        iikoGroupId,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });
    categoriesTouched++;
    categoryIdByIikoGroup.set(iikoGroupId, c.id);
    return c.id;
  }

  for (const p of products) {
    const iikoId = String(p.id);
    const gid = resolveCategoryGroupId(p, byGroup);
    if (!gid) {
      skipped++;
      continue;
    }
    const categoryId = await ensureCategory(gid);
    const weight = weightGramsFromIiko(p.weight);
    const rawDesc = String(p.description ?? "");
    const { description, composition } = splitGuestDescriptionAndComposition(rawDesc);
    const priceKop = pickPriceKop(p.sizePrices);
    const images = collectImageUrls(p);

    const existing = await prisma.product.findUnique({ where: { iikoProductId: iikoId } });
    const baseData = {
      name: String(p.name ?? "").trim() || "Без названия",
      description,
      composition,
      weightGrams: weight,
      categoryId,
    };

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: baseData,
      });
      updatedProducts++;
      const pid = existing.id;
      if (priceKop !== null) {
        await prisma.price.upsert({
          where: { productId: pid },
          create: { productId: pid, amountKop: priceKop },
          update: { amountKop: priceKop },
        });
      }
      await prisma.productImage.deleteMany({ where: { productId: pid } });
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: { productId: pid, path: images[i], sortOrder: i },
        });
      }
    } else {
      const row = await prisma.product.create({
        data: {
          ...baseData,
          slug: await uniqueProductSlug(baseData.name),
          iikoProductId: iikoId,
        },
      });
      createdProducts++;
      if (priceKop !== null) {
        await prisma.price.create({ data: { productId: row.id, amountKop: priceKop } });
      }
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: { productId: row.id, path: images[i], sortOrder: i },
        });
      }
    }
  }

  return { createdProducts, updatedProducts, categoriesTouched, skipped };
}
