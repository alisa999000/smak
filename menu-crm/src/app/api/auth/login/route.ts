import { NextResponse } from "next/server";
import { expectedAuthToken } from "@/lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const token = await expectedAuthToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "COOKIE_SECRET или ADMIN_PASSWORD не заданы в .env" }, { status: 500 });
  }
  if (password !== (process.env.ADMIN_PASSWORD ?? "")) {
    return NextResponse.redirect(new URL("/login?e=1", request.url));
  }
  const res = NextResponse.redirect(new URL("/dashboard", request.url));
  res.cookies.set("menu_crm_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
