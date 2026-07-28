import { prisma } from "@/lib/prisma";
import { comparePassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { studentId, password } = body;

  if (!studentId || !password) {
    return NextResponse.json(
      { error: "학번과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { studentId } });
  if (!user) {
    return NextResponse.json(
      { error: "학번 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { error: "학번 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  await createSession(user.id);

  return NextResponse.json({
    user: { id: user.id, studentId: user.studentId, name: user.name, isAdmin: user.isAdmin },
  });
}
