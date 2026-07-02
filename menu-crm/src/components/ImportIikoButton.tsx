"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ImportIikoButton() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/import/iiko", { method: "POST", credentials: "include" });
      const j = (await r.json()) as {
        ok?: boolean;
        error?: string;
        createdProducts?: number;
        updatedProducts?: number;
        categoriesTouched?: number;
        skipped?: number;
      };
      if (!r.ok || !j.ok) {
        throw new Error(j.error ?? `HTTP ${r.status}`);
      }
      setMsg(
        `Готово: добавлено ${j.createdProducts ?? 0}, обновлено ${j.updatedProducts ?? 0}, новых категорий ${j.categoriesTouched ?? 0}, пропущено без группы ${j.skipped ?? 0}.`,
      );
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => void run()}
        className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
      >
        {busy ? "Импорт…" : "Забрать номенклатуру из iiko сейчас"}
      </button>
      {msg ? <p className="text-sm text-ink">{msg}</p> : null}
    </div>
  );
}
