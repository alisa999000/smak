import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeWeekStartISO } from "@/lib/week";
import { composeAdminWeeklyDays } from "@/lib/weeklyMenuCompose";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const weekStart = normalizeWeekStartISO(url.searchParams.get("weekStart"));
  const { days } = await composeAdminWeeklyDays(prisma, weekStart);
  return NextResponse.json({ ok: true, weekStart, days });
}
