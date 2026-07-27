import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const people = await prisma.person.findMany({
    include: { _count: { select: { videos: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(people);
}
