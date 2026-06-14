import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { consumeCredits } from "@/lib/credits";
import { buildImageGenerationPrompt } from "@/prompts/image-generation.prompt";
import { regenerateAdSchema } from "@/schemas";
import { uploadImageFromUrl } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = regenerateAdSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { adCreativeId, newHeadline, newCopy, newCta } = parsed.data;

    const adCreative = await prisma.adCreative.findFirst({
      where: { id: adCreativeId, project: { userId: session.user.id } },
      include: { project: { include: { productAnalysis: true } } },
    });

    if (!adCreative) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (newHeadline || newCopy || newCta) {
      await prisma.adCreative.update({
        where: { id: adCreativeId },
        data: {
          ...(newHeadline && { headline: newHeadline }),
          ...(newCopy && { primaryText: newCopy }),
          ...(newCta && { cta: newCta }),
        },
      });
    }

    const creditResult = await consumeCredits(session.user.id, "GENERATE_IMAGE", adCreative.projectId);
    if (!creditResult.success) {
      return NextResponse.json({ error: creditResult.error }, { status: 402 });
    }

    await prisma.adCreative.update({ where: { id: adCreativeId }, data: { status: "PROCESSING" } });

    const prompt = buildImageGenerationPrompt(
      adCreative.adType,
      adCreative.imagePrompt,
      adCreative.project.productAnalysis?.productType ?? "product",
      adCreative.project.productAnalysis?.colors ?? [],
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
    try { finalUrl = await uploadImageFromUrl(imageUrl, `ad-${adCreativeId}-regen-${Date.now()}.png`); } catch {}

    const generatedImage = await prisma.generatedImage.upsert({
      where: { adCreativeId },
      update: { url: finalUrl, width: 1080, height: 1080, format: adCreative.format },
      create: { adCreativeId, url: finalUrl, width: 1080, height: 1080, format: adCreative.format },
    });

    await prisma.adCreative.update({ where: { id: adCreativeId }, data: { status: "COMPLETED" } });

    return NextResponse.json({ generatedImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Regeneration failed" }, { status: 500 });
  }
}
