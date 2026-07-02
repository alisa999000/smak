import { readFile } from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { importWeeklyMenuJson } from "../src/lib/importWeeklyJson";

const jsonPath =
  process.argv[2] ??
  path.resolve(process.cwd(), "../www/smachnaya.ru/assets/data/weekly-menu.json");

async function main() {
  const raw = await readFile(jsonPath, "utf-8");
  const data = JSON.parse(raw);
  const prisma = new PrismaClient();
  try {
    const result = await importWeeklyMenuJson(prisma, data);
    console.log("OK:", jsonPath);
    console.log(result);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
