import { NextResponse } from "next/server";
import { expectedAuthToken } from "@/lib/auth";

async function readPassword(request: Request): Promise<string> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { password?: string };
    return String(body.password ?? "");
  }
  const form = await request.formData();
  return String(form.get("password") ?? "");
}

export async function POST(request: Request) {
  try {
    const password = await readPassword(request);
    const token = await expectedAuthToken();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "COOKIE_SECRET или ADMIN_PASSWORD не заданы в .env" },
        { status: 500 },
      );
    }
    if (password !== (process.env.ADMIN_PASSWORD ?? "")) {
      return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
    }

    const wantsJson =
      (request.headers.get("accept") ?? "").includes("application/json") ||
      (request.headers.get("content-type") ?? "").includes("application/json");

    const res = wantsJson
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL("/dashboard", request.url), 303);

    res.cookies.set("menu_crm_auth", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "login_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
