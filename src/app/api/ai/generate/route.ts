import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await request.json();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const today = new Date().toDateString();
  const lastUsage = user.lastAiUsageDate?.toDateString();

  let count = lastUsage === today ? user.aiUsageCount : 0;
  if (count >= 3) return NextResponse.json({ error: "하루 3회 제한을 초과했습니다." }, { status: 403 });

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-30b-a3b",
        messages: [{
          role: "system",
          content: "당신은 판타지 세계관과 중2병 감성을 전문으로 하는 소설가입니다. 독창적인 스킬 시스템, 상태창 메시지, 흑염룡과 같은 중2병스러운 설정들을 적절히 섞어 몰입감 넘치는 소설의 한 장면을 작성하세요. 매우 아름답고 신비로운 분위기를 유지하세요."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    await prisma.user.update({
      where: { id: user.id },
      data: { aiUsageCount: count + 1, lastAiUsageDate: new Date() }
    });

    return NextResponse.json({ content: generatedText });
  } catch (error) {
    return NextResponse.json({ error: "AI 생성 실패" }, { status: 500 });
  }
}
