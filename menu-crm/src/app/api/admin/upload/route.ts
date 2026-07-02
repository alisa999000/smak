import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdminCookie } from "@/lib/adminRequest";

export async function POST(request: Request) {
  const denied = await requireAdminCookie();
  if (denied) {
    return denied;
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Нет файла" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Файл больше 5 МБ" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || "") || ".jpg";
  const name = `${randomUUID()}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const diskPath = path.join(dir, name);
  await writeFile(diskPath, buf);
  const publicPath = `/uploads/${name}`;
  return NextResponse.json({ ok: true, path: publicPath });
}
