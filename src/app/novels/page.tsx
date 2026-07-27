import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getNovels() {
  try {
    return await prisma.novel.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function NovelsPage() {
  const novels = await getNovels();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            소설
          </h1>
          <p className="text-muted mt-1">다양한 소설을 감상하세요</p>
        </div>
        <Link
          href="/upload?type=novel"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          소설 올리기
        </Link>
      </div>

      {novels.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary/30" />
          </div>
          <h2 className="text-xl font-bold mb-2">아직 소설이 없습니다</h2>
          <p className="text-muted mb-6">첫 번째 소설을 업로드해보세요!</p>
          <Link
            href="/upload?type=novel"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            소설 올리기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {novels.map((novel) => (
            <Link
              key={novel.id}
              href={`/novels/${novel.id}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 card-shine"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 via-indigo-100 to-accent/10 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors truncate">
                  {novel.title}
                </h3>
                <p className="text-sm text-muted mb-2">{novel.author}</p>
                {novel.description && (
                  <p className="text-sm text-muted/70 line-clamp-2 mb-3">
                    {novel.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{new Date(novel.createdAt).toLocaleDateString("ko-KR")}</span>
                  <span>{novel.content.length.toLocaleString()} 자</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
