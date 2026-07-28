import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const novel = await prisma.novel.findUnique({ where: { id } });

  if (!novel) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(novel);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.novel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, author } = await request.json();

  try {
    const novel = await prisma.novel.update({
      where: { id },
      data: { title, author },
    });
    return NextResponse.json(novel);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

