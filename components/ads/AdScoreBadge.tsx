"use client";

import { useState } from "react";
import { Loader2, Zap, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

type AdScore = {
  hookStrength: number;
  clarity: number;
  scrollStop: number;
  ctaStrength: number;
  overallScore: number;
  policyRisk: string;
  summary: string;
  suggestions: string[];
};

type Props = {
  adCreativeId: string;
  initialScore?: AdScore | null;
};

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-zinc-400 text-xs">{label}</span>
        <span className="text-zinc-300 text-xs font-medium">{value}/10</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}

const policyConfig = {
  low: { icon: ShieldCheck, color: "text-green-400", label: "Low risk" },
  medium: { icon: ShieldAlert, color: "text-yellow-400", label: "Medium risk" },
  high: { icon: ShieldX, color: "text-red-400", label: "High risk" },
};

export default function AdScoreBadge({ adCreativeId, initialScore }: Props) {
  const [score, setScore] = useState<AdScore | null>(initialScore ?? null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  async function fetchScore() {
    if (score) {
      setOpen((o) => !o);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ads/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adCreativeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setScore(data.score);
        setOpen(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const scoreColor =
    !score ? "text-zinc-500"
    : score.overallScore >= 75 ? "text-green-400"
    : score.overallScore >= 50 ? "text-yellow-400"
    : "text-red-400";

  const policy = score ? policyConfig[score.policyRisk as keyof typeof policyConfig] : null;
  const PolicyIcon = policy?.icon;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={fetchScore}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-xs font-medium disabled:opacity-50"
        title="Score this ad"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
        ) : (
          <Zap className="w-3.5 h-3.5 text-violet-400" />
        )}
        <span className={score ? scoreColor : "text-zinc-400"}>
          {score ? `${score.overallScore}` : "Score"}
        </span>
        {error && <span className="text-red-400 text-xs">!</span>}
      </button>

      {open && score && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-2xl z-50 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-2xl font-bold ${scoreColor}`}>{score.overallScore}</span>
              <span className="text-zinc-500 text-sm">/100</span>
            </div>
            {PolicyIcon && policy && (
              <div className={`flex items-center gap-1 text-xs ${policy.color}`}>
                <PolicyIcon className="w-3.5 h-3.5" />
                {policy.label}
              </div>
            )}
          </div>

          {/* Score bars */}
          <div className="space-y-2">
            <ScoreBar value={score.hookStrength} label="Hook Strength" />
            <ScoreBar value={score.clarity} label="Clarity" />
            <ScoreBar value={score.scrollStop} label="Scroll Stop" />
            <ScoreBar value={score.ctaStrength} label="CTA Strength" />
          </div>

          {/* Summary */}
          <p className="text-zinc-400 text-xs leading-relaxed">{score.summary}</p>

          {/* Suggestions */}
          {score.suggestions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-zinc-300 text-xs font-medium">Suggestions</p>
              {score.suggestions.map((s, i) => (
                <p key={i} className="text-zinc-500 text-xs leading-relaxed">
                  · {s}
                </p>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-zinc-600 hover:text-zinc-400 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
