import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCartSession } from "@/lib/site/session";

async function findProduct(id: number) {
  return prisma.product.findFirst({
    where: { OR: [{ legacyModxId: id }, { id: String(id) }] },
    include: { category: true, price: true, images: true },
  });
}

function readNested(form: FormData, prefix: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (!key.startsWith(`${prefix}[`)) continue;
    const inner = key.slice(prefix.length + 1, -1);
    if (inner.includes("][")) {
      const [head, tail] = inner.split("][");
      const bucket = (out[head] as Record<string, unknown>) ?? {};
      bucket[tail] = String(value);
      out[head] = bucket;
    } else {
      out[inner] = String(value);
    }
  }
  return out;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const data = readNested(form, "data");
  const session = await getOrCreateCartSession();

  const cartObj = data.cart as Record<string, string> | undefined;
  const instance = cartObj?.instance ?? "products";

  if (action === "cart/add") {
    const id = Number(data.id);
    const count = Number(data.count ?? 1);
    const product = await findProduct(id);
    if (!product) return NextResponse.json({ status: "error", message: "product_not_found" }, { status: 404 });
    const options = typeof data.options === "object" ? JSON.stringify(data.options) : "{}";
    await prisma.cartItem.upsert({
      where: { cartSessionId_productId_instance: { cartSessionId: session.id, productId: product.id, instance } },
      create: { cartSessionId: session.id, productId: product.id, count, instance, optionsJson: options },
      update: { count: { increment: count } },
    });
    return NextResponse.json({ status: "ok" });
  }

  if (action === "cart/remove") {
    const row = String(data.row ?? "");
    await prisma.cartItem.deleteMany({ where: { id: row, cartSessionId: session.id } });
    return NextResponse.json({ status: "ok" });
  }

  if (action === "cart/recount") {
    const row = String(data.row ?? "");
    const count = Number(data.count ?? 1);
    await prisma.cartItem.updateMany({ where: { id: row, cartSessionId: session.id }, data: { count } });
    return NextResponse.json({ status: "ok" });
  }

  if (action === "cart/clean") {
    await prisma.cartItem.deleteMany({ where: { cartSessionId: session.id, instance } });
    return NextResponse.json({ status: "ok" });
  }

  return NextResponse.json({ status: "error", message: "unknown_action" }, { status: 400 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as {
    action: string;
    id?: number;
    count?: number;
    row?: string;
    instance?: string;
    options?: Record<string, string>;
  };
  const session = await getOrCreateCartSession();
  const instance = body.instance ?? "products";

  if (body.action === "add" && body.id) {
    const product = await findProduct(body.id);
    if (!product) return NextResponse.json({ ok: false, error: "product_not_found" }, { status: 404 });
    await prisma.cartItem.upsert({
      where: { cartSessionId_productId_instance: { cartSessionId: session.id, productId: product.id, instance } },
      create: {
        cartSessionId: session.id,
        productId: product.id,
        count: body.count ?? 1,
        instance,
        optionsJson: JSON.stringify(body.options ?? {}),
      },
      update: { count: { increment: body.count ?? 1 } },
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "remove" && body.row) {
    await prisma.cartItem.deleteMany({ where: { id: body.row, cartSessionId: session.id } });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "recount" && body.row) {
    await prisma.cartItem.updateMany({ where: { id: body.row, cartSessionId: session.id }, data: { count: body.count ?? 1 } });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "clean") {
    await prisma.cartItem.deleteMany({ where: { cartSessionId: session.id, instance } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
}
