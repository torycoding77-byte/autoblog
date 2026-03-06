import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBlogPost } from "@/lib/generate";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { businessId, count = 3 } = await req.json();

  if (!businessId) {
    return NextResponse.json({ error: "businessId is required" }, { status: 400 });
  }

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId: session.user.id },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  const posts = [];
  const postCount = Math.min(count, 5);

  for (let i = 0; i < postCount; i++) {
    const generated = await generateBlogPost(
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

  return NextResponse.json(posts);
}
