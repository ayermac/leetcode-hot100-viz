'use client';

import { useState, useMemo, useCallback } from 'react';
import { Problem } from '@/lib/data/types';

interface UseProblemSearchOptions {
  problems: Problem[];
  minQueryLength?: number;
}

export function useProblemSearch({ problems, minQueryLength = 1 }: UseProblemSearchOptions) {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (normalizedQuery.length < minQueryLength) {
      return [];
    }

    return problems.filter((problem) => {
      const titleMatch = problem.title.toLowerCase().includes(normalizedQuery);
      const idMatch = problem.id.includes(normalizedQuery);
      const leetcodeIdMatch = problem.leetcodeId.toString().includes(normalizedQuery);

      return titleMatch || idMatch || leetcodeIdMatch;
    });
  }, [problems, normalizedQuery, minQueryLength]);

  const clearQuery = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    clearQuery,
    isSearching: normalizedQuery.length >= minQueryLength,
  };
}
