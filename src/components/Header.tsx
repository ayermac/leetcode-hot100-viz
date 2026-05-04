'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Menu, X, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggleSimple } from '@/components/ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground group-hover:text-violet-600 transition-colors">
              LeetCode Hot 100
            </span>
          </Link>
          <nav className="hidden sm:flex items-center space-x-1">
            <NavLink href="/" active>首页</NavLink>
            <NavLink href="/categories">分类</NavLink>
            <NavLink href="/bookmarks" icon={<Bookmark className="h-4 w-4" />}>收藏</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggleSimple />
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换菜单"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col space-y-2">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>首页</MobileNavLink>
            <MobileNavLink href="/categories" onClick={() => setMobileMenuOpen(false)}>分类</MobileNavLink>
            <MobileNavLink href="/bookmarks" onClick={() => setMobileMenuOpen(false)} icon={<Bookmark className="h-4 w-4" />}>收藏</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, active = false, icon }: { href: string; children: React.ReactNode; active?: boolean; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        active
          ? 'text-foreground bg-accent'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick, icon }: { href: string; children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 flex items-center gap-2"
    >
      {icon}
      {children}
    </Link>
  );
}
