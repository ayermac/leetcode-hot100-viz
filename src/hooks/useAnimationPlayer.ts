'use client';

import { useReducer, useEffect, useCallback } from 'react';
import {
  AnimationState,
  AnimationAction,
  AnimationSnapshot,
  SPEED_OPTIONS,
} from '@/lib/visualization/types';

const initialState: AnimationState = {
  snapshots: [],
  currentIndex: 0,
  isPlaying: false,
  speed: 1,
};

function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'STEP_FORWARD':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.snapshots.length - 1),
      };
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };
    case 'RESET':
      return { ...state, currentIndex: 0, isPlaying: false };
    case 'SET_SPEED':
      return SPEED_OPTIONS.includes(action.payload as typeof SPEED_OPTIONS[number])
        ? { ...state, speed: action.payload }
        : state;
    case 'GO_TO':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.payload, state.snapshots.length - 1)),
      };
    case 'LOAD_SNAPSHOTS':
      return {
        ...state,
        snapshots: action.payload,
        currentIndex: 0,
        isPlaying: false,
      };
    default:
      return state;
  }
}

export function useAnimationPlayer() {
  const [state, dispatch] = useReducer(animationReducer, initialState);

  // Auto-play effect with speed control
  useEffect(() => {
    if (!state.isPlaying || state.snapshots.length === 0) return;

    const baseInterval = 1000; // 1 second base
    const interval = baseInterval / state.speed;

    const timer = setInterval(() => {
      dispatch({ type: 'STEP_FORWARD' });
    }, interval);

    return () => clearInterval(timer);
  }, [state.isPlaying, state.speed, state.snapshots.length]);

  // Auto-pause at end
  useEffect(() => {
    if (
      state.isPlaying &&
      state.snapshots.length > 0 &&
      state.currentIndex >= state.snapshots.length - 1
    ) {
      dispatch({ type: 'PAUSE' });
    }
  }, [state.currentIndex, state.isPlaying, state.snapshots.length]);

  const currentSnapshot = state.snapshots[state.currentIndex] ?? null;
  const progress =
    state.snapshots.length > 0
      ? (state.currentIndex + 1) / state.snapshots.length
      : 0;

  const play = useCallback(() => dispatch({ type: 'PLAY' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const stepForward = useCallback(() => dispatch({ type: 'STEP_FORWARD' }), []);
  const stepBackward = useCallback(() => dispatch({ type: 'STEP_BACKWARD' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', payload: speed }), []);
  const goTo = useCallback((index: number) => dispatch({ type: 'GO_TO', payload: index }), []);
  const loadSnapshots = useCallback((snapshots: AnimationSnapshot[]) => dispatch({ type: 'LOAD_SNAPSHOTS', payload: snapshots }), []);

  return {
    // State
    currentSnapshot,
    currentIndex: state.currentIndex,
    totalSteps: state.snapshots.length,
    isPlaying: state.isPlaying,
    speed: state.speed,
    progress,
    canStepForward: state.currentIndex < state.snapshots.length - 1,
    canStepBackward: state.currentIndex > 0,

    // Actions
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    setSpeed,
    goTo,
    loadSnapshots,
  };
}
