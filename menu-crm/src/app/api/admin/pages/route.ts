import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, uniquePageSlug } from "@/lib/slug";

export async function GET() {
  const pages = await prisma.page.findMany({
    orderBy: [{ menuindex: "asc" }, { pagetitle: "asc" }],
  });
  return NextResponse.json({ ok: true, pages });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const pagetitle = String(body.pagetitle ?? "").trim();
  if (!pagetitle) {
    return NextResponse.json({ ok: false, error: "pagetitle_required" }, { status: 400 });
  }

  const slugInput = String(body.slug ?? "").trim();
  const slug = slugInput || (await uniquePageSlug(pagetitle));

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 422 });
  }

  const maxIndex = await prisma.page.aggregate({ _max: { menuindex: true } });
  const page = await prisma.page.create({
    data: {
      slug,
      pagetitle,
      longtitle: String(body.longtitle ?? ""),
      description: String(body.description ?? ""),
      introtext: String(body.introtext ?? ""),
      content: String(body.content ?? ""),
      template: Number(body.template ?? 1),
      menuindex: body.menuindex != null ? Number(body.menuindex) : (maxIndex._max.menuindex ?? 0) + 1,
      isfolder: Boolean(body.isfolder),
      published: body.published !== false,
      parentSlug: body.parentSlug ? String(body.parentSlug) : null,
    },
  });

  return NextResponse.json({ ok: true, page });
}
