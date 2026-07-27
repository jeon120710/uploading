import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".mp4";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  const publicPath = `/uploads/videos/${fileName}`;

  const parsedPeople = peopleNames ? JSON.parse(peopleNames) : [];

  const video = await prisma.video.create({
    data: {
      title,
      description: description || undefined,
      filePath: publicPath,
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
