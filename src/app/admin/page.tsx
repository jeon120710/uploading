"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  RefreshCw,
  Video,
  BookOpen,
  Eye,
  Clock,
  AlertCircle,
  Save,
  Edit2,
} from "lucide-react";
import { AdminGuard } from "@/components/AdminGuard";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  fileName: string;
  fileSize: number | null;
  mimeType: string | null;
  duration: string | null;
  viewCount: number;
  createdAt: string;
  filePath: string;
  people: { person: { id: string; name: string } }[];
}

interface NovelItem {
  id: string;
  title: string;
  author: string;
  description: string | null;
  content: string;
  viewCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"videos" | "novels">("videos");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [novels, setNovels] = useState<NovelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<VideoItem | NovelItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", author: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [videoRes, novelRes] = await Promise.all([
        fetch("/api/videos"),
        fetch("/api/novels"),
      ]);
      const videoData = await videoRes.json();
      const novelData = await novelRes.json();
      setVideos(videoData);
      setNovels(novelData);
    } catch {
      alert("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: VideoItem | NovelItem) => {
    setIsEditing(true);
    setEditForm({
      title: item.title,
      author: "author" in item ? item.author : "",
    });
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    const type = "filePath" in selectedItem ? "videos" : "novels";
    try {
      const res = await fetch(`/api/${type}/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed");
      setIsEditing(false);
      setSelectedItem(null);
      fetchData();
    } catch {
      alert("수정에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (type: "video" | "novel", id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/${type === "video" ? "videos" : "novels"}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setSelectedItem(null);
      fetchData();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "-";
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <AdminGuard>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">관리자 콘솔</h1>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:bg-card-hover transition-colors text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-card rounded-2xl border border-border">
        <button
          onClick={() => { setActiveTab("videos"); setSelectedItem(null); setIsEditing(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            activeTab === "videos"
              ? "bg-accent text-white shadow-lg shadow-accent/25"
              : "text-muted hover:text-foreground"
          }`}
        >
          <Video className="w-4 h-4" />
          영상 ({videos.length})
        </button>
        <button
          onClick={() => { setActiveTab("novels"); setSelectedItem(null); setIsEditing(false); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            activeTab === "novels"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-muted hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          소설 ({novels.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
          {loading ? (
            <div className="text-center py-12 text-muted">로딩 중...</div>
          ) : activeTab === "videos" ? (
            videos.length === 0 ? (
              <div className="text-center py-12 text-muted">영상이 없습니다.</div>
            ) : (
              videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedItem(v); setIsEditing(false); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedItem?.id === v.id
                      ? "border-accent bg-accent/5"
                      : "border-border bg-card hover:border-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{v.title}</h3>
                      <p className="text-xs text-muted mt-1">{v.fileName}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {v.viewCount}
                        </span>
                        <span>{formatSize(v.fileSize)}</span>
                        <span>{new Date(v.createdAt).toLocaleDateString("ko-KR")}</span>
                      </div>
                      {v.people.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {v.people.map((vp) => (
                            <span key={vp.person.id} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {vp.person.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete("video", v.id); }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))
            )
          ) : novels.length === 0 ? (
            <div className="text-center py-12 text-muted">소설이 없습니다.</div>
          ) : (
            novels.map((n) => (
              <button
                key={n.id}
                onClick={() => { setSelectedItem(n); setIsEditing(false); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedItem?.id === n.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{n.title}</h3>
                    <p className="text-xs text-muted mt-1">by {n.author}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {n.viewCount}
                      </span>
                      <span>{n.content.length.toLocaleString()} 자</span>
                      <span>{new Date(n.createdAt).toLocaleDateString("ko-KR")}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete("novel", n.id); }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">상세 정보</h2>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => startEdit(selectedItem)}
                      className="text-xs text-muted hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
              </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="text-xs text-accent hover:text-accent/80 font-bold"
                    >
                      저장
                    </button>
          )}
                  <button
                    onClick={() => { setSelectedItem(null); setIsEditing(false); }}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    닫기
                  </button>
        </div>
      </div>

              {"filePath" in selectedItem ? (
                // Video detail
                <>
                  <div className="aspect-video bg-black rounded-xl mb-4 overflow-hidden">
                    <video
                      src={selectedItem.filePath}
                      controls
                      className="w-full h-full"
                    />
                  </div>
                  <div className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
    <div>
                          <p className="text-xs text-muted mb-1">제목</p>
                          <input
                            className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
    </div>
                      </div>
                    ) : (
                      <DetailRow label="제목" value={selectedItem.title} />
                    )}
                    <DetailRow label="파일명" value={selectedItem.fileName} />
                    <DetailRow label="설명" value={selectedItem.description || "-"} />
                    <DetailRow label="크기" value={formatSize(selectedItem.fileSize)} />
                    <DetailRow label="타입" value={selectedItem.mimeType || "-"} />
                    <DetailRow label="러닝타임" value={selectedItem.duration || "-"} />
                    <DetailRow label="조회수" value={`${selectedItem.viewCount}회`} />
                    <DetailRow
                      label="등록일"
                      value={new Date(selectedItem.createdAt).toLocaleString("ko-KR")}
                    />
                    {selectedItem.people.length > 0 && (
                      <div>
                        <p className="text-xs text-muted mb-1">출연자</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedItem.people.map((vp) => (
                            <span key={vp.person.id} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {vp.person.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted mb-1">ID</p>
                      <code className="text-xs bg-foreground/5 px-2 py-1 rounded block break-all">
                        {selectedItem.id}
                      </code>
                    </div>
                  </div>
                </>
              ) : (
                // Novel detail
                <>
                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <div>
                          <p className="text-xs text-muted mb-1">제목</p>
                          <input
                            className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted mb-1">작가</p>
                          <input
                            className="w-full bg-background border border-border rounded px-2 py-1 text-sm"
                            value={editForm.author}
                            onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <DetailRow label="제목" value={selectedItem.title} />
                        <DetailRow label="작가" value={selectedItem.author} />
                      </>
                    )}
                    <DetailRow label="설명" value={selectedItem.description || "-"} />
                    <DetailRow label="글자수" value={`${selectedItem.content.length.toLocaleString()} 자`} />
                    <DetailRow label="조회수" value={`${selectedItem.viewCount}회`} />
                    <DetailRow
                      label="등록일"
                      value={new Date(selectedItem.createdAt).toLocaleString("ko-KR")}
                    />
                    <div>
                      <p className="text-xs text-muted mb-1">ID</p>
                      <code className="text-xs bg-foreground/5 px-2 py-1 rounded block break-all">
                        {selectedItem.id}
                      </code>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() =>
                  handleDelete(
                    "filePath" in selectedItem ? "video" : "novel",
                    selectedItem.id
                  )
                }
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                삭제하기
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-6 text-center text-muted">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">항목을 선택하면 상세 정보가 표시됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </AdminGuard>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
}

