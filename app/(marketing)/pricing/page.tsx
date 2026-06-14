import Pricing from "@/components/landing/Pricing";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Pricing</h1>
        <p className="text-zinc-400 text-lg">Simple, transparent, credit-based.</p>
      </div>
      <Pricing />
      <div className="text-center pb-16">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          Start Free — 100 Credits on Signup
        </Link>
      </div>
    </div>
  );
}
