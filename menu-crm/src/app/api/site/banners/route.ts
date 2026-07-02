import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bannerToSite } from "@/lib/site/mappers";

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ ok: true, banners: banners.map(bannerToSite) });
}
