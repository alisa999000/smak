import type { PrismaClient } from "@prisma/client";
import { MENU_ROOT_ID, publicId } from "@/lib/site/mappers";

export async function findCategoryByRef(
  prisma: PrismaClient,
  ref: string | number | null | undefined,
) {
  if (ref == null || ref === "") return null;
  const raw = String(ref);

  const bySlug = await prisma.category.findUnique({ where: { slug: raw } });
  if (bySlug) return bySlug;

  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    if (n === MENU_ROOT_ID) return null;
    const byLegacy = await prisma.category.findFirst({ where: { legacyModxId: n } });
    if (byLegacy) return byLegacy;

    const all = await prisma.category.findMany();
    for (const c of all) {
      if (publicId(c.legacyModxId, c.id) === n) return c;
    }
  }

  const byId = await prisma.category.findUnique({ where: { id: raw } });
  if (byId) return byId;

  return null;
}
