'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  problemId: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ problemId, className, showLabel = false }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark, mounted } = useBookmarks();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size={showLabel ? 'default' : 'icon-sm'} className={className}>
        <Bookmark className="h-4 w-4" />
        {showLabel && <span className="ml-2">收藏</span>}
      </Button>
    );
  }

  const bookmarked = isBookmarked(problemId);

  return (
    <Button
      variant={bookmarked ? 'default' : 'ghost'}
      size={showLabel ? 'default' : 'icon-sm'}
      onClick={() => toggleBookmark(problemId)}
      className={cn(className)}
      title={bookmarked ? '取消收藏' : '添加收藏'}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {showLabel && (
        <span className="ml-2">{bookmarked ? '已收藏' : '收藏'}</span>
      )}
    </Button>
  );
}
