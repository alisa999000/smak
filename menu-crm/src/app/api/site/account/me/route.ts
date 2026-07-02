import { NextResponse } from "next/server";
import { getSiteSessionUser, userToApi } from "@/lib/site/session";

export async function GET() {
  const user = await getSiteSessionUser();
  if (!user) {
    return NextResponse.json({ ok: true, authenticated: false });
  }
  return NextResponse.json({ ok: true, authenticated: true, user: userToApi(user) });
}
