import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSessionUser } from "@/lib/site/session";
import { hashPassword, verifyPassword } from "@/lib/site/password";

export async function POST(request: Request) {
  const user = await getSiteSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });

  const body = (await request.json()) as Record<string, string>;
  const current = body.currentPassword ?? "";
  const next = body.newPassword ?? "";
  const repeat = body.repeatPassword ?? "";
  if (next.length < 6) return NextResponse.json({ ok: false, error: "password_too_short" }, { status: 422 });
  if (next !== repeat) return NextResponse.json({ ok: false, error: "password_mismatch" }, { status: 422 });
  const ok = await verifyPassword(current, user.passwordHash);
  if (!ok) return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 422 });

  await prisma.siteUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });
  return NextResponse.json({ ok: true });
}
