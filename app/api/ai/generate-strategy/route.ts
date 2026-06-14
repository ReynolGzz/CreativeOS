import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildAdStrategyPrompt } from "@/prompts/ad-strategy.prompt";
import { generateStrategySchema, adStrategyResponseSchema } from "@/schemas";
import type { AdType, AdFormat } from "@prisma/client";

const AD_TYPES: AdType[] = [
  "PROBLEM_SOLUTION", "LUXURY_PREMIUM", "SOCIAL_PROOF", "OFFER_DISCOUNT",
  "BEFORE_AFTER", "UGC_STYLE", "MINIMAL_PRODUCT", "LIFESTYLE", "COMPARISON", "URGENCY_FOMO",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = generateStrategySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { projectId } = parsed.data;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      include: { productAnalysis: true },
    });

    if (!project || !project.productAnalysis) {
      return NextResponse.json({ error: "Project or analysis not found" }, { status: 404 });
    }

    const creditResult = await consumeCredits(session.user.id, "GENERATE_STRATEGY", projectId);
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    const analysis = project.productAnalysis;
    const prompt = buildAdStrategyPrompt(
      {
        productType: analysis.productType,
        colors: analysis.colors,
        materials: analysis.materials,
        category: analysis.category,
        benefits: analysis.benefits,
        probableAudience: analysis.probableAudience,
        recommendedStyle: analysis.recommendedStyle,
        salesAngles: analysis.salesAngles,
        customerObjections: analysis.customerObjections,
        positioningOpportunities: analysis.positioningOpportunities,
      },
      project.name,
      project.platform,
      project.visualStyle,
      project.targetAudience ?? undefined
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const raw = response.choices[0].message.content ?? "{}";
    const strategyData = adStrategyResponseSchema.parse(JSON.parse(raw));

    const strategy = await prisma.adStrategy.upsert({
      where: { projectId },
      update: {
        angles: strategyData.ads.map((a) => a.angle),
        hooks: strategyData.ads.map((a) => a.hook),
        headlines: strategyData.ads.map((a) => a.headline),
        primaryTexts: strategyData.ads.map((a) => a.primaryText),
        ctas: strategyData.ads.map((a) => a.cta),
        imagePrompts: strategyData.ads.map((a) => a.imagePrompt),
        formats: strategyData.ads.map((a) => a.format),
        reasoning: strategyData.ads.map((a) => a.reasoning),
        rawJson: JSON.parse(raw),
      },
      create: {
        projectId,
        angles: strategyData.ads.map((a) => a.angle),
        hooks: strategyData.ads.map((a) => a.hook),
        headlines: strategyData.ads.map((a) => a.headline),
        primaryTexts: strategyData.ads.map((a) => a.primaryText),
        ctas: strategyData.ads.map((a) => a.cta),
        imagePrompts: strategyData.ads.map((a) => a.imagePrompt),
        formats: strategyData.ads.map((a) => a.format),
        reasoning: strategyData.ads.map((a) => a.reasoning),
        rawJson: JSON.parse(raw),
      },
    });

    await prisma.adCreative.deleteMany({ where: { projectId } });

    const adCreatives = await prisma.$transaction(
      strategyData.ads.map((ad, i) =>
        prisma.adCreative.create({
          data: {
            projectId,
            strategyId: strategy.id,
            index: i,
            adType: AD_TYPES[i],
            angle: ad.angle,
            hook: ad.hook,
            headline: ad.headline,
            primaryText: ad.primaryText,
            cta: ad.cta,
            imagePrompt: ad.imagePrompt,
            format: (ad.format as AdFormat) || "SQUARE_1080",
            platform: ad.platform || project.platform,
            status: "QUEUED",
          },
        })
      )
    );

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "STRATEGY_READY" },
    });

    return NextResponse.json({ strategy, adCreatives });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Strategy generation failed" }, { status: 500 });
  }
}
