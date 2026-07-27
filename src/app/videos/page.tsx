import Link from "next/link";
import { Video, Plus, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getVideosAndPeople(personFilter?: string) {
  try {
    const [videos, allPeople] = await Promise.all([
      prisma.video.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          people: { include: { person: true } },
        },
        ...(personFilter
          ? {
              where: {
                people: {
                  some: {
                    person: { name: personFilter },
                  },
                },
              },
            }
          : {}),
      }),
      prisma.person.findMany({
        include: { _count: { select: { videos: true } } },
        orderBy: { name: "asc" },
      }),
    ]);
    return { videos, allPeople };
  } catch {
    return { videos: [], allPeople: [] };
  }
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ person?: string }>;
}) {
  const { person: personFilter } = await searchParams;
  const { videos, allPeople } = await getVideosAndPeople(personFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-accent" />
            </div>
            영상
          </h1>
          <p className="text-muted mt-1">다양한 영상을 감상하세요</p>
        </div>
        <Link
          href="/upload?type=video"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-amber-600 text-white rounded-xl font-medium shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          영상 올리기
        </Link>
      </div>

      {/* People Filter */}
      {allPeople.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            출연자 필터
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/videos"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !personFilter
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "bg-card border border-border text-foreground/60 hover:border-accent/30 hover:text-accent"
              }`}
            >
              전체
            </Link>
            {allPeople.map((p) => (
              <Link
                key={p.id}
                href={`/videos?person=${encodeURIComponent(p.name)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  personFilter === p.name
                    ? "bg-accent text-white shadow-md shadow-accent/25"
                    : "bg-card border border-border text-foreground/60 hover:border-accent/30 hover:text-accent"
                }`}
              >
                {p.name}
                <span className="ml-1 text-xs opacity-70">
                  ({p._count.videos})
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-accent/30" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {personFilter
              ? `"${personFilter}" 관련 영상이 없습니다`
              : "아직 영상이 없습니다"}
          </h2>
          <p className="text-muted mb-6">첫 번째 영상을 업로드해보세요!</p>
          <Link
            href="/upload?type=video"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            영상 올리기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-accent/20 transition-all duration-300 card-shine"
            >
              <div className="aspect-video bg-gradient-to-br from-accent/20 via-amber-50 to-primary/10 flex items-center justify-center relative overflow-hidden">
                <video
                  src={video.filePath}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                  muted
                  preload="metadata"
                />
                <Video className="w-14 h-14 text-accent/30 group-hover:text-accent/50 transition-colors relative z-10" />
                {video.fileSize && (
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
                    {(video.fileSize / 1024 / 1024).toFixed(0)} MB
                  </span>
                )}
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-mono">
                    {video.duration}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors truncate">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-sm text-muted/70 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                )}
                {video.people.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {video.people.map((vp) => (
                      <span
                        key={vp.person.id}
                        className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-medium"
                      >
                        {vp.person.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted mt-3 pt-3 border-t border-border">
                  <span>{new Date(video.createdAt).toLocaleDateString("ko-KR")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
