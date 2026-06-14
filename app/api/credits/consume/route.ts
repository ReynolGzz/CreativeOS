import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { consumeCredits } from "@/lib/credits";
import { consumeCreditsSchema } from "@/schemas";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = consumeCreditsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const result = await consumeCredits(session.user.id, parsed.data.operation, parsed.data.projectId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 402 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
