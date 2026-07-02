import { NextResponse } from "next/server";
import { buildMenuPdfBuffer } from "@/lib/site/buildMenuPdf";
import { loadMenuWeekPdfData, menuPdfFilename } from "@/lib/site/menuWeekExport";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? undefined;

  try {
    const data = await loadMenuWeekPdfData(date);
    const buffer = await buildMenuPdfBuffer(data);
    const filename = menuPdfFilename(date);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error("menu pdf", error);
    return NextResponse.json({ ok: false, error: "pdf_failed" }, { status: 500 });
  }
}
