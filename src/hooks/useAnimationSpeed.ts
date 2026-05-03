'use client';

import { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { SPEED_OPTIONS, SpeedOption } from '@/lib/visualization/types';

const STORAGE_KEY = 'leetcode-viz-animation-speed';

function getStoredSpeed(): number {
  if (typeof window === 'undefined') return 1;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = parseFloat(stored);
    if (SPEED_OPTIONS.includes(parsed as SpeedOption)) {
      return parsed;
    }
  }
  return 1;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useAnimationSpeed() {
  const [speed, setSpeedState] = useState<number>(1);
  const [isHydrated, setIsHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setSpeedState(getStoredSpeed());
    setIsHydrated(true);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedState(newSpeed);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(newSpeed));
    }
  }, []);

  return { speed, setSpeed, isHydrated };
}
