import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoryToSiteDocument } from "@/lib/site/mappers";
import { findCategoryByRef } from "@/lib/site/resolveCategory";

export async function GET(_request: Request, ctx: { params: Promise<{ alias: string }> }) {
  const { alias } = await ctx.params;

  const page = await prisma.page.findFirst({
    where: { slug: alias, published: true },
  });

  if (page) {
    const crumbs = [];
    let current = page;
    const guard = new Set<string>();
    while (current && !guard.has(current.slug)) {
      guard.add(current.slug);
      crumbs.unshift({
        id: current.legacyModxId ?? 0,
        pagetitle: current.pagetitle,
        url: current.slug === "menyu" ? "/menyu.html" : current.parentSlug === "menyu" ? `/menyu/${current.slug}.html` : `/${current.slug}.html`,
      });
      if (!current.parentSlug) break;
      const parent = await prisma.page.findUnique({ where: { slug: current.parentSlug } });
      if (!parent) break;
      current = parent;
    }
    const { pageToSiteDocument } = await import("@/lib/site/mappers");
    return NextResponse.json({ ok: true, page: pageToSiteDocument(page, crumbs) });
  }

  const category = await findCategoryByRef(prisma, alias);
  if (category) {
    return NextResponse.json({ ok: true, page: categoryToSiteDocument(category) });
  }

  return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
}
