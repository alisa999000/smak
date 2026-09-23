import {
  addDaysLocal,
  dayIndexMonSun,
  formatISODateLocal,
  normalizeWeekStartISO,
  parseISODateLocal,
  weekdayLabelMonSun,
} from "@/lib/week";
import { composeMergedSlotsByDay } from "@/lib/weeklyMenuCompose";
import { prisma } from "@/lib/prisma";
import { productToSiteDocument } from "@/lib/site/mappers";
import { findCategoryByRef } from "@/lib/site/resolveCategory";

const WEEKDAY_RU = [
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
  "воскресенье",
];

/** M1-1 = понедельник этой недели (актуальное меню с 21.09.2026). */
const ANCHOR = "2026-09-21";

function resolveShift(date: Date): "M1" | "M2" {
  const anchor = parseISODateLocal(ANCHOR);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dayIndex = dayIndexMonSun(d);
  const weekStart = addDaysLocal(d, -dayIndex);
  const daysDiff = Math.floor((weekStart.getTime() - anchor.getTime()) / 86400000);
  const weekNumber = daysDiff < 0 ? (Math.abs(Math.floor(daysDiff / 7)) % 2 === 1 ? 1 : 0) : Math.floor(daysDiff / 7) % 2;
  return weekNumber === 0 ? "M1" : "M2";
}

export function resolveShiftId(date: Date): "M1" | "M2" {
  return resolveShift(date);
}

/** Неделя меню в CRM: M1 = anchor, M2 = anchor + 7 дней (как в importWeeklyJson). */
export function resolveMenuWeekStart(date: Date): string {
  const anchor = parseISODateLocal(ANCHOR);
  return resolveShift(date) === "M1"
    ? normalizeWeekStartISO(formatISODateLocal(anchor))
    : normalizeWeekStartISO(formatISODateLocal(addDaysLocal(anchor, 7)));
}

function parseRuDate(input: string): Date | null {
  const m = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

export async function menuDayFromCrm(dateInput: string, options?: { categorySlug?: string }) {
  const date = parseRuDate(dateInput);
  if (!date) {
    return { ok: false as const, error: "invalid_date" };
  }

  let categoryId: string | null = null;
  if (options?.categorySlug) {
    const cat = await findCategoryByRef(prisma, options.categorySlug);
    if (!cat) {
      const idx = dayIndexMonSun(date);
      return {
        ok: true as const,
        items: [],
        products: [] as ReturnType<typeof productToSiteDocument>[],
        weekdayRu: WEEKDAY_RU[idx] ?? weekdayLabelMonSun(idx),
        shiftId: resolveShift(date),
      };
    }
    categoryId = cat.id;
  }

  const weekStart = resolveMenuWeekStart(date);
  const { byDay } = await composeMergedSlotsByDay(prisma, weekStart);
  const idx = dayIndexMonSun(date);
  const slots = byDay[idx] ?? [];
  const productIds = slots.map((s) => s.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      published: true,
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const items = [];
  const productDocs: ReturnType<typeof productToSiteDocument>[] = [];
  for (const slot of slots) {
    const p = byId.get(slot.productId);
    if (!p) continue;
    const doc = productToSiteDocument(p);
    productDocs.push(doc);
    items.push({
      name: doc.pagetitle,
      description: doc.tvs.sostav || p.description || p.category.name,
      price: doc.tvs.price ?? "",
      weight: doc.tvs.massa ?? "",
      image: doc.tvs.image ? (doc.tvs.image.startsWith("/") ? doc.tvs.image : `/${doc.tvs.image}`) : "",
    });
  }

  return {
    ok: true as const,
    items,
    products: productDocs,
    weekdayRu: WEEKDAY_RU[idx] ?? weekdayLabelMonSun(idx),
    shiftId: resolveShift(date),
  };
}

export async function menuWeekFromCrm(weekStartISO: string) {
  const monday = parseISODateLocal(normalizeWeekStartISO(weekStartISO));
  const { byDay } = await composeMergedSlotsByDay(prisma, normalizeWeekStartISO(weekStartISO));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDaysLocal(monday, i);
    const idx = dayIndexMonSun(date);
    const slots = byDay[idx] ?? [];
    const productIds = slots.map((s) => s.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    const items = slots
      .map((s) => byId.get(s.productId))
      .filter(Boolean)
      .map((p) => productToSiteDocument(p!));
    days.push({ date: formatISODateLocal(date), dayIndex: idx, items });
  }
  return { ok: true, weekStart: normalizeWeekStartISO(weekStartISO), days };
}
