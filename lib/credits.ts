import { prisma } from "@/lib/prisma";
import { CreditOperation } from "@prisma/client";
import { CREDIT_COSTS } from "@/lib/utils";

export async function getCredits(userId: string) {
  const balance = await prisma.creditBalance.findUnique({
    where: { userId },
  });
  return balance?.balance ?? 0;
}

export async function ensureBalance(userId: string) {
  const existing = await prisma.creditBalance.findUnique({ where: { userId } });
  if (!existing) {
    await prisma.creditBalance.create({
      data: { userId, balance: 0, lifetimeUsed: 0 },
    });
  }
}

export async function hasEnoughCredits(userId: string, cost: number): Promise<boolean> {
  const balance = await getCredits(userId);
  return balance >= cost;
}

export async function consumeCredits(
  userId: string,
  operation: CreditOperation,
  projectId?: string
): Promise<{ success: boolean; error?: string }> {
  const cost = CREDIT_COSTS[operation as keyof typeof CREDIT_COSTS] ?? 0;

  const balance = await prisma.creditBalance.findUnique({ where: { userId } });
  if (!balance || balance.balance < cost) {
    return { success: false, error: "Insufficient credits" };
  }

  await prisma.$transaction([
    prisma.creditBalance.update({
      where: { userId },
      data: {
        balance: { decrement: cost },
        lifetimeUsed: { increment: cost },
      },
    }),
    prisma.creditUsage.create({
      data: {
        userId,
        projectId,
        operation,
        creditsUsed: cost,
        metadata: { operation, cost },
      },
    }),
  ]);

  return { success: true };
}

export async function addCredits(userId: string, amount: number, operation: CreditOperation = "BONUS") {
  await ensureBalance(userId);
  await prisma.$transaction([
    prisma.creditBalance.update({
      where: { userId },
      data: { balance: { increment: amount } },
    }),
    prisma.creditUsage.create({
      data: {
        userId,
        operation,
        creditsUsed: -amount,
        metadata: { action: "add", amount },
      },
    }),
  ]);
}
