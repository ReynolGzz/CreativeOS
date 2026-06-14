import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function IntelligenceDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const research = await prisma.competitorResearch.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { insight: true },
  });

  if (!research) notFound();
  const insight = research.insight;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/intelligence" className="text-zinc-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{research.competitorName}</h1>
          <p className="text-zinc-400 text-sm">{research.category ?? "Competitor Research"}</p>
        </div>
      </div>

      {!insight ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-400">Analysis in progress...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Executive Summary</h2>
            <p className="text-zinc-300 text-sm leading-relaxed">{insight.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Winning Patterns", items: insight.winningPatterns, color: "text-green-400" },
              { title: "Actionable Insights", items: insight.actionableInsights, color: "text-blue-400" },
              { title: "Hooks Used", items: insight.hooks, color: "text-violet-400" },
              { title: "Unexploited Opportunities", items: insight.unexploitedOpportunities, color: "text-yellow-400" },
            ].map((section) => (
              <div key={section.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className={`font-medium text-sm mb-3 ${section.color}`}>{section.title}</h3>
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-zinc-300 text-xs leading-relaxed flex gap-2">
                      <span className="text-zinc-600 shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">10 Original Ad Ideas</h2>
            <div className="space-y-4">
              {(insight.generatedAdIdeas as Array<{title: string; hook: string; headline: string; primaryText: string; cta: string; visualConcept: string; angle: string}>).map((idea, i) => (
                <div key={i} className="border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-zinc-500 w-5">{i + 1}.</span>
                    <h4 className="text-white font-medium text-sm">{idea.title}</h4>
                    <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full ml-auto">{idea.angle}</span>
                  </div>
                  <p className="text-zinc-400 text-xs italic mb-2 ml-7">Hook: &ldquo;{idea.hook}&rdquo;</p>
                  <p className="text-zinc-200 text-sm font-medium ml-7 mb-1">{idea.headline}</p>
                  <p className="text-zinc-400 text-xs leading-relaxed ml-7 mb-2">{idea.primaryText}</p>
                  <div className="flex items-center gap-3 ml-7">
                    <span className="text-xs text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">{idea.cta}</span>
                    <span className="text-xs text-zinc-500">Visual: {idea.visualConcept}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
