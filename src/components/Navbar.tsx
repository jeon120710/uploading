"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Video, Home, Upload, Settings } from "lucide-react";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/novels", label: "소설", icon: BookOpen },
  { href: "/videos", label: "영상", icon: Video },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              StoryVerse
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === "/admin"
                  ? "bg-foreground/10 text-foreground"
                  : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">관리</span>
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">업로드</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
