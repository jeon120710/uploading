import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ArrowLeft, Eye, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novel = await prisma.novel.findUnique({
    where: { id },
  });

  if (!novel) notFound();

  await prisma.novel.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link
        href="/novels"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        소설 목록으로
      </Link>

      <article className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
        <div className="h-48 bg-gradient-to-br from-primary/20 via-indigo-100 to-accent/10 flex items-center justify-center">
          <BookOpen className="w-20 h-20 text-primary/30" />
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-2">{novel.title}</h1>
          <p className="text-lg text-muted mb-4">by {novel.author}</p>

          <div className="flex items-center gap-4 text-sm text-muted mb-6 pb-6 border-b border-border">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(novel.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {novel.viewCount.toLocaleString()}회
            </span>
            <span>{novel.content.length.toLocaleString()} 자</span>
          </div>

          {novel.description && (
            <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm text-muted italic">{novel.description}</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
            {novel.content}
          </div>
        </div>
      </article>
    </div>
  );
}
