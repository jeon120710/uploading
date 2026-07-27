import Link from "next/link";
import { BookOpen, Video, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [recentNovels, recentVideos, novelCount, videoCount] = await Promise.all([
      prisma.novel.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
      prisma.video.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { people: { include: { person: true } } },
      }),
      prisma.novel.count(),
      prisma.video.count(),
    ]);
    return { recentNovels, recentVideos, novelCount, videoCount };
  } catch {
    return { recentNovels: [], recentVideos: [], novelCount: 0, videoCount: 0 };
  }
}

export default async function HomePage() {
  const { recentNovels, recentVideos, novelCount, videoCount } = await getData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-indigo-900 p-8 sm:p-12 text-white animate-slide-up">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">새로운 스토리 플랫폼</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            당신의 이야기를<br />
            <span className="text-accent">세상에 공유하세요</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-xl">
            소설과 영상을 업로드하고, 친구들에게 공유하세요.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/novels"
              className="flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl hover:scale-105"
            >
              <BookOpen className="w-5 h-5" />
              소설 둘러보기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/videos"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              <Video className="w-5 h-5" />
              영상 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-card rounded-2xl p-6 border border-border card-shine">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{novelCount}</p>
              <p className="text-sm text-muted">등록된 소설</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border card-shine">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{videoCount}</p>
              <p className="text-sm text-muted">등록된 영상</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Novels */}
      {recentNovels.length > 0 && (
        <section className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              최근 소설
            </h2>
            <Link
              href="/novels"
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
            >
              모두 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentNovels.map((novel) => (
              <Link
                key={novel.id}
                href={`/novels/${novel.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 card-shine"
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                    {novel.title}
                  </h3>
                  <p className="text-sm text-muted">{novel.author}</p>
                  {novel.description && (
                    <p className="text-xs text-muted/70 mt-2 line-clamp-2">
                      {novel.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <section className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-accent" />
              최근 영상
            </h2>
            <Link
              href="/videos"
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
            >
              모두 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-accent/20 transition-all duration-300 card-shine"
              >
                <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative overflow-hidden">
                  <video
                    src={video.filePath}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                    muted
                    preload="metadata"
                  />
                  <Video className="w-12 h-12 text-accent/40 group-hover:text-accent/60 transition-colors relative z-10" />
                  {video.fileSize && (
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
                      {(video.fileSize / 1024 / 1024).toFixed(0)} MB
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate group-hover:text-accent transition-colors">
                    {video.title}
                  </h3>
                  {video.people.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.people.slice(0, 3).map((vp) => (
                        <span
                          key={vp.person.id}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {vp.person.name}
                        </span>
                      ))}
                      {video.people.length > 3 && (
                        <span className="text-xs text-muted">
                          +{video.people.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {recentNovels.length === 0 && recentVideos.length === 0 && (
        <section className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold mb-2">아직 콘텐츠가 없습니다</h2>
          <p className="text-muted mb-6">
            첫 번째 소설이나 영상을 업로드해보세요!
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
          >
            시작하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      )}
    </div>
  );
}
