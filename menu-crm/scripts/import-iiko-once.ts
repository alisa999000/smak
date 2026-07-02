import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { importNomenclatureFromIiko } from "../src/lib/iikoImport";

async function main() {
  const prisma = new PrismaClient();
  try {
    const r = await importNomenclatureFromIiko(prisma);
    console.log(JSON.stringify({ ok: true, ...r }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
