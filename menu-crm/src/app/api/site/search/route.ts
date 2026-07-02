import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productToSiteDocument } from "@/lib/site/mappers";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ ok: true, results: [] });
  const products = await prisma.product.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
        { composition: { contains: q } },
      ],
    },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
    take: 50,
  });
  return NextResponse.json({ ok: true, results: products.map(productToSiteDocument) });
}
