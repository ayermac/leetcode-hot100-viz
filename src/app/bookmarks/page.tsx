'use client';

import Link from 'next/link';
import { useBookmarks } from '@/hooks/useBookmarks';
import { getProblems } from '@/lib/data/loader';
import { Problem } from '@/lib/data/types';
import { Badge } from '@/components/ui/badge';
import { BookmarkButton } from '@/components/BookmarkButton';

export default function BookmarksPage() {
  const { bookmarks, mounted } = useBookmarks();
  const allProblems = getProblems();
  const bookmarkedProblems = allProblems.filter((p: Problem) => bookmarks.includes(p.id));

  if (!mounted) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">我的收藏</h1>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">我的收藏</h1>

      {bookmarkedProblems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">还没有收藏任何题目</p>
          <Link
            href="/categories"
            className="text-primary hover:underline"
          >
            浏览题目开始收藏
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarkedProblems.map((problem: Problem) => (
            <div
              key={problem.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <Link
                href={`/problems/${problem.id}`}
                className="flex-1 flex items-center gap-4"
              >
                <span className="font-mono text-muted-foreground">#{problem.id}</span>
                <span className="font-medium">{problem.title}</span>
                <Badge variant={
                  problem.difficulty === 'easy' ? 'default' :
                  problem.difficulty === 'medium' ? 'secondary' : 'destructive'
                }>
                  {problem.difficulty === 'easy' ? '简单' :
                   problem.difficulty === 'medium' ? '中等' : '困难'}
                </Badge>
              </Link>
              <BookmarkButton problemId={problem.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
