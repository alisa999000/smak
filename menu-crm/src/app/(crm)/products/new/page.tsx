import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";
import { ImageUpload } from "@/components/ImageUpload";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/products" className="text-sm text-muted hover:text-accent">
          ← К списку
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Новое блюдо</h1>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted">
          Сначала создайте{" "}
          <Link href="/categories" className="text-accent underline">
            категорию
          </Link>
          .
        </p>
      ) : (
        <form action={createProduct} className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <label className="block text-sm font-medium text-ink">
            Название
            <input name="name" required className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Категория
            <select name="categoryId" required className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-ink">
            Артикул (необязательно)
            <input name="sku" className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Цена, ₽
            <input name="priceRub" type="number" min={0} step={0.01} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Вес, г
            <input name="weightGrams" type="number" min={0} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Описание для гостя
            <textarea name="description" rows={3} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="block text-sm font-medium text-ink">
            Состав / технология
            <textarea name="composition" rows={4} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink">
            <input
              type="checkbox"
              name="defaultInMenuDaily"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-accent focus:ring-accent"
            />
            <span>
              <span className="font-medium">В меню каждый день</span>
              <span className="mt-0.5 block text-xs font-normal text-muted">
                По умолчанию во всех днях любой недели; снятие с отдельного дня — в разделе «Меню недели».
              </span>
            </span>
          </label>
          <div>
            <p className="text-sm font-medium text-ink">Фото</p>
            <p className="mt-1 text-xs text-muted">JPEG / PNG / WebP, до 5 МБ</p>
            <div className="mt-2">
              <ImageUpload />
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover">
            Создать
          </button>
        </form>
      )}
    </div>
  );
}
