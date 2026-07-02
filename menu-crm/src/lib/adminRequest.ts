import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isValidAuthCookie } from "@/lib/auth";

export async function requireAdminCookie(): Promise<NextResponse | null> {
  const token = (await cookies()).get("menu_crm_auth")?.value;
  if (!(await isValidAuthCookie(token))) {
    return NextResponse.json({ ok: false, error: "Требуется вход в CRM" }, { status: 401 });
  }
  return null;
}
