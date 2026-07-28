"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">접근 권한이 없습니다.</h2>
          <p className="text-muted">관리자 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

