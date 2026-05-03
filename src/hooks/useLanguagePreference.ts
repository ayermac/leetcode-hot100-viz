'use client';

import { useState, useCallback, useEffect, useLayoutEffect } from 'react';

export type Language = 'go' | 'python' | 'java';

const STORAGE_KEY = 'leetcode-viz-language';

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'go';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && ['go', 'python', 'java'].includes(stored)) {
    return stored as Language;
  }
  return 'go';
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useLanguagePreference() {
  const [language, setLanguageState] = useState<Language>('go');
  const [isHydrated, setIsHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setLanguageState(getStoredLanguage());
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  return {
    language,
    setLanguage,
    isHydrated,
  };
}
