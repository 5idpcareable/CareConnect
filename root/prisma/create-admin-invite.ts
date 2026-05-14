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

async function main() {
  const email = process.argv[2];

  const token = crypto.randomBytes(24).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite = await prisma.adminInvite.create({
    data: {
      token,
      email: email || null,
      expiresAt,
    },
  });

  console.log("Admin invite created:");
  console.log(`Token: ${invite.token}`);
  console.log(`Expires: ${invite.expiresAt.toISOString()}`);

  if (invite.email) {
    console.log(`Email: ${invite.email}`);
  }

  console.log("");
  console.log("Signup URL:");
  console.log(`http://localhost:3000/register/admin?token=${invite.token}`);
}

main()
  .catch((error) => {
    console.error("Failed to create admin invite:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
