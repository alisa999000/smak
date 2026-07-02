import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiKey } from "@/lib/apiKey";

export async function GET(request: Request) {
  const denied = requireApiKey(request);
  if (denied) {
    return denied;
  }
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    products: products.map((p) => ({
      id: p.id,
      iikoProductId: p.iikoProductId,
      sku: p.sku,
      name: p.name,
      description: p.description,
      composition: p.composition,
      weightGrams: p.weightGrams,
      category: { id: p.category.id, name: p.category.name },
      priceKop: p.price?.amountKop ?? null,
      images: p.images.map((i) => ({ path: i.path, sortOrder: i.sortOrder })),
    })),
  });
}
