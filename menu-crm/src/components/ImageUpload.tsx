"use client";

import { useState } from "react";

type Props = {
  inputName?: string;
  initialPath?: string;
};

export function ImageUpload({ inputName = "imagePath", initialPath = "" }: Props) {
  const [path, setPath] = useState(initialPath);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(f: File | null) {
    setErr(null);
    if (!f) {
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok?: boolean; path?: string; error?: string };
      if (!res.ok || !data.ok || !data.path) {
        throw new Error(data.error ?? "Ошибка загрузки");
      }
      setPath(data.path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={inputName} value={path} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={busy}
        onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-chip file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent"
      />
      {busy ? <p className="text-xs text-muted">Загрузка…</p> : null}
      {err ? <p className="text-xs text-accent">{err}</p> : null}
      {path ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={path} alt="" className="h-20 w-20 rounded-xl border border-line object-cover" />
          <button
            type="button"
            className="text-xs text-muted underline"
            onClick={() => setPath("")}
          >
            убрать фото из формы
          </button>
        </div>
      ) : null}
    </div>
  );
}
