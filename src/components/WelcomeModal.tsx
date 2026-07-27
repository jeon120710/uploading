"use client";

import { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";

const STORAGE_KEY = "storyverse_welcomed";

export function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const welcomed = localStorage.getItem(STORAGE_KEY);
    if (!welcomed) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative bg-card rounded-3xl shadow-2xl border border-border max-w-md w-full p-8 animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-foreground/5 transition-colors text-muted hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/25">
            <BookOpen className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold mb-3">
            StoryVerse에 오신 것을 환영합니다
          </h2>

          <div className="bg-primary/5 rounded-2xl p-5 mb-6 border border-primary/10">
            <p className="text-foreground/80 leading-relaxed">
              이 사이트는 <span className="font-bold text-primary">허민율</span>을
              위하여{" "}
              <span className="font-bold text-accent">전민재</span>가
              개발하였음
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-[1.02]"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
