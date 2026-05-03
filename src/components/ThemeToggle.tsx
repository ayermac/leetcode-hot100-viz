'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className={cn('h-8 w-8', className)}>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => setTheme('light')}
        className="h-8 w-8"
        title="亮色模式"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => setTheme('dark')}
        className="h-8 w-8"
        title="暗色模式"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon-sm"
        onClick={() => setTheme('system')}
        className="h-8 w-8"
        title="跟随系统"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Simple toggle button variant
export function ThemeToggleSimple({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" className={cn('h-8 w-8', className)}>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className={cn('h-8 w-8', className)}
      title={resolvedTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
