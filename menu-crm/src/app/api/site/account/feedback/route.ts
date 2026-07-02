import { NextResponse } from "next/server";

/**
 * TODO: SMTP — отправка писем о заявке на дегустацию.
 * Получатели: smachnayatochka@mail.ru, syasik13@gmail.com
 * (см. SiteSettings.notifyEmail / .env SMTP_*).
 * Сейчас заявка только логируется в консоль.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  console.info("[feedback] заявка (SMTP не настроен):", body);
  return NextResponse.json({ ok: true, message: "Заявка принята" });
}
