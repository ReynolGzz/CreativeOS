import Link from "next/link";
import { ArrowRight, Zap, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-600/20 text-violet-400 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <Zap className="w-3 h-3" />
          AI-Powered Ad Creative Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
          Generate 10 high-performing{"\ "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">
            ad creatives
          </span>{"\ "}
          in minutes
        </h1>

        {/* Sub */}
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your product image. CreativeOS analyzes it, generates a full ad strategy, and creates
          10 ready-to-launch ads — complete with images, headlines, copy, and CTAs.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-base"
          >
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#demo"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-base border border-zinc-700"
          >
            See How It Works
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mt-12 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span>5.0 rating</span>
          </div>
          <div className="w-px h-4 bg-zinc-700" />
          <span>100 free credits on signup</span>
          <div className="w-px h-4 bg-zinc-700" />
          <span>No credit card required</span>
        </div>
      </div>
    </section>
  );
}
