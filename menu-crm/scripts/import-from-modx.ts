/**
 * Одноразовый импорт каталога и страниц из Evolution CMS (пока PHP ещё доступен).
 * Запуск: MODX_URL=http://127.0.0.1:8090 npx tsx scripts/import-from-modx.ts
 */
import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();
const MODX = process.env.MODX_URL ?? "http://127.0.0.1:8090";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${MODX}${path}`);
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function main() {
  const categories = await fetchJson<{ ok: boolean; categories: Array<{ id: number; alias: string; pagetitle: string; menuindex: number }> }>(
    "/api/site/catalog/categories?parent=2",
  );

  const catMap = new Map<number, string>();
  for (const c of categories.categories) {
    const row = await prisma.category.upsert({
      where: { legacyModxId: c.id },
      create: {
        legacyModxId: c.id,
        slug: c.alias || slugify(c.pagetitle),
        name: c.pagetitle,
        sortOrder: c.menuindex,
      },
      update: { name: c.pagetitle, slug: c.alias || slugify(c.pagetitle), sortOrder: c.menuindex },
    });
    catMap.set(c.id, row.id);
  }

  for (const [legacyCatId, categoryId] of catMap) {
    const products = await fetchJson<{ ok: boolean; products: Array<Record<string, unknown>> }>(
      `/api/site/catalog/products?parent=${legacyCatId}&depth=1`,
    );
    for (const p of products.products) {
      const alias = String(p.alias ?? slugify(String(p.pagetitle ?? "product")));
      const tvs = (p.tvs ?? {}) as Record<string, string>;
      const priceRub = Number(tvs.price ?? 0);
      const product = await prisma.product.upsert({
        where: { legacyModxId: Number(p.id) },
        create: {
          legacyModxId: Number(p.id),
          slug: alias,
          name: String(p.pagetitle ?? alias),
          description: String(p.introtext ?? ""),
          composition: String(tvs.sostav ?? ""),
          weightGrams: tvs.massa ? Number(tvs.massa) : null,
          categoryId,
          images: tvs.image ? { create: [{ path: tvs.image, sortOrder: 0 }] } : undefined,
        },
        update: {
          slug: alias,
          name: String(p.pagetitle ?? alias),
          composition: String(tvs.sostav ?? ""),
          weightGrams: tvs.massa ? Number(tvs.massa) : null,
          categoryId,
        },
      });
      if (priceRub > 0) {
        await prisma.price.upsert({
          where: { productId: product.id },
          create: { productId: product.id, amountKop: Math.round(priceRub * 100) },
          update: { amountKop: Math.round(priceRub * 100) },
        });
      }
      if (tvs.image) {
        const imgs = await prisma.productImage.findMany({ where: { productId: product.id } });
        if (!imgs.length) {
          await prisma.productImage.create({ data: { productId: product.id, path: tvs.image, sortOrder: 0 } });
        }
      }
    }
  }

  await prisma.page.upsert({
    where: { slug: "menyu" },
    create: { slug: "menyu", legacyModxId: 2, pagetitle: "Меню", isfolder: true, template: 1 },
    update: { pagetitle: "Меню", isfolder: true },
  });

  console.log("Import from MODX completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
