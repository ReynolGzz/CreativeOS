"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { AD_TYPE_LABELS } from "@/lib/utils";

type AdStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

type AdCreative = {
  id: string;
  index: number;
  adType: string;
  headline: string;
  status: AdStatus;
};

export default function GeneratePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const triggerRef = useRef(false);

  // Fire generation once on mount
  useEffect(() => {
    if (triggerRef.current) return;
    triggerRef.current = true;

    async function startGeneration() {
      try {
        const res = await fetch("/api/ai/generate-full-pack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: params.id }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Generation failed");
        }
        setStarted(true);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Generation failed");
      }
    }

    startGeneration();
  }, [params.id]);

  // Poll project status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const creatives: AdCreative[] = data.project?.adCreatives ?? [];
        setAds(creatives);

        const allDone = creatives.length === 10 && creatives.every((a) => a.status === "COMPLETED" || a.status === "FAILED");
        if (allDone) {
          clearInterval(interval);
          router.push(`/dashboard/projects/${params.id}/gallery`);
        }
      } catch {
        // ignore transient fetch errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [params.id, router]);

  const completed = ads.filter((a) => a.status === "COMPLETED").length;
  const failed = ads.filter((a) => a.status === "FAILED").length;
  const progress = ads.length > 0 ? Math.round((completed / 10) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/dashboard/projects/${params.id}`} className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Generating Ad Pack</h1>
          <p className="text-zinc-400 text-sm mt-0.5">AI is creating 10 custom ad creatives for your product</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 font-medium mb-1">Generation Failed</p>
          <p className="text-zinc-400 text-sm">{error}</p>
          <Link
            href={`/dashboard/projects/${params.id}`}
            className="inline-block mt-4 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Back to Project
          </Link>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium text-sm">Progress</span>
              <span className="text-zinc-400 text-sm">{completed}/10 completed</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {!started && (
              <p className="text-zinc-500 text-xs mt-3 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Starting generation...
              </p>
            )}
            {started && completed < 10 && (
              <p className="text-zinc-500 text-xs mt-3 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating images... this takes 2-5 minutes. You can leave this page and come back.
              </p>
            )}
          </div>

          {/* Ad list */}
          {ads.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 overflow-hidden">
              {ads.map((ad) => (
                <div key={ad.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="shrink-0">
                    {ad.status === "COMPLETED" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                    {ad.status === "FAILED" && <XCircle className="w-5 h-5 text-red-400" />}
                    {ad.status === "PROCESSING" && <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />}
                    {ad.status === "QUEUED" && <Circle className="w-5 h-5 text-zinc-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">
                      {AD_TYPE_LABELS[ad.adType] ?? ad.adType}
                    </p>
                    <p className="text-zinc-500 text-xs truncate mt-0.5">{ad.headline}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${
                    ad.status === "COMPLETED" ? "text-green-400" :
                    ad.status === "FAILED" ? "text-red-400" :
                    ad.status === "PROCESSING" ? "text-violet-400" :
                    "text-zinc-600"
                  }`}>
                    {ad.status.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Placeholder rows while waiting for creatives to appear */}
          {ads.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800 overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Circle className="w-5 h-5 text-zinc-700 shrink-0" />
                  <div className="flex-1 h-4 bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {failed > 0 && completed + failed === 10 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
              {failed} ad{failed > 1 ? "s" : ""} failed to generate. You can regenerate them individually from the gallery.
            </div>
          )}
        </>
      )}
    </div>
  );
}
