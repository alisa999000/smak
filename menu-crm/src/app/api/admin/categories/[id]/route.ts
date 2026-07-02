import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json({ ok: false, error: "has_products" }, { status: 400 });
  }
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
