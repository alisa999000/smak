import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSessionUser } from "@/lib/site/session";

export async function GET() {
  const user = await getSiteSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    ok: true,
    orders: orders.map((o) => ({
      id: o.legacyModxId ?? o.id,
      createdAt: o.createdAt.toLocaleString("ru-RU"),
      amount: o.amountKop / 100,
      currency: o.currency,
      status: o.status,
    })),
  });
}
