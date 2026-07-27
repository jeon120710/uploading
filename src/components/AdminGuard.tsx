"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "Minjae079137!";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-card rounded-3xl border border-border p-8 w-full max-w-sm shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">관리자 인증</h2>
        <p className="text-sm text-muted mb-6">비밀번호를 입력하세요</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="비밀번호"
              autoFocus
              className={`w-full px-4 py-3 pr-12 bg-background border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-border focus:ring-primary/50 focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-500">비밀번호가 올바르지 않습니다.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
}
