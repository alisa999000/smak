async function sha256Hex(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedAuthToken(): Promise<string> {
  const secret = process.env.COOKIE_SECRET ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!secret || !password) {
    return "";
  }
  return sha256Hex(`${secret}:${password}`);
}

export async function isValidAuthCookie(value: string | undefined): Promise<boolean> {
  const expected = await expectedAuthToken();
  if (!expected || !value) {
    return false;
  }
  return value === expected;
}
