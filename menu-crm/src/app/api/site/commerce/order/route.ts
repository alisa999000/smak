import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartSession, getSiteSessionUser } from "@/lib/site/session";

export async function POST(request: Request) {
  const user = await getSiteSessionUser();
  const fields = (await request.json()) as Record<string, unknown>;
  const session = await getOrCreateCartSession();
  const items = session.items.filter((i) => i.instance === "products");
  if (!items.length) {
    return NextResponse.json({ ok: false, error: "cart_empty" }, { status: 422 });
  }

  let amountKop = 0;
  const orderItems = items.map((item) => {
    const priceKop = item.product.price?.amountKop ?? 0;
    amountKop += priceKop * item.count;
    return {
      productId: item.productId,
      name: item.product.name,
      count: item.count,
      priceKop,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId: user?.id,
      amountKop,
      fieldsJson: JSON.stringify(fields),
      items: { create: orderItems },
    },
  });

  await prisma.cartItem.deleteMany({ where: { cartSessionId: session.id, instance: "products" } });

  return NextResponse.json({ ok: true, orderId: order.id, amount: amountKop / 100 });
}
