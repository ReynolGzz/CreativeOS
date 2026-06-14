import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exportZipSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = exportZipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { projectId } = parsed.data;

    const adCreatives = await prisma.adCreative.findMany({
      where: {
        projectId,
        project: { userId: session.user.id },
        status: "COMPLETED",
      },
      include: { generatedImage: true },
      orderBy: { index: "asc" },
    });

    const exportData = adCreatives.map((ad) => ({
      id: ad.id,
      index: ad.index,
      adType: ad.adType,
      headline: ad.headline,
      hook: ad.hook,
      primaryText: ad.primaryText,
      cta: ad.cta,
      imageUrl: ad.generatedImage?.url ?? null,
      format: ad.format,
      platform: ad.platform,
    }));

    await prisma.export.create({
      data: {
        userId: session.user.id,
        projectId,
        type: "ZIP_ALL",
        adCreativeIds: adCreatives.map((a) => a.id),
      },
    });

    return NextResponse.json({ ads: exportData });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
