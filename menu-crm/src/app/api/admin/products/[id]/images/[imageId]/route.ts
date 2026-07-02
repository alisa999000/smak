import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminCookie } from "@/lib/adminRequest";

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string; imageId: string }> },
) {
  const denied = await requireAdminCookie();
  if (denied) {
    return denied;
  }

  const { id, imageId } = await ctx.params;
  const image = await prisma.productImage.findFirst({
    where: { id: imageId, productId: id },
  });
  if (!image) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  await prisma.productImage.delete({ where: { id: imageId } });
  return NextResponse.json({ ok: true });
}
