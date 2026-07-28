"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AiNovelGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const generate = async (isFollowUp = false) => {
    if (!user) return alert("로그인이 필요합니다.");
    setLoading(true);
    try {
      const currentMessages = isFollowUp
        ? [...messages, { role: "user", content: prompt }]
        : [{ role: "user", content: prompt }];

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: currentMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const newResult = data.content;
      setResult(newResult);
      setMessages([...currentMessages, { role: "assistant", content: newResult }]);
      if (!isFollowUp) setPrompt("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadNovel = async () => {
    if (!result) return;
    const title = prompt.slice(0, 20) || "AI 생성 소설";
    const res = await fetch("/api/novels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: result, description: "AI로 생성된 소설" }),
    });
    if (res.ok) alert("업로드 완료!");
    else alert("업로드 실패");
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-accent" />
        AI 판타지 소설 공방
      </h2>
      {result && (
        <div className="mb-6 p-6 bg-background rounded-xl border border-accent/20 whitespace-pre-wrap text-sm leading-relaxed text-muted max-h-96 overflow-y-auto">
          {result}
        </div>
      )}

      <textarea
        className="w-full h-24 p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-accent mb-4"
        placeholder={result ? "이어질 내용을 입력하세요..." : "이야기를 시작하세요..."}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={() => generate(!!result)}
          disabled={loading}
          className="flex-1 py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>{result ? "이어 쓰기" : "생성하기"}</>}
        </button>
        {result && (
          <button
            onClick={uploadNovel}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
          >
            업로드
          </button>
        )}
      </div>
    </div>
  );
}

