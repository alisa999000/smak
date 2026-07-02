import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { importNomenclatureFromIiko } from "@/lib/iikoImport";

export async function POST() {
  try {
    const result = await importNomenclatureFromIiko(prisma);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ошибка импорта";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
