import {
  addDaysLocal,
  dayIndexMonSun,
  formatISODateLocal,
  parseISODateLocal,
  startOfWeekMonday,
  weekdayLabelMonSun,
} from "@/lib/week";
import { composeMergedSlotsByDay } from "@/lib/weeklyMenuCompose";
import { prisma } from "@/lib/prisma";
import { productToSiteDocument } from "@/lib/site/mappers";
import { resolveMenuWeekStart, resolveShiftId } from "@/lib/site/menuDay";

const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export type MenuPdfItem = {
  name: string;
  composition: string;
  weight: string;
  price: string;
};

export type MenuPdfCategory = {
  name: string;
  items: MenuPdfItem[];
};

export type MenuPdfDay = {
  dateLabel: string;
  weekdayRu: string;
  categories: MenuPdfCategory[];
};

export type MenuWeekPdfData = {
  periodLabel: string;
  shiftLabel: string;
  generatedAt: string;
  days: MenuPdfDay[];
};

function formatRuDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]}`;
}

function formatRuDateFull(d: Date): string {
  return `${formatRuDate(d)} ${d.getFullYear()}`;
}

function parseReferenceDate(input?: string): Date {
  if (!input) return new Date();
  const ru = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (ru) {
    return new Date(Number(ru[3]), Number(ru[2]) - 1, Number(ru[1]), 12, 0, 0, 0);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return parseISODateLocal(input);
  }
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export async function loadMenuWeekPdfData(referenceInput?: string): Promise<MenuWeekPdfData> {
  const reference = parseReferenceDate(referenceInput);
  const calendarMonday = startOfWeekMonday(reference);
  const menuWeekStart = resolveMenuWeekStart(reference);
  const shift = resolveShiftId(reference);
  const { byDay } = await composeMergedSlotsByDay(prisma, menuWeekStart);

  const days: MenuPdfDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDaysLocal(calendarMonday, i);
    const idx = dayIndexMonSun(date);
    const slots = byDay[idx] ?? [];
    const productIds = slots.map((s) => s.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
      include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const grouped = new Map<string, MenuPdfItem[]>();
    for (const slot of slots) {
      const p = byId.get(slot.productId);
      if (!p) continue;
      const doc = productToSiteDocument(p);
      const catName = p.category.name;
      const row: MenuPdfItem = {
        name: doc.pagetitle,
        composition: doc.tvs.sostav || "",
        weight: doc.tvs.massa ? `${doc.tvs.massa} г` : "",
        price: doc.tvs.price ? `${doc.tvs.price} ₽` : "",
      };
      const list = grouped.get(catName) ?? [];
      list.push(row);
      grouped.set(catName, list);
    }

    const categories = [...grouped.entries()].map(([name, items]) => ({ name, items }));
    days.push({
      dateLabel: formatRuDate(date),
      weekdayRu: weekdayLabelMonSun(idx).toLowerCase(),
      categories,
    });
  }

  const sunday = addDaysLocal(calendarMonday, 6);
  const periodLabel =
    calendarMonday.getFullYear() === sunday.getFullYear()
      ? `${formatRuDate(calendarMonday)} — ${formatRuDateFull(sunday)}`
      : `${formatRuDateFull(calendarMonday)} — ${formatRuDateFull(sunday)}`;

  return {
    periodLabel,
    shiftLabel: shift === "M1" ? "1 смена" : "2 смена",
    generatedAt: formatRuDateFull(new Date()),
    days,
  };
}

export function menuPdfFilename(referenceInput?: string): string {
  const reference = parseReferenceDate(referenceInput);
  const monday = startOfWeekMonday(reference);
  return `menu-smachnaya-${formatISODateLocal(monday)}.pdf`;
}
