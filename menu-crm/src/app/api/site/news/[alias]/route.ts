import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, ctx: { params: Promise<{ alias: string }> }) {
  const { alias } = await ctx.params;
  const post = await prisma.newsPost.findFirst({ where: { slug: alias, published: true } });
  if (!post) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    news: {
      id: post.legacyModxId ?? post.id,
      parent: 36,
      pagetitle: post.pagetitle,
      longtitle: "",
      description: "",
      alias: post.slug,
      introtext: post.introtext,
      content: post.content,
      published: true,
      template: 5,
      menuindex: 0,
      isfolder: false,
      url: `/novosti/${post.slug}.html`,
      tvs: {},
      breadcrumbs: [
        { id: 36, pagetitle: "Новости", url: "/novosti.html" },
        { id: post.legacyModxId ?? 0, pagetitle: post.pagetitle, url: `/novosti/${post.slug}.html` },
      ],
    },
  });
}
