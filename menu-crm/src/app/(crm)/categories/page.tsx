import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Категории</h1>
          <p className="mt-1 text-sm text-muted">Группы блюд для карточек и выгрузок</p>
        </div>
        <Link
          href="/products/new"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Новая позиция
        </Link>
      </div>

      {sp.e === "has_products" ? (
        <p className="rounded-xl border border-line bg-chip px-4 py-3 text-sm text-ink">
          Нельзя удалить категорию с блюдами. Перенесите или удалите позиции.
        </p>
      ) : null}
      {sp.e === "name" ? <p className="text-sm text-accent">Введите название</p> : null}

      <form action={createCategory} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
        <label className="min-w-[200px] flex-1 text-sm font-medium text-ink">
          Новая категория
          <input
            name="name"
            required
            placeholder="Например: Горячее"
            className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 text-ink outline-none ring-accent focus:ring-2"
          />
        </label>
        <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          Добавить
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-bg text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Позиций</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-muted">{c._count.products}</td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteCategory} className="inline">
                    <input type="hidden" name="id" value={c.id} />
                    <button
                      type="submit"
                      className="text-xs text-accent hover:underline disabled:opacity-40"
                      disabled={c._count.products > 0}
                    >
                      Удалить
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
