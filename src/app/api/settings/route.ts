import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { aiProvider: true, aiApiKey: true },
  });

  return NextResponse.json({
    aiProvider: user?.aiProvider || "gemini",
    hasApiKey: !!user?.aiApiKey,
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { aiApiKey } = await req.json();

  if (!aiApiKey || typeof aiApiKey !== "string" || aiApiKey.trim().length < 10) {
    return NextResponse.json({ error: "유효한 API 키를 입력해주세요." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      aiProvider: "gemini",
      aiApiKey: aiApiKey.trim(),
    },
  });

  return NextResponse.json({ success: true });
}
