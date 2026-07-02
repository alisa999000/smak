import { NextResponse } from "next/server";

export function requireApiKey(request: Request): NextResponse | null {
  const expected = process.env.PUBLIC_API_KEY ?? "";
  if (!expected) {
    return NextResponse.json({ ok: false, error: "PUBLIC_API_KEY не задан" }, { status: 500 });
  }
  const key = request.headers.get("x-api-key") ?? request.headers.get("X-Api-Key");
  if (key !== expected) {
    return NextResponse.json({ ok: false, error: "Неверный или отсутствует заголовок X-Api-Key" }, { status: 401 });
  }
  return null;
}
