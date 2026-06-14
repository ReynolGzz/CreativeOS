"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">CreativeOS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-zinc-400 hover:text-white text-sm transition-colors">Features</Link>
          <Link href="/pricing" className="text-zinc-400 hover:text-white text-sm transition-colors">Pricing</Link>
          <Link href="#faq" className="text-zinc-400 hover:text-white text-sm transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
