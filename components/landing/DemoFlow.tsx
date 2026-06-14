import { Upload, Zap, Image as ImageIcon, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Product Image",
    description: "Drop your product photo. Works with any product — skincare, fashion, electronics, food, and more.",
  },
  {
    icon: Zap,
    number: "02",
    title: "AI Analyzes & Strategizes",
    description: "GPT-4 Vision identifies product type, benefits, audience, and generates 10 unique advertising angles.",
  },
  {
    icon: ImageIcon,
    number: "03",
    title: "10 Ads Generated",
    description: "For each angle: a custom AI image, scroll-stopping hook, headline, body copy, and CTA — ready to launch.",
  },
  {
    icon: Download,
    number: "04",
    title: "Download & Launch",
    description: "Export individual PNGs or download everything as a ZIP. Copy-paste the copy. Ship your campaign.",
  },
];

const adTypes = [
  "Problem/Solution", "Luxury/Premium", "Social Proof",
  "Offer/Discount", "Before/After", "UGC Style",
  "Minimal Product", "Lifestyle", "Comparison", "Urgency/FOMO"
];

export default function DemoFlow() {
  return (
    <section id="demo" className="py-24 border-t border-zinc-800/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">From product to 10 ads in minutes</h2>
          <p className="text-zinc-400 text-lg">No design skills needed. No agency needed. Just results.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-violet-600/20 rounded-lg flex items-center justify-center">
                    <step.icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-zinc-600 text-xs font-mono">{step.number}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{step.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ad Types */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 text-center">10 Ad Types Generated Automatically</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {adTypes.map((type) => (
              <span key={type} className="text-sm text-zinc-300 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
