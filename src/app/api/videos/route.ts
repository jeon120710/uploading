import { prisma } from "@/lib/prisma";
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
  const body = await request.json();
  const { title, description, url, duration, people: peopleNames } = body;

  if (!title || !url) {
    return NextResponse.json(
      { error: "title, url are required" },
      { status: 400 }
    );
  }

  const video = await prisma.video.create({
    data: {
      title,
      description,
      url,
      duration,
      ...(peopleNames && peopleNames.length > 0
        ? {
            people: {
              create: await Promise.all(
                (peopleNames as string[]).map(async (name: string) => {
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
