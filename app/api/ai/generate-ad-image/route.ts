import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildImageGenerationPrompt } from "@/prompts/image-generation.prompt";
import { generateAdImageSchema } from "@/schemas";
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
    const parsed = generateAdImageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { adCreativeId } = parsed.data;

    const adCreative = await prisma.adCreative.findFirst({
      where: {
        id: adCreativeId,
        project: { userId: session.user.id },
      },
      include: {
        project: {
          include: {
            productAnalysis: true,
            productImages: { take: 1 },
          },
        },
      },
    });

    if (!adCreative) {
      return NextResponse.json({ error: "Ad creative not found" }, { status: 404 });
    }

    const creditResult = await consumeCredits(session.user.id, "GENERATE_IMAGE", adCreative.projectId);
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    await prisma.adCreative.update({
      where: { id: adCreativeId },
      data: { status: "PROCESSING" },
    });

    const analysis = adCreative.project.productAnalysis;
    const prompt = buildImageGenerationPrompt(
      adCreative.adType,
      adCreative.imagePrompt,
      analysis?.productType ?? "product",
      analysis?.colors ?? [],
      adCreative.format
    );

    const formatSize = FORMAT_SIZES[adCreative.format] ?? FORMAT_SIZES.SQUARE_1080;
    const isSquare = adCreative.format === "SQUARE_1080";

    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: isSquare ? "1024x1024" : adCreative.format === "STORY_1080x1920" ? "1024x1792" : "1792x1024",
      quality: "high",
    });

    const imageUrl = imageResponse.data[0].url;
    if (!imageUrl) throw new Error("No image URL returned");

    let finalUrl = imageUrl;
    try {
      finalUrl = await uploadImageFromUrl(imageUrl, `ad-${adCreativeId}-${Date.now()}.png`);
    } catch (uploadErr) {
      console.warn("Storage upload failed, using direct URL:", uploadErr);
    }

    const generatedImage = await prisma.generatedImage.upsert({
      where: { adCreativeId },
      update: { url: finalUrl, width: formatSize.width, height: formatSize.height, format: adCreative.format },
      create: {
        adCreativeId,
        url: finalUrl,
        width: formatSize.width,
        height: formatSize.height,
        format: adCreative.format,
      },
    });

    await prisma.adCreative.update({
      where: { id: adCreativeId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ generatedImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
