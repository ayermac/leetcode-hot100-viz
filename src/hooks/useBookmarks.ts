'use client';

import { useState, useCallback, useEffect, useLayoutEffect } from 'react';

const BOOKMARKS_KEY = 'leetcode-bookmarks';

function getStoredBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setBookmarks(getStoredBookmarks());
    setMounted(true);
  }, []);

  const saveBookmarks = useCallback((newBookmarks: string[]) => {
    setBookmarks(newBookmarks);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    }
  }, []);

  const addBookmark = useCallback((problemId: string) => {
    if (!bookmarks.includes(problemId)) {
      saveBookmarks([...bookmarks, problemId]);
    }
  }, [bookmarks, saveBookmarks]);

  const removeBookmark = useCallback((problemId: string) => {
    saveBookmarks(bookmarks.filter(id => id !== problemId));
  }, [bookmarks, saveBookmarks]);

  const toggleBookmark = useCallback((problemId: string) => {
    if (bookmarks.includes(problemId)) {
      removeBookmark(problemId);
    } else {
      addBookmark(problemId);
    }
  }, [bookmarks, addBookmark, removeBookmark]);

  const isBookmarked = useCallback((problemId: string) => {
    return bookmarks.includes(problemId);
  }, [bookmarks]);

  const clearBookmarks = useCallback(() => {
    saveBookmarks([]);
  }, [saveBookmarks]);

  return {
    bookmarks,
    mounted,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
}
