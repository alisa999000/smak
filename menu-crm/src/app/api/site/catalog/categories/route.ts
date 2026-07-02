import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoryToSiteDocument, MENU_ROOT_ID } from "@/lib/site/mappers";
import { findCategoryByRef } from "@/lib/site/resolveCategory";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parentSlug = url.searchParams.get("parentSlug");
  const parent = url.searchParams.get("parent");

  if (parentSlug) {
    const cat = await findCategoryByRef(prisma, parentSlug);
    if (!cat) return NextResponse.json({ ok: true, categories: [] });
    return NextResponse.json({ ok: true, categories: [categoryToSiteDocument(cat)] });
  }

  const parentNum = Number(parent ?? MENU_ROOT_ID);
  if (parentNum !== MENU_ROOT_ID) {
    const cat = await findCategoryByRef(prisma, parentNum);
    if (!cat) return NextResponse.json({ ok: true, categories: [] });
    return NextResponse.json({ ok: true, categories: [categoryToSiteDocument(cat)] });
  }

  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ ok: true, categories: categories.map(categoryToSiteDocument) });
}
