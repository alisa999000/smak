"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDaysLocal, formatISODateLocal, normalizeWeekStartISO, parseISODateLocal, startOfWeekMonday } from "@/lib/week";

export type PlannerProduct = { id: string; name: string };

type DayItem = { slotId: string; productId: string; name: string; isDefaultDaily?: boolean };

type DayColumn = {
  dayOfWeek: number;
  date: string;
  weekdayShort: string;
  weekdayFull: string;
  items: DayItem[];
};

function shiftWeekStart(weekStartISO: string, deltaWeeks: number): string {
  const mon = parseISODateLocal(weekStartISO);
  const moved = addDaysLocal(mon, deltaWeeks * 7);
  return formatISODateLocal(startOfWeekMonday(moved));
}

export function WeeklyMenuPlanner({
  products,
  initialWeekStart,
}: {
  products: PlannerProduct[];
  initialWeekStart: string;
}) {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const [days, setDays] = useState<DayColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [copyFromInput, setCopyFromInput] = useState("");
  const [copyBusy, setCopyBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/weekly?weekStart=${encodeURIComponent(weekStart)}`, {
        credentials: "include",
      });
      const j = (await r.json()) as { ok?: boolean; days?: DayColumn[] };
      if (j.days) {
        setDays(j.days);
      }
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setWeekStart(initialWeekStart);
  }, [initialWeekStart]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) {
      return products;
    }
    return products.filter((p) => p.name.toLowerCase().includes(s));
  }, [products, q]);

  const todayISO = formatISODateLocal(new Date());

  async function toggle(dayOfWeek: number, productId: string) {
    const key = `${weekStart}-${dayOfWeek}-${productId}`;
    setBusyKey(key);
    try {
      const r = await fetch("/api/admin/weekly/toggle", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart, dayOfWeek, productId }),
      });
      if (!r.ok) {
        return;
      }
      await load();
      router.refresh();
    } finally {
      setBusyKey(null);
    }
  }

  function onColumnActivate(dow: number) {
    if (!selectedId) {
      return;
    }
    void toggle(dow, selectedId);
  }

  function goWeek(delta: number) {
    const next = shiftWeekStart(weekStart, delta);
    setWeekStart(next);
    router.replace(`/weekly?week=${next}`, { scroll: false });
  }

  function goThisWeek() {
    const next = formatISODateLocal(startOfWeekMonday(new Date()));
    setWeekStart(next);
    router.replace(`/weekly?week=${next}`, { scroll: false });
  }

  async function copyWeek(fromWeekRaw: string) {
    const fromWeekStart = normalizeWeekStartISO(fromWeekRaw);
    if (fromWeekStart === weekStart) {
      return;
    }
    setCopyBusy(true);
    try {
      const r = await fetch("/api/admin/weekly/copy", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromWeekStart, toWeekStart: weekStart }),
      });
      if (!r.ok) {
        return;
      }
      await load();
      router.refresh();
    } finally {
      setCopyBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Меню недели</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Выберите блюдо слева и нажимайте по дням — позиция добавится или снимется в{" "}
          <strong className="font-medium text-ink">этой календарной неделе</strong>. Блюда с галочкой «в меню каждый день» в
          карточке номенклатуры автоматически стоят во всех днях (для каждой недели их можно снять с конкретного дня крестиком).
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => goWeek(-1)}
            className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-chip"
          >
            ← Неделя
          </button>
          <button
            type="button"
            onClick={() => goWeek(1)}
            className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-chip"
          >
            Неделя →
          </button>
          <button
            type="button"
            onClick={goThisWeek}
            className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Сегодняшняя неделя
          </button>
        </div>
        <p className="text-sm text-muted">
          Неделя с <span className="font-medium text-ink">{weekStart}</span>
          {loading ? <span className="ml-2 text-xs">обновление…</span> : null}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={copyBusy}
            onClick={() => void copyWeek(shiftWeekStart(weekStart, -1))}
            className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-chip disabled:opacity-50"
          >
            Копировать с прошлой недели
          </button>
        </div>
        <div className="flex min-w-[200px] flex-1 flex-wrap items-end gap-2">
          <label className="block min-w-[140px] flex-1 text-xs font-medium uppercase tracking-wide text-muted">
            Дата в исходной неделе (любой день)
            <input
              type="date"
              value={copyFromInput}
              onChange={(e) => setCopyFromInput(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink"
            />
          </label>
          <button
            type="button"
            disabled={copyBusy || !copyFromInput}
            onClick={() => void copyWeek(copyFromInput)}
            className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            Копировать сюда
          </button>
        </div>
        {copyBusy ? <span className="text-xs text-muted">копирование…</span> : null}
        <p className="w-full text-xs text-muted">
          Копирование полностью заменяет меню <strong className="text-ink">текущей</strong> выбранной недели ({weekStart}).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <aside className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Поиск блюда
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Начните вводить название…"
              className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink outline-none ring-accent focus:ring-2"
            />
          </label>
          {!selectedId ? (
            <p className="mt-3 rounded-xl bg-chip px-3 py-2 text-xs text-ink">Сначала выберите блюдо ниже</p>
          ) : (
            <p className="mt-3 rounded-xl border border-accent/30 bg-chip px-3 py-2 text-xs text-ink">
              Активно: <span className="font-semibold">{products.find((p) => p.id === selectedId)?.name}</span>
              <button
                type="button"
                className="ml-2 text-accent underline"
                onClick={() => setSelectedId(null)}
              >
                снять выбор
              </button>
            </p>
          )}
          <ul className="mt-4 max-h-[min(60vh,560px)] space-y-1 overflow-y-auto pr-1">
            {filtered.map((p) => {
              const active = selectedId === p.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(active ? null : p.id)}
                    className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-chip font-semibold text-accent ring-2 ring-accent/40"
                        : "text-ink hover:bg-bg"
                    }`}
                  >
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
          {filtered.length === 0 ? <p className="mt-4 text-sm text-muted">Ничего не найдено</p> : null}
        </aside>

        <section className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <div className="grid min-w-[720px] grid-cols-7 divide-x divide-line">
            {days.map((col) => {
              const isToday = col.date === todayISO;
              const dateObj = parseISODateLocal(col.date);
              const sub = dateObj.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
              const clickable = Boolean(selectedId);
              return (
                <div key={col.date} className="flex min-h-[420px] flex-col bg-surface">
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() => onColumnActivate(col.dayOfWeek)}
                    className={`border-b border-line px-2 py-3 text-left transition ${
                      clickable ? "cursor-pointer hover:bg-chip" : "cursor-default"
                    } ${isToday ? "bg-chip/80" : ""}`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {col.weekdayShort}
                    </div>
                    <div className="text-sm font-semibold text-ink">{col.weekdayFull}</div>
                    <div className="text-xs text-muted">{sub}</div>
                    {clickable ? (
                      <div className="mt-2 text-[11px] leading-tight text-muted">Нажмите, чтобы добавить/убрать выбранное блюдо</div>
                    ) : (
                      <div className="mt-2 text-[11px] text-muted">Выберите блюдо слева</div>
                    )}
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-2">
                    {col.items.map((it) => {
                      const busy = busyKey === `${weekStart}-${col.dayOfWeek}-${it.productId}`;
                      return (
                        <div
                          key={it.slotId}
                          className="group flex items-start justify-between gap-2 rounded-xl border border-line bg-bg px-2 py-2 text-xs text-ink"
                        >
                          <span className="leading-snug">
                            {it.name}
                            {it.isDefaultDaily ? (
                              <span className="ml-1 rounded bg-chip px-1 py-0.5 text-[10px] font-medium uppercase text-muted">
                                кажд. д.
                              </span>
                            ) : null}
                          </span>
                          <button
                            type="button"
                            disabled={busy}
                            title="Убрать из дня"
                            onClick={(e) => {
                              e.stopPropagation();
                              void toggle(col.dayOfWeek, it.productId);
                            }}
                            className="shrink-0 rounded-md px-1.5 text-muted hover:bg-chip hover:text-accent disabled:opacity-40"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    {col.items.length === 0 ? (
                      <p className="px-1 py-4 text-center text-xs text-muted">Пусто</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <p className="text-xs text-muted">
        Публичный API: <code className="rounded bg-bg px-1">GET /api/v1/menu/week?weekStart=YYYY-MM-DD</code> — в ответе
        слив явного меню недели и блюд «каждый день» (с учётом снятий с дней). Копирование:{" "}
        <code className="rounded bg-bg px-1">POST /api/admin/weekly/copy</code> с телом{" "}
        <code className="rounded bg-bg px-1">{`{ "fromWeekStart", "toWeekStart" }`}</code>.
      </p>
    </div>
  );
}
