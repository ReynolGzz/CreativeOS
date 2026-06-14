import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exportPngSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = exportPngSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const adCreative = await prisma.adCreative.findFirst({
      where: { id: parsed.data.adCreativeId, project: { userId: session.user.id } },
      include: { generatedImage: true },
    });

    if (!adCreative?.generatedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await prisma.export.create({
      data: {
        userId: session.user.id,
        projectId: adCreative.projectId,
        type: "SINGLE_PNG",
        adCreativeIds: [adCreative.id],
        url: adCreative.generatedImage.url,
      },
    });

    return NextResponse.json({ url: adCreative.generatedImage.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
