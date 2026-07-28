"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function AiNovelGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.content);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-accent" />
        AI 판타지 소설 생성기
      </h2>
      <textarea
        className="w-full h-32 p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-accent mb-4"
        placeholder="어떤 이야기를 시작할까요? (예: 검은 성에서 깨어난 기억을 잃은 소년...)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generate}
        disabled={loading}
        className="w-full py-3 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="w-4 h-4" /> 생성하기</>}
      </button>
      {result && (
        <div className="mt-8 p-6 bg-background rounded-xl border border-accent/20 whitespace-pre-wrap text-sm leading-relaxed text-muted">
          {result}
        </div>
      )}
    </div>
  );
}
