import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold">CreativeOS</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-zinc-300 transition-colors">Get Started</Link>
          </div>

          <p className="text-zinc-600 text-sm">
            © 2026 CreativeOS. Built with AI.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-600 text-xs">
            The AI Creative Operating System for generating high-performing ad creatives at scale.
          </p>
        </div>
      </div>
    </footer>
  );
}
