import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const CSRF_COOKIE = "site_csrf";
const SESSION_COOKIE = "site_session";
const CART_COOKIE = "site_cart";

export function newToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export async function getOrCreateCsrfToken(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = newToken(16);
  jar.set(CSRF_COOKIE, token, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 86400 });
  return token;
}

export async function getSiteSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.siteSession.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.siteSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function createSiteSession(userId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + 30 * 86400_000);
  await prisma.siteSession.create({ data: { token, userId, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 30 * 86400 });
  return token;
}

export async function destroySiteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.siteSession.deleteMany({ where: { token } });
    jar.delete(SESSION_COOKIE);
  }
}

export async function getOrCreateCartSession() {
  const jar = await cookies();
  let token = jar.get(CART_COOKIE)?.value;
  let session = token
    ? await prisma.cartSession.findUnique({ where: { token }, include: { items: { include: { product: { include: { category: true, price: true, images: true } } } } } })
    : null;
  if (session && session.expiresAt < new Date()) {
    await prisma.cartSession.delete({ where: { id: session.id } });
    session = null;
  }
  if (!session) {
    token = newToken();
    session = await prisma.cartSession.create({
      data: { token, expiresAt: new Date(Date.now() + 14 * 86400_000) },
      include: { items: { include: { product: { include: { category: true, price: true, images: true } } } } },
    });
    jar.set(CART_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 14 * 86400 });
  }
  return session;
}

export function userToApi(user: {
  id: string;
  legacyModxId: number | null;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  accountType: string;
  extendedJson: string;
}) {
  let extended: Record<string, unknown> = {};
  try {
    extended = JSON.parse(user.extendedJson) as Record<string, unknown>;
  } catch {
    extended = {};
  }
  return {
    id: user.legacyModxId ?? user.id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
    phone: user.phone,
    accountType: user.accountType,
    extended,
  };
}
