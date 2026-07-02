import { WeeklyMenuPlanner } from "@/components/WeeklyMenuPlanner";
import { prisma } from "@/lib/prisma";
import { normalizeWeekStartISO } from "@/lib/week";

export default async function WeeklyPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const sp = await searchParams;
  const week = normalizeWeekStartISO(sp.week);
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <WeeklyMenuPlanner products={products} initialWeekStart={week} />;
}
