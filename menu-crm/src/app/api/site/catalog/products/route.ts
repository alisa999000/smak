import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productToSiteDocument, MENU_ROOT_ID } from "@/lib/site/mappers";
import { findCategoryByRef } from "@/lib/site/resolveCategory";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parentSlug = url.searchParams.get("parentSlug");
  const parent = url.searchParams.get("parent");
  const depth = Number(url.searchParams.get("depth") ?? 10);

  let categoryIds: string[] | null = null;

  if (parentSlug) {
    const cat = await findCategoryByRef(prisma, parentSlug);
    if (cat) categoryIds = [cat.id];
    else return NextResponse.json({ ok: true, products: [] });
  } else {
    const parentNum = Number(parent ?? MENU_ROOT_ID);
    if (parentNum !== MENU_ROOT_ID) {
      const cat = await findCategoryByRef(prisma, parentNum);
      if (cat) categoryIds = [cat.id];
      else return NextResponse.json({ ok: true, products: [] });
    }
  }

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
    },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
    take: depth > 0 ? 500 : 500,
  });

  return NextResponse.json({ ok: true, products: products.map(productToSiteDocument) });
}
