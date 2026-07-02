import { NextResponse } from "next/server";
import { isValidAuthCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const token = store.get("menu_crm_auth")?.value;
  const ok = await isValidAuthCookie(token);
  return NextResponse.json({ ok });
}
