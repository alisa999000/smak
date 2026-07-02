import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [categories, products, weekly, priced] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.weeklyMenuItem.count(),
    prisma.price.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Обзор</h1>
        <p className="mt-1 text-muted">Мини-CRM для меню: номенклатура, неделя, API для сайта и агрегаторов</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Категории" value={categories} href="/categories" />
        <Stat label="Позиции" value={products} href="/products" />
        <Stat label="Слоты в неделе" value={weekly} href="/weekly" />
        <Stat label="Цены заданы" value={priced} href="/products" />
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Быстрые шаги</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>
            Создайте категории в разделе{" "}
            <Link className="text-accent underline" href="/categories">
              Категории
            </Link>
            .
          </li>
          <li>
            Добавьте блюда в{" "}
            <Link className="text-accent underline" href="/products">
              Номенклатура
            </Link>{" "}
            (цена в копейках, вес в граммах, состав, фото).
          </li>
          <li>
            Разложите блюда по дням в{" "}
            <Link className="text-accent underline" href="/weekly">
              Меню недели
            </Link>
            .
          </li>
          <li>
            Заберите JSON для сайта в{" "}
            <Link className="text-accent underline" href="/export">
              Выгрузка / API
            </Link>
            .
          </li>
        </ol>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-accent"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </Link>
  );
}
