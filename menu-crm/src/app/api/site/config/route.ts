import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCsrfToken } from "@/lib/site/session";
import { settingsToConfig } from "@/lib/site/mappers";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    return NextResponse.json({ ok: false, error: "settings_missing" }, { status: 500 });
  }
  const csrfToken = await getOrCreateCsrfToken();
  return NextResponse.json(settingsToConfig(settings, csrfToken));
}
