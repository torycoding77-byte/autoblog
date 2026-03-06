import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postIds, scheduleTimes } = await req.json();

  if (!postIds?.length || !scheduleTimes?.length) {
    return NextResponse.json({ error: "postIds and scheduleTimes required" }, { status: 400 });
  }

  const updated = [];
  for (let i = 0; i < postIds.length; i++) {
    const post = await prisma.post.update({
      where: { id: postIds[i], userId: session.user.id },
      data: {
        status: "scheduled",
        scheduledAt: new Date(scheduleTimes[i]),
      },
    });
    updated.push(post);
  }

  return NextResponse.json(updated);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["scheduled", "published"] },
    },
    include: { business: true },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(posts);
}
