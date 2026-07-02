"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uniqueProductSlug } from "@/lib/slug";

function num(formData: FormData, key: string): number | null {
  const v = String(formData.get(key) ?? "").trim();
  if (v === "") {
    return null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function boolCheckbox(formData: FormData, key: string): boolean {
  const v = formData.get(key);
  return v === "on" || v === "true" || v === "1";
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!name || !categoryId) {
    redirect("/products/new?e=required");
  }
  const product = await prisma.product.create({
    data: {
      name,
      slug: await uniqueProductSlug(name),
      sku: String(formData.get("sku") ?? "").trim() || null,
      description: String(formData.get("description") ?? ""),
      composition: String(formData.get("composition") ?? ""),
      weightGrams: num(formData, "weightGrams"),
      categoryId,
      defaultInMenuDaily: boolCheckbox(formData, "defaultInMenuDaily"),
    },
  });
  const priceRub = num(formData, "priceRub");
  if (priceRub !== null && priceRub >= 0) {
    await prisma.price.create({ data: { productId: product.id, amountKop: Math.round(priceRub * 100) } });
  }
  const img = String(formData.get("imagePath") ?? "").trim();
  if (img) {
    await prisma.productImage.create({ data: { productId: product.id, path: img, sortOrder: 0 } });
  }
  revalidatePath("/products");
  revalidatePath("/weekly");
  redirect(`/products/${product.id}`);
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/products");
  }
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!name || !categoryId) {
    redirect(`/products/${id}?e=required`);
  }
  const defaultInMenuDaily = boolCheckbox(formData, "defaultInMenuDaily");
  await prisma.product.update({
    where: { id },
    data: {
      name,
      sku: String(formData.get("sku") ?? "").trim() || null,
      description: String(formData.get("description") ?? ""),
      composition: String(formData.get("composition") ?? ""),
      weightGrams: num(formData, "weightGrams"),
      categoryId,
      defaultInMenuDaily,
    },
  });
  if (!defaultInMenuDaily) {
    await prisma.weeklyMenuDefaultExclusion.deleteMany({ where: { productId: id } });
  }
  const priceRub = num(formData, "priceRub");
  if (priceRub !== null && priceRub >= 0) {
    const kop = Math.round(priceRub * 100);
    await prisma.price.upsert({
      where: { productId: id },
      create: { productId: id, amountKop: kop },
      update: { amountKop: kop },
    });
  }
  const img = String(formData.get("imagePath") ?? "").trim();
  if (img) {
    const existing = await prisma.productImage.findFirst({ where: { productId: id, path: img } });
    if (!existing) {
      const max = await prisma.productImage.aggregate({ where: { productId: id }, _max: { sortOrder: true } });
      await prisma.productImage.create({
        data: { productId: id, path: img, sortOrder: (max._max.sortOrder ?? -1) + 1 },
      });
    }
  }
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/weekly");
  redirect(`/products/${id}`);
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/weekly");
  redirect("/products");
}
