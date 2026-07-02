import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueProductSlug } from "@/lib/slug";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({ ok: true, products });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const categoryId = String(body.categoryId ?? "");
  if (!name || !categoryId) {
    return NextResponse.json({ ok: false, error: "required" }, { status: 400 });
  }
  const slug = String(body.slug ?? "").trim() || (await uniqueProductSlug(name));
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      sku: String(body.sku ?? "").trim() || null,
      description: String(body.description ?? ""),
      composition: String(body.composition ?? ""),
      weightGrams: body.weightGrams != null ? Number(body.weightGrams) : null,
      categoryId,
      defaultInMenuDaily: Boolean(body.defaultInMenuDaily),
    },
  });
  const priceRub = body.priceRub != null ? Number(body.priceRub) : null;
  if (priceRub != null && priceRub >= 0) {
    await prisma.price.create({ data: { productId: product.id, amountKop: Math.round(priceRub * 100) } });
  }
  const img = String(body.imagePath ?? "").trim();
  if (img) {
    await prisma.productImage.create({ data: { productId: product.id, path: img, sortOrder: 0 } });
  }
  return NextResponse.json({ ok: true, product });
}
