import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildImageGenerationPrompt } from "@/prompts/image-generation.prompt";
import { generateFullPackSchema } from "@/schemas";
import { uploadImageFromUrl } from "@/lib/storage";

const FORMAT_SIZES: Record<string, { width: number; height: number }> = {
  SQUARE_1080: { width: 1080, height: 1080 },
  STORY_1080x1920: { width: 1080, height: 1920 },
  LANDSCAPE_1200x628: { width: 1200, height: 628 },
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = generateFullPackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { projectId } = parsed.data;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
      include: {
        productAnalysis: true,
        adCreatives: { orderBy: { index: "asc" } },
      },
    });

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (!project.productAnalysis) return NextResponse.json({ error: "Run product analysis first" }, { status: 400 });
    if (project.adCreatives.length === 0) return NextResponse.json({ error: "Generate strategy first" }, { status: 400 });

    const creditResult = await consumeCredits(session.user.id, "GENERATE_FULL_PACK", projectId);
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    await prisma.project.update({ where: { id: projectId }, data: { status: "GENERATING" } });

    const results = [];

    for (const adCreative of project.adCreatives) {
      try {
        await prisma.adCreative.update({ where: { id: adCreative.id }, data: { status: "PROCESSING" } });

        const prompt = buildImageGenerationPrompt(
          adCreative.adType,
          adCreative.imagePrompt,
          project.productAnalysis!.productType,
          project.productAnalysis!.colors,
          adCreative.format
        );

        const isSquare = adCreative.format === "SQUARE_1080";
        const imageResponse = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          n: 1,
          size: isSquare ? "1024x1024" : adCreative.format === "STORY_1080x1920" ? "1024x1792" : "1792x1024",
          quality: "standard",
        });

        const imageUrl = imageResponse.data[0].url;
        if (!imageUrl) throw new Error("No image URL");

        let finalUrl = imageUrl;
        try {
          finalUrl = await uploadImageFromUrl(imageUrl, `ad-${adCreative.id}-${Date.now()}.png`);
        } catch {}

        const formatSize = FORMAT_SIZES[adCreative.format] ?? FORMAT_SIZES.SQUARE_1080;

        await prisma.generatedImage.upsert({
          where: { adCreativeId: adCreative.id },
          update: { url: finalUrl, width: formatSize.width, height: formatSize.height, format: adCreative.format },
          create: { adCreativeId: adCreative.id, url: finalUrl, width: formatSize.width, height: formatSize.height, format: adCreative.format },
        });

        await prisma.adCreative.update({ where: { id: adCreative.id }, data: { status: "COMPLETED" } });
        results.push({ id: adCreative.id, status: "COMPLETED" });
      } catch (err) {
        await prisma.adCreative.update({
          where: { id: adCreative.id },
          data: { status: "FAILED", errorMessage: String(err) },
        });
        results.push({ id: adCreative.id, status: "FAILED" });
      }
    }

    await prisma.project.update({ where: { id: projectId }, data: { status: "COMPLETED" } });

    return NextResponse.json({ results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Pack generation failed" }, { status: 500 });
  }
}
