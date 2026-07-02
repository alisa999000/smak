import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductListFilters } from "@/components/ProductListFilters";
import { deleteProduct } from "./actions";

type PageProps = {
  searchParams: Promise<{ view?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const view = sp.view === "list" ? "list" : "grid";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  const allowedIds = new Set(categories.map((c) => c.id));
  const rawCat = (sp.category ?? "").trim();
  const categoryFilter = rawCat && allowedIds.has(rawCat) ? rawCat : undefined;

  const products = await prisma.product.findMany({
    where: categoryFilter ? { categoryId: categoryFilter } : undefined,
    orderBy: { name: "asc" },
    include: { category: true, price: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Номенклатура</h1>
          <p className="mt-1 text-sm text-muted">Блюда, цены, вес, состав, фото</p>
        </div>
        <Link
          href="/products/new"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Добавить блюдо
        </Link>
      </div>

      <Suspense
        fallback={<div className="h-11 max-w-xl animate-pulse rounded-xl bg-chip" aria-hidden />}
      >
        <ProductListFilters categories={categories} />
      </Suspense>

      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {products.map((p) => (
            <ProductRow key={p.id} p={p} />
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-muted">
          {categoryFilter ? (
            <>В этой категории пока нет позиций. Сбросьте фильтр или добавьте блюдо.</>
          ) : (
            <>
              Пока пусто. Создайте{" "}
              <Link className="text-accent underline" href="/categories">
                категории
              </Link>{" "}
              и добавьте первое блюдо.
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}

type ProductRow = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  category: { name: string };
  price: { amountKop: number } | null;
  images: { path: string }[];
};

function priceRub(p: ProductRow) {
  return p.price ? p.price.amountKop / 100 : null;
}

function ProductCard({ p }: { p: ProductRow }) {
  const rub = priceRub(p);
  const img = p.images[0]?.path;
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex h-36 items-center justify-center bg-bg">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted">Нет фото</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-muted">{p.category.name}</p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{p.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description || "—"}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-ink">{rub !== null ? `${rub} ₽` : "—"}</span>
          <div className="flex gap-2">
            <Link href={`/products/${p.id}`} className="text-sm font-medium text-accent hover:underline">
              Изменить
            </Link>
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={p.id} />
              <button type="submit" className="text-sm text-muted hover:text-accent">
                Удалить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({ p }: { p: ProductRow }) {
  const rub = priceRub(p);
  const img = p.images[0]?.path;
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg sm:h-16 sm:w-16">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="px-1 text-center text-[10px] text-muted">Нет фото</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-muted">{p.category.name}</p>
        <h2 className="truncate font-semibold text-ink">{p.name}</h2>
        <p className="line-clamp-1 text-sm text-muted">{p.description || "—"}</p>
      </div>
      <span className="shrink-0 text-base font-semibold text-ink sm:min-w-[4.5rem] sm:text-right">
        {rub !== null ? `${rub} ₽` : "—"}
      </span>
      <div className="flex w-full shrink-0 justify-end gap-3 sm:w-auto sm:justify-start">
        <Link href={`/products/${p.id}`} className="text-sm font-medium text-accent hover:underline">
          Изменить
        </Link>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={p.id} />
          <button type="submit" className="text-sm text-muted hover:text-accent">
            Удалить
          </button>
        </form>
      </div>
    </div>
  );
}
