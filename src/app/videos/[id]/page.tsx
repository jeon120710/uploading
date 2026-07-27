import Link from "next/link";
import { notFound } from "next/navigation";
import { Video, ArrowLeft, Eye, Clock, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      people: { include: { person: true } },
    },
  });

  if (!video) notFound();

  await prisma.video.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        href="/videos"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        영상 목록으로
      </Link>

      <article className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
        {/* Video Player Area */}
        <div className="aspect-video bg-gradient-to-br from-accent/20 via-amber-50 to-primary/10 flex items-center justify-center relative">
          {video.url.includes("youtube.com") || video.url.includes("youtu.be") ? (
            <iframe
              src={video.url.replace("watch?v=", "embed/")}
              className="absolute inset-0 w-full h-full rounded-t-3xl"
              allowFullScreen
              title={video.title}
            />
          ) : (
            <div className="text-center">
              <Video className="w-20 h-20 text-accent/30 mx-auto mb-4" />
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                외부 링크에서 시청하기 →
              </a>
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-border">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(video.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {video.viewCount.toLocaleString()}회
            </span>
            {video.duration && (
              <span className="font-mono">{video.duration}</span>
            )}
          </div>

          {video.description && (
            <div className="mb-6 p-4 bg-accent/5 rounded-xl border border-accent/10">
              <p className="text-sm text-muted">{video.description}</p>
            </div>
          )}

          {/* People */}
          {video.people.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                출연자
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.people.map((vp) => (
                  <Link
                    key={vp.person.id}
                    href={`/videos?person=${encodeURIComponent(vp.person.name)}`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold">
                      {vp.person.name[0]}
                    </div>
                    {vp.person.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all hover:scale-105"
          >
            <Video className="w-4 h-4" />
            원본 보기
          </a>
        </div>
      </article>
    </div>
  );
}
