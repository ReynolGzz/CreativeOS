import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("demo123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@creativeos.ai" },
    update: {},
    create: {
      email: "demo@creativeos.ai",
      name: "Demo User",
      password: hashedPassword,
      emailVerified: new Date(),
      creditBalance: {
        create: {
          balance: 200,
          lifetimeUsed: 0,
        },
      },
    },
  });

  console.log(`Seeded user: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
