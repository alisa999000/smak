import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productToSiteDocument } from "@/lib/site/mappers";

export async function GET(_request: Request, ctx: { params: Promise<{ alias: string }> }) {
  const { alias } = await ctx.params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug: alias }, { legacyModxId: Number.isFinite(Number(alias)) ? Number(alias) : -1 }] },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product || !product.published) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, product: productToSiteDocument(product) });
}
