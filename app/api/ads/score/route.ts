import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { buildAdScorePrompt } from "@/prompts/ad-score.prompt";
import { z } from "zod";

const scoreSchema = z.object({
  adCreativeId: z.string().cuid(),
});

const scoreResponseSchema = z.object({
  hookStrength: z.number().int().min(1).max(10),
  clarity: z.number().int().min(1).max(10),
  scrollStop: z.number().int().min(1).max(10),
  ctaStrength: z.number().int().min(1).max(10),
  overallScore: z.number().int().min(0).max(100),
  policyRisk: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  suggestions: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = scoreSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { adCreativeId } = parsed.data;

    const ad = await prisma.adCreative.findFirst({
      where: {
        id: adCreativeId,
        project: { userId: session.user.id },
      },
      include: { adScore: true },
    });

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Return cached score if exists
    if (ad.adScore) {
      return NextResponse.json({ score: ad.adScore });
    }

    const prompt = buildAdScorePrompt({
      headline: ad.headline,
      hook: ad.hook,
      primaryText: ad.primaryText,
      cta: ad.cta,
      adType: ad.adType,
      platform: ad.platform,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const raw = response.choices[0].message.content ?? "{}";
    const scoreData = scoreResponseSchema.parse(JSON.parse(raw));

    const score = await prisma.adScore.upsert({
      where: { adCreativeId },
      update: scoreData,
      create: { adCreativeId, ...scoreData },
    });

    return NextResponse.json({ score });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
