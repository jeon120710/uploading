import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      people: { include: { person: true } },
    },
  });

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const video = await prisma.video.findUnique({ where: { id } });
    if (video) {
      const url = new URL(video.filePath);
      const pathParts = url.pathname.split("/");
      const bucketIndex = pathParts.indexOf("uploads");
      if (bucketIndex !== -1) {
        const storagePath = pathParts.slice(bucketIndex + 1).join("/");
        await supabase.storage.from("uploads").remove([storagePath]);
      }
    }
    await prisma.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
