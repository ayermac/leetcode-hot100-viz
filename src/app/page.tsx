'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { CategoryGrid } from "@/components/CategoryGrid";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useProblemSearch } from "@/hooks/useProblemSearch";
import { useProblemFilter } from "@/hooks/useProblemFilter";
import { useBookmarks } from "@/hooks/useBookmarks";
import { getProblems, getCategories } from "@/lib/data/loader";
import { Problem } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";

function HomeContent() {
  const problems = getProblems();
  const categories = getCategories();
  const { bookmarks } = useBookmarks();

  // Use search hook properly - it manages its own query state
  const {
    query,
    setQuery,
    results,
    isSearching
  } = useProblemSearch({ problems });

  const {
    filter,
    setFilter,
    resetFilter,
    filteredProblems,
    hasActiveFilters
  } = useProblemFilter(problems, bookmarks);

  // Combine search and filter properly
  const displayProblems = useMemo(() => {
    let result = problems;

    // Apply search if searching
    if (isSearching) {
      result = results;
    }

    // Apply filters - but when searching, we need to filter the search results
    if (hasActiveFilters) {
      result = result.filter((problem) => {
        // Difficulty filter
        if (filter.difficulty !== 'all' && problem.difficulty !== filter.difficulty) {
          return false;
        }
        // Category filter
        if (filter.categoryId !== 'all' && problem.categoryId !== filter.categoryId) {
          return false;
        }
        // Bookmark filter
        if (filter.bookmarkedOnly && !bookmarks.includes(problem.id)) {
          return false;
        }
        return true;
      });
    }

    return result;
  }, [problems, isSearching, results, hasActiveFilters, filter, bookmarks]);

  return (
    <>
      {/* Search and Filter section */}
      <section className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar value={query} onChange={setQuery} className="flex-1 max-w-md" />
        </div>

        <FilterPanel
          filter={filter}
          setFilter={setFilter}
          resetFilter={resetFilter}
          hasActiveFilters={hasActiveFilters}
          categories={categories}
        />

        {/* Results */}
        {(isSearching || hasActiveFilters) && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">
              找到 {displayProblems.length} 道题目
            </p>
            {displayProblems.length > 0 ? (
              displayProblems.map((problem: Problem) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <Link
                    href={`/problems/${problem.id}`}
                    className="flex-1 flex items-center gap-3"
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
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                未找到匹配的题目
              </p>
            )}
          </div>
        )}
      </section>

      {/* Categories */}
      {!isSearching && !hasActiveFilters && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">算法分类</h2>
          <CategoryGrid />
        </section>
      )}
    </>
  );
}

export default function Home() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LeetCode Hot 100 可视化学习</h1>
        <p className="text-muted-foreground">
          通过交互式动画深入理解经典算法，掌握 Hot 100 核心题型
        </p>
      </div>

      <Suspense fallback={<div className="text-muted-foreground">加载中...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
