import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businesses = await prisma.business.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(businesses);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, category, address, phone, imageUrl } = body;

  if (!name) {
    return NextResponse.json({ error: "업체명은 필수입니다" }, { status: 400 });
  }

  const business = await prisma.business.create({
    data: {
      userId: session.user.id,
      name,
      description,
      category,
      address,
      phone,
      imageUrl,
    },
  });

  return NextResponse.json(business, { status: 201 });
}
