import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const novels = await prisma.novel.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(novels);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, author, description, content } = body;

  if (!title || !author || !content) {
    return NextResponse.json(
      { error: "title, author, content are required" },
      { status: 400 }
    );
  }

  const novel = await prisma.novel.create({
    data: { title, author, description, content },
  });

  return NextResponse.json(novel, { status: 201 });
}
