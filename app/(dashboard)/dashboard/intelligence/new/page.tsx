"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewIntelligencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    competitorName: "",
    competitorUrl: "",
    category: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/intelligence/analyze-competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitorName: form.competitorName,
          competitorUrl: form.competitorUrl || undefined,
          category: form.category || undefined,
          screenshots: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/intelligence/${data.research.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/intelligence" className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Research Competitor</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1.5">Competitor Name *</label>
            <input
              value={form.competitorName}
              onChange={(e) => update("competitorName", e.target.value)}
              placeholder="e.g. CeraVe, Glossier, Dr. Squatch"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1.5">Website URL</label>
            <input
              value={form.competitorUrl}
              onChange={(e) => update("competitorUrl", e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 block mb-1.5">Product Category</label>
            <input
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              placeholder="e.g. Skincare, Fitness, Fashion"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
            />
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-3 text-xs text-zinc-400">
            💡 The AI will analyze this competitor&apos;s known advertising patterns and generate strategic insights + 10 original ad ideas inspired by market data.
            <span className="text-yellow-400 ml-1">Costs 10 credits.</span>
          </div>

          <button
            type="submit"
            disabled={loading || !form.competitorName.trim()}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
          >
            {loading ? "Analyzing competitor..." : "Run Analysis (10 credits)"}
          </button>
        </form>
      </div>
    </div>
  );
}
