import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const balance = await prisma.creditBalance.findUnique({
    where: { userId: session.user.id },
  });

  const recentUsage = await prisma.creditUsage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({
    balance: balance?.balance ?? 0,
    lifetimeUsed: balance?.lifetimeUsed ?? 0,
    recentUsage,
  });
}
