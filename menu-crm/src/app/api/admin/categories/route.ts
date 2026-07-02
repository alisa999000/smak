import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniqueCategorySlug } from "@/lib/slug";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ ok: true, categories });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
  }
  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const slug = await uniqueCategorySlug(name);
  const category = await prisma.category.create({
    data: { name, slug, sortOrder: (maxSort._max.sortOrder ?? 0) + 1 },
  });
  return NextResponse.json({ ok: true, category });
}
