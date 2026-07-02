import type { PrismaClient } from "@prisma/client";
import {
  addDaysLocal,
  formatISODateLocal,
  parseISODateLocal,
  weekdayLabelMonSun,
  weekdayShortMonSun,
} from "@/lib/week";
import { migrateLegacyWeeklyMenuItems } from "@/lib/weeklyMenuWeek";

export type AdminPlannerDayItem = {
  slotId: string;
  productId: string;
  name: string;
  isDefaultDaily: boolean;
};

export type AdminPlannerDayColumn = {
  dayOfWeek: number;
  date: string;
  weekdayShort: string;
  weekdayFull: string;
  items: AdminPlannerDayItem[];
};

/** Слияние явных позиций недели и блюд «каждый день» (с учётом исключений по дню). */
export async function composeAdminWeeklyDays(prisma: PrismaClient, weekStart: string): Promise<{
  weekStart: string;
  days: AdminPlannerDayColumn[];
}> {
  await migrateLegacyWeeklyMenuItems(prisma);

  const [explicit, exclusions, defaultProducts] = await Promise.all([
    prisma.weeklyMenuItem.findMany({
      where: { weekStart },
      orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
      include: { product: { select: { id: true, name: true } } },
    }),
    prisma.weeklyMenuDefaultExclusion.findMany({ where: { weekStart } }),
    prisma.product.findMany({
      where: { defaultInMenuDaily: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const excl = new Set(exclusions.map((e) => `${e.dayOfWeek}:${e.productId}`));
  const monday = parseISODateLocal(weekStart);
  const days: AdminPlannerDayColumn[] = [];

  for (let dow = 0; dow < 7; dow++) {
    const date = addDaysLocal(monday, dow);
    const explicitRows = explicit.filter((w) => w.dayOfWeek === dow);
    const explicitIds = new Set(explicitRows.map((w) => w.productId));

    const items: AdminPlannerDayItem[] = explicitRows.map((w) => ({
      slotId: w.id,
      productId: w.product.id,
      name: w.product.name,
      isDefaultDaily: false,
    }));

    let defOrder = 0;
    for (const p of defaultProducts) {
      if (explicitIds.has(p.id)) {
        continue;
      }
      if (excl.has(`${dow}:${p.id}`)) {
        continue;
      }
      items.push({
        slotId: `def:${weekStart}:${dow}:${p.id}:${defOrder++}`,
        productId: p.id,
        name: p.name,
        isDefaultDaily: true,
      });
    }

    days.push({
      dayOfWeek: dow,
      date: formatISODateLocal(date),
      weekdayShort: weekdayShortMonSun(dow),
      weekdayFull: weekdayLabelMonSun(dow),
      items,
    });
  }

  return { weekStart, days };
}

type MergedDaySlot = { productId: string; sortOrder: number };

/** Упорядоченные productId по дням (для публичного API). */
export async function composeMergedSlotsByDay(
  prisma: PrismaClient,
  weekStart: string,
): Promise<{ weekStart: string; byDay: Record<number, MergedDaySlot[]> }> {
  await migrateLegacyWeeklyMenuItems(prisma);

  const [explicit, exclusions, defaultProducts] = await Promise.all([
    prisma.weeklyMenuItem.findMany({
      where: { weekStart },
      orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
      select: { dayOfWeek: true, productId: true, sortOrder: true },
    }),
    prisma.weeklyMenuDefaultExclusion.findMany({ where: { weekStart } }),
    prisma.product.findMany({
      where: { defaultInMenuDaily: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const excl = new Set(exclusions.map((e) => `${e.dayOfWeek}:${e.productId}`));
  const byDay: Record<number, MergedDaySlot[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  for (let dow = 0; dow < 7; dow++) {
    const explicitRows = explicit.filter((w) => w.dayOfWeek === dow);
    const explicitIds = new Set(explicitRows.map((w) => w.productId));
    const slots: MergedDaySlot[] = explicitRows.map((w) => ({
      productId: w.productId,
      sortOrder: w.sortOrder,
    }));
    let o = 0;
    for (const p of defaultProducts) {
      if (explicitIds.has(p.id) || excl.has(`${dow}:${p.id}`)) {
        continue;
      }
      slots.push({ productId: p.id, sortOrder: 10_000 + o++ });
    }
    slots.sort((a, b) => a.sortOrder - b.sortOrder);
    byDay[dow] = slots;
  }

  return { weekStart, byDay };
}
