import { Zap, Target, Layers, Clock, TrendingUp, Shield } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "10x Faster Creative Production",
    description: "What takes a creative team days, CreativeOS does in minutes. Generate a full ad pack before your morning coffee.",
    color: "text-yellow-400",
  },
  {
    icon: Target,
    title: "AI-Powered Product Intelligence",
    description: "Our AI doesn't just generate images — it understands your product, audience, and market position to craft strategic ads.",
    color: "text-violet-400",
  },
  {
    icon: Layers,
    title: "10 Proven Ad Formulas",
    description: "Every pack covers the full creative spectrum: problem/solution, luxury, UGC, lifestyle, urgency, comparison and more.",
    color: "text-blue-400",
  },
  {
    icon: Clock,
    title: "Ready to Launch, Instantly",
    description: "Download production-ready PNG files at 1080×1080, 1080×1920, or 1200×628. Paste copy directly into your ad manager.",
    color: "text-green-400",
  },
  {
    icon: TrendingUp,
    title: "Ad Intelligence Module",
    description: "Research competitor ads, extract winning patterns, and get 10 original ideas inspired by what's working in your market.",
    color: "text-orange-400",
  },
  {
    icon: Shield,
    title: "Brand-Safe Generation",
    description: "Product consistency is a priority. AI maintains your product's look, colors and key features across all 10 creatives.",
    color: "text-pink-400",
  },
];

export default function Benefits() {
  return (
    <section id="features" className="py-24 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Built for performance marketers</h2>
          <p className="text-zinc-400 text-lg">Every feature designed to ship more ads, faster.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b) => (
            <div key={b.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center mb-4`}>
                <b.icon className={`w-5 h-5 ${b.color}`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{b.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
