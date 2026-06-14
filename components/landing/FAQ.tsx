"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does CreativeOS generate ads?",
    a: "You upload a product image. Our AI (GPT-4 Vision) analyzes it to understand the product, audience, and best positioning. Then GPT-4o generates 10 complete ad strategies, and gpt-image-1 creates custom images for each. The whole process takes 2-5 minutes.",
  },
  {
    q: "What's a credit?",
    a: "Credits are consumed per operation: 1 credit to analyze a product, 2 for the ad strategy, 5 per image generated (or 50 for a full 10-ad pack). New accounts start with 100 free credits — enough for 2 complete ad packs.",
  },
  {
    q: "What formats are generated?",
    a: "CreativeOS generates ads in Square (1080×1080), Story/Reel (1080×1920), and Landscape (1200×628) formats — covering Meta, Instagram, TikTok, and Google Display.",
  },
  {
    q: "Will the product look consistent across all 10 ads?",
    a: "Yes. We use the product's visual characteristics (colors, shape, category) extracted from your image to ensure consistency across all generated ads. The product is always prominently featured.",
  },
  {
    q: "What is the Ad Intelligence module?",
    a: "Ad Intelligence lets you research competitor brands. Enter a competitor name, and the AI analyzes their known advertising patterns — hooks, offers, visual style, emotional triggers — and generates 10 original ad ideas inspired by market insights (not copied ads).",
  },
  {
    q: "Can I edit the generated copy?",
    a: "Yes! Every ad card has copy-to-clipboard for the headline, body, and CTA. You can also regenerate individual images if you want a different visual while keeping the copy.",
  },
  {
    q: "Do credits expire?",
    a: "No. Credits never expire. Buy them whenever you need them and use them at your own pace.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 border-t border-zinc-800/50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
