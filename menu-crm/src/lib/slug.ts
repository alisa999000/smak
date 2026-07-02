export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  const lower = input.trim().toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += map[ch] ?? ch;
  }
  return out
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "item";
}

export async function uniqueProductSlug(base: string, excludeId?: string) {
  const { prisma } = await import("@/lib/prisma");
  let slug = slugify(base);
  let n = 1;
  while (true) {
    const found = await prisma.product.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!found) return slug;
    slug = `${slugify(base)}-${n++}`;
  }
}

export async function uniqueCategorySlug(base: string, excludeId?: string) {
  const { prisma } = await import("@/lib/prisma");
  let slug = slugify(base);
  let n = 1;
  while (true) {
    const found = await prisma.category.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!found) return slug;
    slug = `${slugify(base)}-${n++}`;
  }
}

export async function uniquePageSlug(base: string, excludeId?: string) {
  const { prisma } = await import("@/lib/prisma");
  let slug = slugify(base);
  let n = 1;
  while (true) {
    const found = await prisma.page.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!found) return slug;
    slug = `${slugify(base)}-${n++}`;
  }
}
