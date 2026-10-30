import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = process.env.INITIAL_ADMIN_NAME;
  const email = process.env.INITIAL_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!name || !email || !password || password.length < 16) {
    throw new Error("Set INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL and a unique INITIAL_ADMIN_PASSWORD of at least 16 characters.");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("An account with this admin email already exists.");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      phone: `ADMIN-${Date.now()}`,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      adminProfile: { create: { displayName: name } },
    },
  });
  console.log(`Created initial administrator: ${user.email}`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
