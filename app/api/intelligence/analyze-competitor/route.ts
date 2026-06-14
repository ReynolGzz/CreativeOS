import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildCompetitorAnalysisPrompt } from "@/prompts/competitor-analysis.prompt";
import { analyzeCompetitorSchema, competitorInsightResponseSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = analyzeCompetitorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { competitorName, competitorUrl, category, screenshots } = parsed.data;

    const creditResult = await consumeCredits(session.user.id, "ANALYZE_COMPETITOR");
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    const research = await prisma.competitorResearch.create({
      data: {
        userId: session.user.id,
        competitorName,
        competitorUrl: competitorUrl || null,
        category: category || null,
        screenshots,
        status: "PROCESSING",
      },
    });

    const prompt = buildCompetitorAnalysisPrompt(competitorName, category, competitorUrl);

    const messages: Parameters<typeof openai.chat.completions.create>[0]["messages"] = [
      { role: "user", content: prompt },
    ];

    if (screenshots.length > 0) {
      messages[0] = {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...screenshots.slice(0, 3).map((url) => ({
            type: "image_url" as const,
            image_url: { url, detail: "low" as const },
          })),
        ],
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const raw = response.choices[0].message.content ?? "{}";
    const insightData = competitorInsightResponseSchema.parse(JSON.parse(raw));

    const insight = await prisma.competitorAdInsight.create({
      data: {
        researchId: research.id,
        ...insightData,
        generatedAdIdeas: insightData.generatedAdIdeas,
        rawJson: JSON.parse(raw),
      },
    });

    await prisma.competitorResearch.update({
      where: { id: research.id },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ research: { ...research, insight } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
