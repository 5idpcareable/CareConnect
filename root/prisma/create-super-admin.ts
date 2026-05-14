import "dotenv/config";
import crypto from "crypto";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../app/generated/prisma";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({
  adapter,
});

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return `${salt}:${hash}`;
}

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error("Usage:");
    console.error("npx tsx prisma/create-super-admin.ts email@example.com password123");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await prisma.role.upsert({
    where: { id: 4 },
    update: { name: "super_admin" },
    create: {
      id: 4,
      name: "super_admin",
    },
  });

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: true,
    },
  });

  if (existingUser) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: existingUser.id,
          roleId: 4,
        },
      },
      update: {},
      create: {
        userId: existingUser.id,
        roleId: 4,
      },
    });

    console.log("Existing user promoted to super_admin.");
    console.log(`Email: ${email}`);
    return;
  }

  await prisma.user.create({
    data: {
      firstName: "Super",
      lastName: "Admin",
      email,
      phone: "0000000000",
      dateOfBirth: "2000-01-01",
      postcode: "0000",
      passwordHash: hashPassword(password),
      roles: {
        create: {
          roleId: 4,
        },
      },
    },
  });

  console.log("Super admin created.");
  console.log(`Email: ${email}`);
}

main()
  .catch((error) => {
    console.error("Failed to create super admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
