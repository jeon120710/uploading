import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      people: { include: { person: true } },
    },
  });
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const file = formData.get("video") as File;
  const duration = formData.get("duration") as string | null;
  const peopleNames = formData.get("people") as string | null;

  if (!title || !file) {
    return NextResponse.json(
      { error: "title, video file are required" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "mp4";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `videos/${fileName}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from("uploads")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json(
      { error: "파일 업로드에 실패했습니다." },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  const parsedPeople = peopleNames ? JSON.parse(peopleNames) : [];

  const video = await prisma.video.create({
    data: {
      title,
      description: description || undefined,
      filePath: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      duration: duration || undefined,
      ...(parsedPeople.length > 0
        ? {
            people: {
              create: await Promise.all(
                parsedPeople.map(async (name: string) => {
                  const person = await prisma.person.upsert({
                    where: { name },
                    update: {},
                    create: { name },
                  });
                  return { personId: person.id };
                })
              ),
            },
          }
        : {}),
    },
    include: {
      people: { include: { person: true } },
    },
  });

  return NextResponse.json(video, { status: 201 });
}
