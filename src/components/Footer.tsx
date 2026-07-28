import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} StoryVerse. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            개인정보 처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
