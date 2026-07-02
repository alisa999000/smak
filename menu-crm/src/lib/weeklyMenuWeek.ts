import type { PrismaClient } from "@prisma/client";
import { formatISODateLocal, startOfWeekMonday } from "@/lib/week";

/** Старые записи без недели: один раз переносим на «текущую» понедельник сервера, чтобы не потерять данные. */
export async function migrateLegacyWeeklyMenuItems(prisma: PrismaClient): Promise<void> {
  const n = await prisma.weeklyMenuItem.count({ where: { weekStart: "" } });
  if (n === 0) {
    return;
  }
  const anchor = formatISODateLocal(startOfWeekMonday(new Date()));
  await prisma.weeklyMenuItem.updateMany({
    where: { weekStart: "" },
    data: { weekStart: anchor },
  });
}
