import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeWeekStartISO } from "@/lib/week";
import { migrateLegacyWeeklyMenuItems } from "@/lib/weeklyMenuWeek";

export async function POST(request: Request) {
  let body: { weekStart?: unknown; dayOfWeek?: unknown; productId?: unknown };
  try {
    body = (await request.json()) as { weekStart?: unknown; dayOfWeek?: unknown; productId?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Неверный JSON" }, { status: 400 });
  }

  const weekStart = normalizeWeekStartISO(
    typeof body.weekStart === "string" ? body.weekStart : undefined,
  );
  const dayOfWeek = Number(body.dayOfWeek);
  const productId = String(body.productId ?? "");

  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || !productId) {
    return NextResponse.json({ ok: false, error: "Нужны weekStart, dayOfWeek 0..6 и productId" }, { status: 400 });
  }

  await migrateLegacyWeeklyMenuItems(prisma);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { defaultInMenuDaily: true },
  });
  if (!product) {
    return NextResponse.json({ ok: false, error: "Блюдо не найдено" }, { status: 404 });
  }

  const explicit = await prisma.weeklyMenuItem.findUnique({
    where: { weekStart_dayOfWeek_productId: { weekStart, dayOfWeek, productId } },
  });
  const exclusion = await prisma.weeklyMenuDefaultExclusion.findUnique({
    where: { weekStart_dayOfWeek_productId: { weekStart, dayOfWeek, productId } },
  });

  const mergedPresent = Boolean(explicit) || (product.defaultInMenuDaily && !exclusion);

  if (mergedPresent) {
    if (explicit) {
      await prisma.weeklyMenuItem.delete({ where: { id: explicit.id } });
      if (product.defaultInMenuDaily) {
        await prisma.weeklyMenuDefaultExclusion.upsert({
          where: { weekStart_dayOfWeek_productId: { weekStart, dayOfWeek, productId } },
          create: { weekStart, dayOfWeek, productId },
          update: {},
        });
      }
      return NextResponse.json({ ok: true, action: "removed" as const });
    }
    await prisma.weeklyMenuDefaultExclusion.upsert({
      where: { weekStart_dayOfWeek_productId: { weekStart, dayOfWeek, productId } },
      create: { weekStart, dayOfWeek, productId },
      update: {},
    });
    return NextResponse.json({ ok: true, action: "removed" as const });
  }

  if (exclusion) {
    await prisma.weeklyMenuDefaultExclusion.delete({ where: { id: exclusion.id } });
    return NextResponse.json({ ok: true, action: "added" as const });
  }

  const max = await prisma.weeklyMenuItem.aggregate({
    where: { weekStart, dayOfWeek },
    _max: { sortOrder: true },
  });

  await prisma.weeklyMenuItem.create({
    data: {
      weekStart,
      dayOfWeek,
      productId,
      sortOrder: (max._max.sortOrder ?? -1) + 1,
    },
  });

  return NextResponse.json({ ok: true, action: "added" as const });
}
