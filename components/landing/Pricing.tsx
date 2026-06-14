import Link from "next/link";
import { Check, Coins } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$9",
    credits: 100,
    description: "For individuals testing AI ad generation",
    features: [
      "100 credits",
      "~2 full ad packs",
      "All 10 ad types",
      "PNG & ZIP export",
      "Ad Intelligence module",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Creator",
    price: "$29",
    credits: 500,
    description: "For active marketers and content creators",
    features: [
      "500 credits",
      "~10 full ad packs",
      "All 10 ad types",
      "PNG & ZIP export",
      "Ad Intelligence module",
      "Priority generation",
    ],
    cta: "Get Creator",
    popular: true,
  },
  {
    name: "Scale",
    price: "$79",
    credits: 2000,
    description: "For agencies and high-volume teams",
    features: [
      "2,000 credits",
      "~40 full ad packs",
      "All 10 ad types",
      "PNG & ZIP export",
      "Ad Intelligence module",
      "Priority generation",
      "Bulk project management",
    ],
    cta: "Get Scale",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, credit-based pricing</h2>
          <p className="text-zinc-400 text-lg">Buy credits. Use them whenever. No subscriptions, no surprises.</p>
          <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 mt-6 text-sm text-zinc-300">
            <Coins className="w-4 h-4 text-yellow-400" />
            New accounts start with <strong className="text-white ml-1">100 free credits</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative bg-zinc-900 border rounded-2xl p-6 ${
              plan.popular ? "border-violet-600/50 shadow-lg shadow-violet-600/10" : "border-zinc-800"
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                <p className="text-zinc-400 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-sm">one-time</span>
              </div>

              <div className="flex items-center gap-1.5 mb-5 pb-5 border-b border-zinc-800">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">{plan.credits} credits</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-violet-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-violet-600 hover:bg-violet-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Credits never expire. Need more? Purchase additional packs anytime.
        </p>
      </div>
    </section>
  );
}
