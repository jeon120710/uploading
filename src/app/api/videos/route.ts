import { prisma } from "@/lib/prisma";
import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        people: { include: { person: true } },
      },
    });
    return NextResponse.json(videos);
  } catch {
    return NextResponse.json(
      { error: "비디오 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const file = formData.get("video") as File | null;
    const duration = formData.get("duration") as string | null;
    const peopleNames = formData.get("people") as string | null;

    if (!title || !file) {
      return NextResponse.json(
        { error: "title, video file are required" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 500MB 이하여야 합니다." },
        { status: 413 }
      );
    }

    let parsedPeople: string[] = [];
    if (peopleNames) {
      try {
        parsedPeople = JSON.parse(peopleNames);
      } catch {
        return NextResponse.json(
          { error: "출연자 형식이 올바르지 않습니다." },
          { status: 400 }
        );
      }
    }

    const ext = file.name.split(".").pop() || "mp4";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const storagePath = `videos/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await getSupabase().storage
      .from("uploads")
      .upload(storagePath, buffer, {
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

    const { data: urlData } = getSupabase().storage
      .from("uploads")
      .getPublicUrl(storagePath);

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        { error: "파일 URL을 생성할 수 없습니다." },
        { status: 500 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || undefined,
        filePath: urlData.publicUrl,
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
  } catch (error) {
    console.error("Video creation error:", error);
    return NextResponse.json(
      { error: "비디오 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
