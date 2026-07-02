import { NextResponse } from "next/server";
import { destroySiteSession } from "@/lib/site/session";

export async function POST() {
  await destroySiteSession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  await destroySiteSession();
  return NextResponse.redirect(new URL("/", process.env.SITE_URL ?? "http://127.0.0.1:5173"));
}
