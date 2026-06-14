import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Coins } from "lucide-react";

export default async function DashboardHeader({ user }: { user: { id?: string; name?: string | null } }) {
  let credits = 0;
  if (user.id) {
    const balance = await prisma.creditBalance.findUnique({ where: { userId: user.id } });
    credits = balance?.balance ?? 0;
  }

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900 px-6 flex items-center justify-end gap-4">
      <div className="flex items-center gap-1.5 bg-zinc-800 rounded-lg px-3 py-1.5">
        <Coins className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-sm text-zinc-200 font-medium">{credits.toLocaleString()}</span>
        <span className="text-xs text-zinc-500">credits</span>
      </div>
    </header>
  );
}
