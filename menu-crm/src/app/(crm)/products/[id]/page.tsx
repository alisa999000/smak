import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../actions";
import { ImageUpload } from "@/components/ImageUpload";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, price: true, images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) {
    notFound();
  }
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const priceRub = product.price ? product.price.amountKop / 100 : "";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/products" className="text-sm text-muted hover:text-accent">
          ← К списку
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Редактирование</h1>
        <p className="mt-1 text-sm text-muted">{product.name}</p>
      </div>

      <form action={updateProduct} className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <input type="hidden" name="id" value={product.id} />
        <label className="block text-sm font-medium text-ink">
          Название
          <input
            name="name"
            required
            defaultValue={product.name}
            className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Категория
          <select name="categoryId" required defaultValue={product.categoryId} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          Артикул
          <input name="sku" defaultValue={product.sku ?? ""} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
        </label>
        <label className="block text-sm font-medium text-ink">
          Цена, ₽
          <input
            name="priceRub"
            type="number"
            min={0}
            step={0.01}
            defaultValue={priceRub === "" ? "" : String(priceRub)}
            className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Вес, г
          <input
            name="weightGrams"
            type="number"
            min={0}
            defaultValue={product.weightGrams ?? ""}
            className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2"
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Описание
          <textarea name="description" rows={3} defaultValue={product.description} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
        </label>
        <label className="block text-sm font-medium text-ink">
          Состав / технология
          <textarea name="composition" rows={4} defaultValue={product.composition} className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-2 outline-none ring-accent focus:ring-2" />
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-bg px-3 py-3 text-sm text-ink">
          <input
            type="checkbox"
            name="defaultInMenuDaily"
            defaultChecked={product.defaultInMenuDaily}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-accent focus:ring-accent"
          />
          <span>
            <span className="font-medium">В меню каждый день</span>
            <span className="mt-0.5 block text-xs font-normal text-muted">
              Автоматически показывать во всех днях недели для любой календарной недели; с конкретного дня можно снять на экране «Меню недели».
            </span>
          </span>
        </label>
        <div>
          <p className="text-sm font-medium text-ink">Добавить фото</p>
          <p className="mt-1 text-xs text-muted">Можно несколько: каждое сохраняется отдельно</p>
          <div className="mt-2">
            <ImageUpload initialPath="" />
          </div>
        </div>
        {product.images.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-ink">Текущие фото</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {product.images.map((im) => (
                <li key={im.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.path} alt="" className="h-16 w-16 rounded-lg border border-line object-cover" />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <button type="submit" className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover">
          Сохранить
        </button>
      </form>
    </div>
  );
}
