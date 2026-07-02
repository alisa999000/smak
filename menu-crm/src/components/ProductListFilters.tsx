"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ProductFilterCategory = { id: string; name: string };

export function ProductListFilters({ categories }: { categories: ProductFilterCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") === "list" ? "list" : "grid";
  const category = searchParams.get("category") ?? "";

  const pushQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(patch)) {
        if (val === undefined || val === "") {
          p.delete(key);
        } else {
          p.set(key, val);
        }
      }
      const q = p.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span className="shrink-0">Категория</span>
        <select
          className="min-w-[12rem] rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink shadow-sm"
          value={category}
          onChange={(e) => {
            const v = e.target.value;
            pushQuery({ category: v || undefined, view: view === "list" ? "list" : undefined });
          }}
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex rounded-xl border border-line bg-bg p-0.5 shadow-sm" role="group" aria-label="Вид списка">
        <button
          type="button"
          onClick={() => pushQuery({ view: undefined, category: category || undefined })}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "grid" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          Плитка
        </button>
        <button
          type="button"
          onClick={() => pushQuery({ view: "list", category: category || undefined })}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            view === "list" ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          Список
        </button>
      </div>
    </div>
  );
}
