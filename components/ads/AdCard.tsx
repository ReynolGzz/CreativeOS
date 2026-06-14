"use client";

import { useState } from "react";
import { Download, RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { AD_TYPE_LABELS } from "@/lib/utils";
import type { AdCreative, GeneratedImage } from "@prisma/client";

type Props = {
  ad: AdCreative & { generatedImage: GeneratedImage | null };
  projectId: string;
};

export default function AdCard({ ad, projectId }: Props) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  async function handleDownload() {
    if (!ad.generatedImage?.url) return;
    const a = document.createElement("a");
    a.href = ad.generatedImage.url;
    a.download = `${AD_TYPE_LABELS[ad.adType] ?? ad.adType}-${ad.index + 1}.png`;
    a.target = "_blank";
    a.click();
  }

  async function handleCopy() {
    const text = `${ad.headline}\n\n${ad.primaryText}\n\n${ad.cta}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      const res = await fetch("/api/ads/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adCreativeId: ad.id }),
      });
      if (res.ok) window.location.reload();
    } catch {}
    setRegenerating(false);
  }

  const statusColor = {
    COMPLETED: "text-green-400 bg-green-400/10 border-green-400/20",
    PROCESSING: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    QUEUED: "text-zinc-400 bg-zinc-800 border-zinc-700",
    FAILED: "text-red-400 bg-red-400/10 border-red-400/20",
  }[ad.status];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        {ad.generatedImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.generatedImage.url} alt={ad.headline} className="w-full h-full object-cover" />
        ) : ad.status === "PROCESSING" ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-2" />
              <p className="text-zinc-400 text-xs">Generating...</p>
            </div>
          </div>
        ) : ad.status === "FAILED" ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400 text-xs text-center px-4">Generation failed</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-600 text-xs">Queued</p>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-xs bg-zinc-900/90 text-violet-400 px-2 py-1 rounded-md border border-zinc-700/50 backdrop-blur-sm">
            {AD_TYPE_LABELS[ad.adType] ?? ad.adType}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-md border ${statusColor}`}>
            {ad.status.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-white font-semibold text-sm leading-tight">{ad.headline}</p>
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{ad.primaryText}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/20">{ad.cta}</span>
          <span className="text-xs text-zinc-600">{ad.platform}</span>
        </div>
      </div>
      <div className="px-4 pb-4 flex items-center gap-2">
        <button onClick={handleDownload} disabled={!ad.generatedImage} className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200 text-xs font-medium py-2 rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button onClick={handleCopy} className="flex items-center justify-center w-9 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors" title="Copy copy">
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button onClick={handleRegenerate} disabled={regenerating} className="flex items-center justify-center w-9 h-8 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded-lg transition-colors" title="Regenerate image">
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
