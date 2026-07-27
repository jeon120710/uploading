"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Video, Plus, X, Loader2, Check } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [type, setType] = useState<"novel" | "video">("novel");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Novel fields
  const [novelTitle, setNovelTitle] = useState("");
  const [novelAuthor, setNovelAuthor] = useState("");
  const [novelDesc, setNovelDesc] = useState("");
  const [novelContent, setNovelContent] = useState("");

  // Video fields
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [personInput, setPersonInput] = useState("");

  const addPerson = () => {
    const trimmed = personInput.trim();
    if (trimmed && !people.includes(trimmed)) {
      setPeople([...people, trimmed]);
      setPersonInput("");
    }
  };

  const removePerson = (name: string) => {
    setPeople(people.filter((p) => p !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "novel") {
        const res = await fetch("/api/novels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: novelTitle,
            author: novelAuthor,
            description: novelDesc || undefined,
            content: novelContent,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => router.push(`/novels/${data.id}`), 1000);
      } else {
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: videoTitle,
            description: videoDesc || undefined,
            url: videoUrl,
            duration: videoDuration || undefined,
            people,
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => router.push(`/videos/${data.id}`), 1000);
      }
    } catch {
      alert("업로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">업로드 완료!</h2>
        <p className="text-muted">페이지로 이동 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">콘텐츠 업로드</h1>

      {/* Type Toggle */}
      <div className="flex gap-2 mb-8 p-1 bg-card rounded-2xl border border-border">
        <button
          type="button"
          onClick={() => setType("novel")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            type === "novel"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-muted hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          소설
        </button>
        <button
          type="button"
          onClick={() => setType("video")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            type === "video"
              ? "bg-accent text-white shadow-lg shadow-accent/25"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Video className="w-4 h-4" />
          영상
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === "novel" ? (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={novelTitle}
                onChange={(e) => setNovelTitle(e.target.value)}
                placeholder="소설 제목을 입력하세요"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                작가 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={novelAuthor}
                onChange={(e) => setNovelAuthor(e.target.value)}
                placeholder="작가 이름을 입력하세요"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                설명
              </label>
              <input
                type="text"
                value={novelDesc}
                onChange={(e) => setNovelDesc(e.target.value)}
                placeholder="간단한 설명을 입력하세요"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={15}
                value={novelContent}
                onChange={(e) => setNovelContent(e.target.value)}
                placeholder="소설 내용을 입력하세요..."
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y scrollbar-thin"
              />
              <p className="text-xs text-muted mt-1">
                {novelContent.length.toLocaleString()} 자
              </p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="영상 제목을 입력하세요"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                영상 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
              <p className="text-xs text-muted mt-1">
                YouTube, Vimeo 등의 링크를 입력하세요
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                설명
              </label>
              <input
                type="text"
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                placeholder="영상 설명을 입력하세요"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                러닝타임
              </label>
              <input
                type="text"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="12:34"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                출연자 / 카테고리
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={personInput}
                  onChange={(e) => setPersonInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPerson();
                    }
                  }}
                  placeholder="이름을 입력하고 Enter"
                  className="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
                <button
                  type="button"
                  onClick={addPerson}
                  className="px-4 py-3 bg-accent/10 text-accent rounded-xl hover:bg-accent/20 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {people.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {people.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => removePerson(p)}
                        className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            type === "novel"
              ? "bg-gradient-to-r from-primary to-primary-dark shadow-primary/25 hover:shadow-primary/40"
              : "bg-gradient-to-r from-accent to-amber-600 shadow-accent/25 hover:shadow-accent/40"
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {type === "novel" ? (
                <BookOpen className="w-5 h-5" />
              ) : (
                <Video className="w-5 h-5" />
              )}
              {type === "novel" ? "소설 올리기" : "영상 올리기"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
