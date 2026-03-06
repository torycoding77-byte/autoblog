import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBlogPost } from "@/lib/generate";

const DAILY_LIMIT = 3;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { businessId, count = 3 } = await req.json();

  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  // 사용자 AI 키 확인
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { aiApiKey: true },
  });

  if (!user?.aiApiKey) {
    return NextResponse.json(
      { error: "AI API 키가 설정되지 않았습니다. 설정 탭에서 Gemini API 키를 등록해주세요." },
      { status: 400 },
    );
  }

  // 오늘 생성한 글 수 확인
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayCount = await prisma.post.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: todayStart },
    },
  });

  const remaining = DAILY_LIMIT - todayCount;
  if (remaining <= 0) {
    return NextResponse.json(
      { error: `일일 무료 생성 한도(${DAILY_LIMIT}개)를 초과했습니다. 내일 다시 시도해주세요.`, remaining: 0 },
      { status: 429 },
    );
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId: session.user.id },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const posts = [];
  const postCount = Math.min(count, remaining);

  for (let i = 0; i < postCount; i++) {
    const generated = await generateBlogPost(
      user.aiApiKey,
      business.name,
      business.description,
      business.category,
    );

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        businessId: business.id,
        title: generated.title,
        content: generated.content,
        tags: JSON.stringify(generated.tags),
        status: "draft",
      },
    });

    posts.push({ ...post, tags: generated.tags });
  }

  return NextResponse.json({ posts, remaining: remaining - postCount });
}
