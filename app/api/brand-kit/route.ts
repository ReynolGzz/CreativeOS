import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const brandKitSchema = z.object({
  brandName: z.string().max(100).optional(),
  primaryColor: z.string().max(7).optional(),
  secondaryColor: z.string().max(7).optional(),
  accentColor: z.string().max(7).optional(),
  primaryFont: z.string().max(50).optional(),
  toneOfVoice: z
    .enum([
      "PROFESSIONAL",
      "CASUAL",
      "PLAYFUL",
      "BOLD",
      "LUXURIOUS",
      "TECHNICAL",
      "INSPIRATIONAL",
      "FRIENDLY",
    ])
    .optional(),
  brandValues: z.array(z.string()).default([]),
  allowedClaims: z.array(z.string()).default([]),
  prohibitedClaims: z.array(z.string()).default([]),
  tagline: z.string().max(200).optional(),
  targetAudience: z.string().max(500).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const brandKit = await prisma.brandKit.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ brandKit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch brand kit" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = brandKitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const brandKit = await prisma.brandKit.upsert({
      where: { userId: session.user.id },
      update: {
        brandName: data.brandName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        primaryFont: data.primaryFont,
        ...(data.toneOfVoice !== undefined && { toneOfVoice: data.toneOfVoice }),
        brandValues: data.brandValues,
        allowedClaims: data.allowedClaims,
        prohibitedClaims: data.prohibitedClaims,
        tagline: data.tagline,
        targetAudience: data.targetAudience,
      },
      create: {
        userId: session.user.id,
        brandName: data.brandName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        primaryFont: data.primaryFont,
        ...(data.toneOfVoice !== undefined && { toneOfVoice: data.toneOfVoice }),
        brandValues: data.brandValues,
        allowedClaims: data.allowedClaims,
        prohibitedClaims: data.prohibitedClaims,
        tagline: data.tagline,
        targetAudience: data.targetAudience,
      },
    });

    return NextResponse.json({ brandKit });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save brand kit" }, { status: 500 });
  }
}
