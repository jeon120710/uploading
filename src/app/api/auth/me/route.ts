import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      studentId: session.user.studentId,
      name: session.user.name,
      isAdmin: session.user.isAdmin,
    },
  });
}
