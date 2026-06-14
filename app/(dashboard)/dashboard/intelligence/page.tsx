import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default async function IntelligencePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const research = await prisma.competitorResearch.findMany({
    where: { userId: session.user.id },
    include: { insight: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ad Intelligence</h1>
          <p className="text-zinc-400 text-sm mt-1">Research competitor ads and extract winning patterns</p>
        </div>
        <Link
          href="/dashboard/intelligence/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Research
        </Link>
      </div>

      {research.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <Search className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No research yet</h3>
          <p className="text-zinc-500 text-sm mb-5">Analyze a competitor to discover winning ad patterns and generate inspired creative ideas.</p>
          <Link
            href="/dashboard/intelligence/new"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start Research
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {research.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/intelligence/${r.id}`}
              className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg">{r.competitorName[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm">{r.competitorName}</h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {r.category ?? "Uncategorized"} · {formatRelativeTime(r.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {r.insight && (
                  <span className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                    {(r.insight.generatedAdIdeas as unknown[]).length ?? 0} ideas
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  r.status === "COMPLETED" ? "text-green-400 border-green-400/20 bg-green-400/10" :
                  r.status === "PROCESSING" ? "text-blue-400 border-blue-400/20 bg-blue-400/10" :
                  "text-zinc-400 border-zinc-700"
                }`}>
                  {r.status.toLowerCase()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
