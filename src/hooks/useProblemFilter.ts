'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Problem } from '@/lib/data/types';

export type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

export interface FilterState {
  difficulty: Difficulty;
  categoryId: string;
  bookmarkedOnly: boolean;
}

const DEFAULT_FILTER: FilterState = {
  difficulty: 'all',
  categoryId: 'all',
  bookmarkedOnly: false,
};

export function useProblemFilter(problems: Problem[], bookmarks: string[]) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize from URL params
  const initialFilter = useMemo((): FilterState => {
    const difficulty = (searchParams.get('difficulty') as Difficulty) || 'all';
    const categoryId = searchParams.get('category') || 'all';
    const bookmarkedOnly = searchParams.get('bookmarked') === 'true';

    return {
      difficulty: ['all', 'easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'all',
      categoryId,
      bookmarkedOnly,
    };
  }, [searchParams]);

  const [filter, setFilterState] = useState<FilterState>(initialFilter);

  // Update URL params
  const updateUrl = useCallback(
    (newFilter: FilterState) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilter.difficulty !== 'all') {
        params.set('difficulty', newFilter.difficulty);
      } else {
        params.delete('difficulty');
      }

      if (newFilter.categoryId !== 'all') {
        params.set('category', newFilter.categoryId);
      } else {
        params.delete('category');
      }

      if (newFilter.bookmarkedOnly) {
        params.set('bookmarked', 'true');
      } else {
        params.delete('bookmarked');
      }

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
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
  }, [problems, filter, bookmarks]);

  const setFilter = useCallback(
    (updates: Partial<FilterState>) => {
      const newFilter = { ...filter, ...updates };
      setFilterState(newFilter);
      updateUrl(newFilter);
    },
    [filter, updateUrl]
  );

  const resetFilter = useCallback(() => {
    setFilterState(DEFAULT_FILTER);
    updateUrl(DEFAULT_FILTER);
  }, [updateUrl]);

  const hasActiveFilters =
    filter.difficulty !== 'all' ||
    filter.categoryId !== 'all' ||
    filter.bookmarkedOnly;

  return {
    filter,
    setFilter,
    resetFilter,
    filteredProblems,
    hasActiveFilters,
  };
}
