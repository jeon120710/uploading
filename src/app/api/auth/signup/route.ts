import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { studentId, name, password } = body;

  if (!studentId || !name || !password) {
    return NextResponse.json(
      { error: "학번, 이름, 비밀번호를 모두 입력해주세요." },
      { status: 400 }
    );
  }

  if (password.length < 4) {
    return NextResponse.json(
      { error: "비밀번호는 4자 이상이어야 합니다." },
      { status: 400 }
    );
  }

  if (password.includes(" ")) {
    return NextResponse.json(
      { error: "비밀번호는 공백을 포함할 수 없습니다." },
      { status: 400 }
    );
  }

  if (!password.includes("!,.,?,@%,&")) {
    return NextResponse.json(
      { error: "비밀번호에는 특수문자 !,.,?,@%,& 중 하나 이상이 포함되어야 합니다." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { studentId } });
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 학번입니다." },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { studentId, name, password: hashedPassword },
  });

  await createSession(user.id);

  return NextResponse.json(
    { user: { id: user.id, studentId: user.studentId, name: user.name, isAdmin: user.isAdmin } },
    { status: 201 }
  );
}
