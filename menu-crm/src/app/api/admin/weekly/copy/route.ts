import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeWeekStartISO } from "@/lib/week";
import { migrateLegacyWeeklyMenuItems } from "@/lib/weeklyMenuWeek";

export async function POST(request: Request) {
  let body: { fromWeekStart?: unknown; toWeekStart?: unknown };
  try {
    body = (await request.json()) as { fromWeekStart?: unknown; toWeekStart?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Неверный JSON" }, { status: 400 });
  }

  const fromWeekStart = normalizeWeekStartISO(
    typeof body.fromWeekStart === "string" ? body.fromWeekStart : undefined,
  );
  const toWeekStart = normalizeWeekStartISO(
    typeof body.toWeekStart === "string" ? body.toWeekStart : undefined,
  );

  if (fromWeekStart === toWeekStart) {
    return NextResponse.json({ ok: false, error: "Укажите разные недели" }, { status: 400 });
  }

  await migrateLegacyWeeklyMenuItems(prisma);

  const [srcItems, srcExcl] = await Promise.all([
    prisma.weeklyMenuItem.findMany({ where: { weekStart: fromWeekStart } }),
    prisma.weeklyMenuDefaultExclusion.findMany({ where: { weekStart: fromWeekStart } }),
  ]);

  await prisma.$transaction(async (tx) => {
    await tx.weeklyMenuItem.deleteMany({ where: { weekStart: toWeekStart } });
    await tx.weeklyMenuDefaultExclusion.deleteMany({ where: { weekStart: toWeekStart } });
    for (const it of srcItems) {
      await tx.weeklyMenuItem.create({
        data: {
          weekStart: toWeekStart,
          dayOfWeek: it.dayOfWeek,
          productId: it.productId,
          sortOrder: it.sortOrder,
        },
      });
    }
    for (const e of srcExcl) {
      await tx.weeklyMenuDefaultExclusion.create({
        data: {
          weekStart: toWeekStart,
          dayOfWeek: e.dayOfWeek,
          productId: e.productId,
        },
      });
    }
  });

  return NextResponse.json({
    ok: true,
    copiedItems: srcItems.length,
    copiedExclusions: srcExcl.length,
    toWeekStart,
  });
}
