'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Menu, X } from 'lucide-react';
import { ThemeToggleSimple } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">LeetCode Hot 100</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
              首页
            </Link>
            <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
              分类
            </Link>
            <Link href="/bookmarks" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              收藏
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggleSimple />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换菜单"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              分类
            </Link>
            <Link
              href="/bookmarks"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bookmark className="h-4 w-4" />
              收藏
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
