import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    ok: true,
    news: posts.map((n) => ({
      id: n.legacyModxId ?? n.id,
      parent: 36,
      pagetitle: n.pagetitle,
      longtitle: "",
      description: "",
      alias: n.slug,
      introtext: n.introtext,
      content: n.content,
      published: true,
      template: 5,
      menuindex: 0,
      isfolder: false,
      url: `/novosti/${n.slug}.html`,
      tvs: {},
    })),
  });
}
