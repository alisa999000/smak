import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey } from "@/lib/apiKey";
import {
  addDaysLocal,
  formatISODateLocal,
  normalizeWeekStartISO,
  parseISODateLocal,
  dayIndexMonSun,
  weekdayLabelMonSun,
} from "@/lib/week";
import { composeMergedSlotsByDay } from "@/lib/weeklyMenuCompose";

export async function GET(request: Request) {
  const denied = requireApiKey(request);
  if (denied) {
    return denied;
  }
  const url = new URL(request.url);
  const weekStartISO = normalizeWeekStartISO(url.searchParams.get("weekStart"));
  const monday = parseISODateLocal(weekStartISO);

  const { byDay } = await composeMergedSlotsByDay(prisma, weekStartISO);
  const allIds = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const date = addDaysLocal(monday, i);
    const idx = dayIndexMonSun(date);
    for (const s of byDay[idx] ?? []) {
      allIds.add(s.productId);
    }
  }

  const products = await prisma.product.findMany({
    where: { id: { in: [...allIds] } },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  const byProductId = new Map(products.map((p) => [p.id, p]));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDaysLocal(monday, i);
    const dateStr = formatISODateLocal(date);
    const idx = dayIndexMonSun(date);
    const slots = byDay[idx] ?? [];
    const items = [];
    let order = 0;
    for (const s of slots) {
      const w = byProductId.get(s.productId);
      if (!w) {
        continue;
      }
      items.push({
        sortOrder: order++,
        product: {
          id: w.id,
          name: w.name,
          description: w.description,
          composition: w.composition,
          weightGrams: w.weightGrams,
          category: { id: w.category.id, name: w.category.name },
          priceKop: w.price?.amountKop ?? null,
          images: w.images.map((im) => im.path),
        },
      });
    }
    days.push({
      date: dateStr,
      dayIndexMon0Sun6: idx,
      weekdayRu: weekdayLabelMonSun(idx),
      items,
    });
  }

  return NextResponse.json({
    ok: true,
    weekStart: weekStartISO,
    generatedAt: new Date().toISOString(),
    days,
  });
}
