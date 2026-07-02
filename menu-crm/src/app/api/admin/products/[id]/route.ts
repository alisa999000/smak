import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, product });
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const categoryId = String(body.categoryId ?? "");
  if (!name || !categoryId) {
    return NextResponse.json({ ok: false, error: "required" }, { status: 400 });
  }
  const defaultInMenuDaily = Boolean(body.defaultInMenuDaily);
  await prisma.product.update({
    where: { id },
    data: {
      name,
      sku: String(body.sku ?? "").trim() || null,
      description: String(body.description ?? ""),
      composition: String(body.composition ?? ""),
      weightGrams: body.weightGrams != null ? Number(body.weightGrams) : null,
      categoryId,
      defaultInMenuDaily,
    },
  });
  if (!defaultInMenuDaily) {
    await prisma.weeklyMenuDefaultExclusion.deleteMany({ where: { productId: id } });
  }
  const priceRub = body.priceRub != null ? Number(body.priceRub) : null;
  if (priceRub != null && priceRub >= 0) {
    const kop = Math.round(priceRub * 100);
    await prisma.price.upsert({
      where: { productId: id },
      create: { productId: id, amountKop: kop },
      update: { amountKop: kop },
    });
  }
  const img = String(body.imagePath ?? "").trim();
  if (img) {
    const existing = await prisma.productImage.findFirst({ where: { productId: id, path: img } });
    if (!existing) {
      const max = await prisma.productImage.aggregate({ where: { productId: id }, _max: { sortOrder: true } });
      await prisma.productImage.create({
        data: { productId: id, path: img, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      });
    }
  }
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, price: true, images: true },
  });
  return NextResponse.json({ ok: true, product });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
