import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isValidAuthCookie } from "@/lib/auth";

const protectedPrefixes = ["/dashboard", "/products", "/weekly", "/categories", "/pages", "/export", "/import"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/site") ||
    pathname.startsWith("/api/v1") ||
    pathname.startsWith("/commerce") ||
    pathname.startsWith("/evocms-user")
  ) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("menu_crm_auth")?.value;
    const ok = await isValidAuthCookie(token);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "Нужен вход в CRM" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname === "/login") {
    return NextResponse.next();
  }

  if (protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const token = request.cookies.get("menu_crm_auth")?.value;
    const ok = await isValidAuthCookie(token);
    if (!ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads).*)"],
};
