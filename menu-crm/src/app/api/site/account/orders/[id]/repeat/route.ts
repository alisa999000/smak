import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartSession, getSiteSessionUser } from "@/lib/site/session";

export async function POST(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSiteSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
  const { id } = await ctx.params;
  const order = await prisma.order.findFirst({
    where: { userId: user.id, OR: [{ id }, { legacyModxId: Number(id) || -1 }] },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const cart = await getOrCreateCartSession();
  for (const item of order.items) {
    await prisma.cartItem.upsert({
      where: { cartSessionId_productId_instance: { cartSessionId: cart.id, productId: item.productId, instance: "products" } },
      create: { cartSessionId: cart.id, productId: item.productId, count: item.count, instance: "products" },
      update: { count: { increment: item.count } },
    });
  }
  return NextResponse.json({ ok: true });
}
