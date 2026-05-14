import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding roles...");

  await prisma.role.upsert({
    where: { id: 1 },
    update: { name: "carer" },
    create: {
      id: 1,
      name: "carer",
    },
  });

  await prisma.role.upsert({
    where: { id: 2 },
    update: { name: "admin" },
    create: {
      id: 2,
      name: "admin",
    },
  });

  await prisma.role.upsert({
    where: { id: 3 },
    update: { name: "employer" },
    create: {
      id: 3,
      name: "employer",
    },
  });

  await prisma.role.upsert({
    where: { id: 4 },
    update: { name: "super_admin" },
    create: {
      id: 4,
      name: "super_admin",
    },
  });

  console.log("Roles seeded.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
