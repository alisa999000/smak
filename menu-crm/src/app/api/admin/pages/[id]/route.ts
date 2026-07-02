import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uniquePageSlug } from "@/lib/slug";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, page });
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const pagetitle = String(body.pagetitle ?? existing.pagetitle).trim();
  if (!pagetitle) {
    return NextResponse.json({ ok: false, error: "pagetitle_required" }, { status: 400 });
  }

  let slug = String(body.slug ?? existing.slug).trim();
  if (slug !== existing.slug) {
    slug = await uniquePageSlug(slug || pagetitle, id);
    const clash = await prisma.page.findFirst({ where: { slug, NOT: { id } } });
    if (clash) {
      return NextResponse.json({ ok: false, error: "slug_exists" }, { status: 422 });
    }
  }

  const page = await prisma.page.update({
    where: { id },
    data: {
      slug,
      pagetitle,
      longtitle: body.longtitle != null ? String(body.longtitle) : existing.longtitle,
      description: body.description != null ? String(body.description) : existing.description,
      introtext: body.introtext != null ? String(body.introtext) : existing.introtext,
      content: body.content != null ? String(body.content) : existing.content,
      template: body.template != null ? Number(body.template) : existing.template,
      menuindex: body.menuindex != null ? Number(body.menuindex) : existing.menuindex,
      isfolder: body.isfolder != null ? Boolean(body.isfolder) : existing.isfolder,
      published: body.published != null ? Boolean(body.published) : existing.published,
      parentSlug: body.parentSlug !== undefined ? (body.parentSlug ? String(body.parentSlug) : null) : existing.parentSlug,
    },
  });

  return NextResponse.json({ ok: true, page });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  if (page.slug === "menyu") {
    return NextResponse.json({ ok: false, error: "protected" }, { status: 422 });
  }
  await prisma.page.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
