import Link from "next/link";

const nav = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/categories", label: "Категории" },
  { href: "/products", label: "Номенклатура" },
  { href: "/weekly", label: "Меню недели" },
  { href: "/import/iiko", label: "Импорт iiko" },
  { href: "/export", label: "Выгрузка / API" },
];

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-ink">
            Смачная <span className="text-muted font-normal">· меню</span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-sm text-ink hover:bg-chip hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-accent"
            >
              Выйти
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
