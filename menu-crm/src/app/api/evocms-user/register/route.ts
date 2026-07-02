import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSiteSession } from "@/lib/site/session";
import { hashPassword } from "@/lib/site/password";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  const email = String(body.email ?? "").trim().toLowerCase();
  const username = String(body.username ?? email.split("@")[0] ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || password.length < 6) {
    return NextResponse.json({ status: "error", message: "invalid_fields" }, { status: 422 });
  }

  const exists = await prisma.siteUser.findFirst({ where: { OR: [{ email }, { username }] } });
  if (exists) {
    return NextResponse.json({ status: "error", message: "user_exists" }, { status: 422 });
  }

  const user = await prisma.siteUser.create({
    data: {
      email,
      username,
      passwordHash: await hashPassword(password),
      fullname: String(body.fullname ?? ""),
      phone: String(body.phone ?? ""),
    },
  });
  await createSiteSession(user.id);
  return NextResponse.json({ status: "ok" });
}
