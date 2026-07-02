/** Понедельник календарной недели для переданной даты (локальное время). */
export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Индекс дня: 0 = понедельник … 6 = воскресенье. */
export function dayIndexMonSun(d: Date): number {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1;
}

const RU_DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

const RU_DAYS_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

export function weekdayLabelMonSun(index: number): string {
  return RU_DAYS[index] ?? "";
}

export function weekdayShortMonSun(index: number): string {
  return RU_DAYS_SHORT[index] ?? "";
}

/** Локальная дата YYYY-MM-DD (без UTC-сдвига). */
export function formatISODateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Парсинг YYYY-MM-DD в локальную дату (полдень, чтобы избежать границ суток). */
export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) {
    return new Date();
  }
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function addDaysLocal(d: Date, days: number): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
  x.setDate(x.getDate() + days);
  return x;
}

/** Любая дата → понедельник недели в формате YYYY-MM-DD. */
export function normalizeWeekStartISO(iso: string | undefined | null): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return formatISODateLocal(startOfWeekMonday(new Date()));
  }
  return formatISODateLocal(startOfWeekMonday(parseISODateLocal(iso)));
}
