import { NextResponse } from "next/server";
import { menuDayFromCrm } from "@/lib/site/menuDay";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const categorySlug = url.searchParams.get("categorySlug") ?? undefined;
  const format = url.searchParams.get("format") ?? "items";
  const result = await menuDayFromCrm(date, { categorySlug });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  if (format === "products") {
    return NextResponse.json({
      ok: true,
      products: result.products,
      weekdayRu: result.weekdayRu,
    });
  }
  return NextResponse.json({ ok: true, items: result.items, weekdayRu: result.weekdayRu });
}
