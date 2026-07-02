import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [categories, products, weekly, priced] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.weeklyMenuItem.count(),
    prisma.price.count(),
  ]);
  return NextResponse.json({ ok: true, categories, products, weekly, priced });
}
