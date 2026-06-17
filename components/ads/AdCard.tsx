"use client";

import { useState } from "react";
import { Download, RefreshCw, Copy, Check, Loader2 } from "lucide-react";
import { AD_TYPE_LABELS } from "@/lib/utils";
import type { AdCreative, GeneratedImage } from "@prisma/client";
import AdScoreBadge from "@/components/ads/AdScoreBadge";

type PlatformVariants = {
  META?: { headline: string; primaryText: string; description: string; cta: string };
  TIKTOK?: { hook: string; caption: string; hashtags: string[] };
  INSTAGRAM?: { caption: string; storyText: string };
  GOOGLE_DISPLAY?: { headline: string; description: string; longHeadline: string };
};

type ActivePlatform = "DEFAULT" | "META" | "TIKTOK" | "INSTAGRAM" | "GOOGLE_DISPLAY";

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
  ad: AdCreative & { generatedImage: GeneratedImage | null; adScore: AdScore | null };
  projectId: string;
};

export default function AdCard({ ad, projectId }: Props) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [activePlatform, setActivePlatform] = useState<ActivePlatform>("DEFAULT");

  const variants = ad.platformCopy as PlatformVariants | null;

  async function handleDownload() {
    if (!ad.generatedImage?.url) return;
    const a = document.createElement("a");
    a.href = ad.generatedImage.url;
    a.download = `${AD_TYPE_LABELS[ad.adType] ?? ad.adType}-${ad.index + 1}.png`;
    a.target = "_blank";
    a.click();
  }

  async function handleCopy() {
    let text = `${ad.headline}\n\n${ad.primaryText}\n\n${ad.cta}`;

    if (activePlatform === "META" && variants?.META) {
      text = `${variants.META.headline}\n\n${variants.META.primaryText}\n\n${variants.META.description}\n\n${variants.META.cta}`;
    } else if (activePlatform === "TIKTOK" && variants?.TIKTOK) {
      text = `Hook: ${variants.TIKTOK.hook}\n\nCaption: ${variants.TIKTOK.caption}\n\n${variants.TIKTOK.hashtags.join(" ")}`;
    } else if (activePlatform === "INSTAGRAM" && variants?.INSTAGRAM) {
      text = `Caption: ${variants.INSTAGRAM.caption}\n\nStory text: ${variants.INSTAGRAM.storyText}`;
    } else if (activePlatform === "GOOGLE_DISPLAY" && variants?.GOOGLE_DISPLAY) {
      text = `Headline: ${variants.GOOGLE_DISPLAY.headline}\n\nDescription: ${variants.GOOGLE_DISPLAY.description}`;
    }

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

  const platformTabs: { key: ActivePlatform; label: string }[] = [
    { key: "META", label: "META" },
    { key: "TIKTOK", label: "TikTok" },
    { key: "INSTAGRAM", label: "IG" },
    { key: "GOOGLE_DISPLAY", label: "Google" },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Image */}
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

        {/* Ad type badge */}
        <div className="absolute top-2 left-2">
          <span className="text-xs bg-zinc-900/90 text-violet-400 px-2 py-1 rounded-md border border-zinc-700/50 backdrop-blur-sm">
            {AD_TYPE_LABELS[ad.adType] ?? ad.adType}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-md border ${statusColor}`}>
            {ad.status.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Platform tab switcher */}
      {variants && (
        <div className="px-4 pt-3 flex items-center gap-1">
          {platformTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActivePlatform(activePlatform === tab.key ? "DEFAULT" : tab.key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activePlatform === tab.key
                  ? "bg-violet-600/20 text-violet-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Copy content */}
      <div className="p-4 space-y-2">
        {activePlatform === "DEFAULT" && (
          <>
            <p className="text-white font-semibold text-sm leading-tight">{ad.headline}</p>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{ad.primaryText}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/20">
                {ad.cta}
              </span>
              <span className="text-xs text-zinc-600">{ad.platform}</span>
            </div>
          </>
        )}

        {activePlatform === "META" && variants?.META && (
          <>
            <p className="text-white font-semibold text-sm leading-tight">{variants.META.headline}</p>
            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">{variants.META.primaryText}</p>
            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{variants.META.description}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs bg-violet-600/20 text-violet-400 px-2 py-0.5 rounded-full border border-violet-600/20">
                {variants.META.cta}
              </span>
              <span className="text-xs text-zinc-600">META</span>
            </div>
          </>
        )}

        {activePlatform === "TIKTOK" && variants?.TIKTOK && (
          <div className="space-y-2">
            <div>
              <span className="text-zinc-500 text-xs font-medium">Hook:</span>
              <p className="text-white text-sm leading-tight mt-0.5">{variants.TIKTOK.hook}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs font-medium">Caption:</span>
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mt-0.5">{variants.TIKTOK.caption}</p>
            </div>
            {variants.TIKTOK.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {variants.TIKTOK.hashtags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activePlatform === "INSTAGRAM" && variants?.INSTAGRAM && (
          <div className="space-y-2">
            <div>
              <span className="text-zinc-500 text-xs font-medium">Caption:</span>
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mt-0.5">{variants.INSTAGRAM.caption}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs font-medium">Story text:</span>
              <p className="text-white text-sm leading-tight mt-0.5">{variants.INSTAGRAM.storyText}</p>
            </div>
          </div>
        )}

        {activePlatform === "GOOGLE_DISPLAY" && variants?.GOOGLE_DISPLAY && (
          <div className="space-y-2">
            <div>
              <span className="text-zinc-500 text-xs font-medium">Headline:</span>
              <p className="text-white text-sm leading-tight mt-0.5">{variants.GOOGLE_DISPLAY.headline}</p>
            </div>
            <div>
              <span className="text-zinc-500 text-xs font-medium">Description:</span>
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mt-0.5">{variants.GOOGLE_DISPLAY.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={handleDownload}
          disabled={!ad.generatedImage}
          className="flex-1 flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-200 text-xs font-medium py-2 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-9 h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
          title="Copy copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <AdScoreBadge adCreativeId={ad.id} initialScore={ad.adScore} />
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center justify-center w-9 h-8 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded-lg transition-colors"
          title="Regenerate image"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}
