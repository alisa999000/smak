import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { importWeeklyMenuJson } from "@/lib/importWeeklyJson";

const DEFAULT_JSON = path.resolve(process.cwd(), "../www/smachnaya.ru/assets/data/weekly-menu.json");

export async function POST(request: Request) {
  try {
    let data: unknown;
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (file instanceof File) {
        data = JSON.parse(await file.text());
      } else {
        const jsonPath = String(form.get("path") ?? DEFAULT_JSON);
        data = JSON.parse(await readFile(jsonPath, "utf-8"));
      }
    } else {
      const body = (await request.json()) as { path?: string; data?: unknown };
      if (body.data) {
        data = body.data;
      } else {
        const jsonPath = body.path ?? DEFAULT_JSON;
        data = JSON.parse(await readFile(jsonPath, "utf-8"));
      }
    }

    const result = await importWeeklyMenuJson(prisma, data as Parameters<typeof importWeeklyMenuJson>[1]);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "import_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
