import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSiteSessionUser, userToApi } from "@/lib/site/session";

export async function POST(request: Request) {
  const user = await getSiteSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });

  const body = (await request.json()) as Record<string, unknown>;
  const extended = typeof body.extended === "object" && body.extended ? (body.extended as Record<string, unknown>) : {};
  const updated = await prisma.siteUser.update({
    where: { id: user.id },
    data: {
      fullname: body.fullname != null ? String(body.fullname) : user.fullname,
      phone: body.phone != null ? String(body.phone) : user.phone,
      email: body.email != null ? String(body.email) : user.email,
      accountType: body.accountType != null ? String(body.accountType) : user.accountType,
      extendedJson: JSON.stringify(extended),
    },
  });
  return NextResponse.json({ ok: true, user: userToApi(updated) });
}
