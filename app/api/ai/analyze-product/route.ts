import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildProductAnalysisPrompt } from "@/prompts/product-analysis.prompt";
import { analyzeProductSchema, productAnalysisResponseSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = analyzeProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { projectId, imageUrl } = parsed.data;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      include: { productAnalysis: true },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const creditResult = await consumeCredits(session.user.id, "ANALYZE_PRODUCT", projectId);
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "ANALYZING" },
    });

    const prompt = buildProductAnalysisPrompt(
      project.productDescription ?? undefined,
      project.targetAudience ?? undefined
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const raw = response.choices[0].message.content ?? "{}";
    const analysisData = productAnalysisResponseSchema.parse(JSON.parse(raw));

    const analysis = await prisma.productAnalysis.upsert({
      where: { projectId },
      update: { ...analysisData, rawJson: JSON.parse(raw) },
      create: { projectId, ...analysisData, rawJson: JSON.parse(raw) },
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { status: "STRATEGY_READY" },
    });

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
