import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Coins, Zap, TrendingUp } from "lucide-react";
import AddCreditsButton from "@/components/billing/AddCreditsButton";

const plans = [
  { name: "Starter", credits: 100, price: "$9", description: "Perfect for testing", popular: false },
  { name: "Creator", credits: 500, price: "$29", description: "For active creators", popular: true },
  { name: "Scale", credits: 2000, price: "$79", description: "For teams and agencies", popular: false },
];

const operations = [
  { name: "Analyze Product", cost: 1, icon: "🔍" },
  { name: "Generate Strategy (10 angles)", cost: 2, icon: "🎯" },
  { name: "Generate Single Image", cost: 5, icon: "🖼️" },
  { name: "Generate Full Pack (10 ads)", cost: 50, icon: "⚡" },
  { name: "Analyze Competitor", cost: 10, icon: "🕵️" },
];

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const balance = await prisma.creditBalance.findUnique({ where: { userId: session.user.id } });
  const recentUsage = await prisma.creditUsage.findMany({
    where: { userId: session.user.id, creditsUsed: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Billing & Credits</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Credits Available", value: balance?.balance ?? 0, icon: Coins, color: "text-yellow-400" },
          { label: "Credits Used (Lifetime)", value: balance?.lifetimeUsed ?? 0, icon: TrendingUp, color: "text-violet-400" },
          { label: "Total Ads Possible", value: Math.floor((balance?.balance ?? 0) / 50), icon: Zap, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-zinc-400 text-xs">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Add Credits</h2>
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-zinc-900 border rounded-xl p-5 relative ${
              plan.popular ? "border-violet-600/50" : "border-zinc-800"
            }`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="text-white font-semibold">{plan.name}</h3>
              <p className="text-zinc-400 text-xs mt-0.5 mb-3">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">{plan.credits} credits</span>
              </div>
              <AddCreditsButton credits={plan.credits} price={plan.price} planName={plan.name} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Credit Costs</h2>
        <div className="space-y-2">
          {operations.map((op) => (
            <div key={op.name} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
              <div className="flex items-center gap-2.5">
                <span>{op.icon}</span>
                <span className="text-zinc-300 text-sm">{op.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">{op.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {recentUsage.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Usage</h2>
          <div className="space-y-2">
            {recentUsage.map((usage) => (
              <div key={usage.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0 text-sm">
                <span className="text-zinc-400">{usage.operation.replace(/_/g, " ").toLowerCase()}</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400">{usage.creditsUsed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
