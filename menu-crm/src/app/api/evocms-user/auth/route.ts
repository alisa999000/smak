import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSiteSession } from "@/lib/site/session";
import { userToApi } from "@/lib/site/session";
import { verifyPassword } from "@/lib/site/password";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string; _token?: string };
  const login = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!login || !password) {
    return NextResponse.json({ status: "error", message: "missing_credentials" }, { status: 422 });
  }

  const user = await prisma.siteUser.findFirst({
    where: { OR: [{ username: login }, { email: login }] },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ status: "error", message: "auth_failed" }, { status: 401 });
  }

  await createSiteSession(user.id);
  return NextResponse.json({ status: "ok", user: userToApi(user) });
}
