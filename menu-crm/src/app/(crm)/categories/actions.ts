"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uniqueCategorySlug } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/categories?e=name");
  }
  const maxSort = await prisma.category.aggregate({ _max: { sortOrder: true } });
  const slug = await uniqueCategorySlug(name);
  await prisma.category.create({
    data: { name, slug, sortOrder: (maxSort._max.sortOrder ?? 0) + 1 },
  });
  revalidatePath("/categories");
  redirect("/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    redirect("/categories?e=has_products");
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
  redirect("/categories");
}
