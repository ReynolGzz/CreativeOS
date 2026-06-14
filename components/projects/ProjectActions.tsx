"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Image as ImageIcon, Play, ExternalLink } from "lucide-react";

type Props = {
  project: {
    id: string;
    status: string;
    hasAnalysis: boolean;
    hasStrategy: boolean;
    hasImage: boolean;
    imageUrl: string | null;
    completedAds: number;
    totalAds: number;
  };
};

export default function ProjectActions({ project }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!project.imageUrl) return;
    setLoading("analyze");
    setError("");
    try {
      const res = await fetch("/api/ai/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, imageUrl: project.imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(null);
    }
  }

  async function generateStrategy() {
    setLoading("strategy");
    setError("");
    try {
      const res = await fetch("/api/ai/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Strategy generation failed");
    } finally {
      setLoading(null);
    }
  }

  async function generateFullPack() {
    setLoading("generate");
    setError("");
    try {
      const res = await fetch("/api/ai/generate-full-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/projects/${project.id}/gallery`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(null);
    }
  }

  const steps = [
    { key: "analyze", label: "Analyze Product", description: "AI vision analyzes your product image", cost: "1 credit", icon: Zap, action: analyze, disabled: !project.hasImage || project.hasAnalysis, done: project.hasAnalysis },
    { key: "strategy", label: "Generate Strategy", description: "Creates 10 ad angles with hooks, headlines, copy, and CTAs", cost: "2 credits", icon: ImageIcon, action: generateStrategy, disabled: !project.hasAnalysis, done: project.hasStrategy },
    { key: "generate", label: "Generate 10 Ads", description: "AI generates ad images for all 10 creatives (takes 2-3 min)", cost: "50 credits", icon: Play, action: generateFullPack, disabled: !project.hasStrategy, done: project.completedAds === 10 },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-medium mb-4">Generation Pipeline</h3>
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">{error}</div>}
      {steps.map((step, i) => (
        <div key={step.key} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${ step.done ? "border-green-500/20 bg-green-500/5" : loading === step.key ? "border-violet-500/30 bg-violet-500/5" : "border-zinc-800 bg-zinc-800/30" }`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${ step.done ? "bg-green-500 text-white" : loading === step.key ? "bg-violet-600 text-white" : step.disabled ? "bg-zinc-800 text-zinc-600" : "bg-zinc-700 text-zinc-300" }`}>
            {step.done ? "✓" : loading === step.key ? "..." : i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-medium">{step.label}</p>
              <span className="text-xs text-zinc-500">{step.cost}</span>
            </div>
            <p className="text-zinc-400 text-xs mt-0.5">{step.description}</p>
          </div>
          {!step.done && (
            <button onClick={step.action} disabled={step.disabled || loading !== null} className="shrink-0 flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
              {loading === step.key ? <><div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" /> Processing</> : <><step.icon className="w-3 h-3" /> Run</>}
            </button>
          )}
          {step.done && step.key === "generate" && (
            <a href={`/dashboard/projects/${project.id}/gallery`} className="shrink-0 flex items-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
              <ExternalLink className="w-3 h-3" /> Gallery
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
