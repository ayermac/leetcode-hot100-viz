# Phase 3: 动画引擎与数组可视化 - Implementation Plan

**Phase:** 3
**Depends on:** Phase 2 (Problem Detail & Code View)
**Files Modified:** 15+ new files, 2 modified files
**Autonomous:** true

---

## Phase Goal

建立动画状态机基础设施，实现数组可视化器，完成首批数组类算法的动画演示。

**Requirements:** VIZ-01 (数组可视化展示), VIZ-03 (动画控制)

---

## Must Haves

1. **Animation State Machine** - 完整的播放状态管理（播放/暂停/步进/重置/速度控制）
2. **Array Visualizer** - 数组元素可视化展示，支持状态颜色和指针标注
3. **Playback Controls UI** - 播放控制条（按钮、进度条、速度选择）
4. **Algorithm Executors** - 至少 3 个数组算法的快照生成器
5. **Page Integration** - 题目详情页集成动画播放器

---

## Tasks

### Wave 1: Dependencies & Types

#### Task 1.1: Install motion package

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/package.json`

**action:**
```bash
cd /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz && pnpm add motion
```

**acceptance_criteria:**
- `grep -q '"motion":' package.json` returns 0
- `pnpm list motion` shows installed version

---

#### Task 1.2: Define visualization types

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/data/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts` with:

```typescript
// Element states for array visualization
export type ElementState = 'normal' | 'comparing' | 'swapping' | 'sorted';

// Pointer annotation
export interface Pointer {
  name: string;        // "left", "right", "i", "j", "mid"
  index: number;       // Position in array
}

// Array snapshot for a single animation step
export interface ArraySnapshot {
  elements: number[];
  elementStates: Map<number, ElementState>;
  pointers: Pointer[];
}

// Complete animation snapshot
export interface AnimationSnapshot {
  step: number;
  description: string;
  data: ArraySnapshot;
}

// Animation player state
export interface AnimationState {
  snapshots: AnimationSnapshot[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;  // 0.5, 1, 2
}

// Animation player actions
export type AnimationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'GO_TO'; payload: number }
  | { type: 'LOAD_SNAPSHOTS'; payload: AnimationSnapshot[] };

// Speed options
export const SPEED_OPTIONS = [0.5, 1, 2] as const;
export type SpeedOption = typeof SPEED_OPTIONS[number];

// Executor interface
export interface AlgorithmExecutor {
  execute(input: unknown): AnimationSnapshot[];
  getDefaultInput(): unknown;
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/types.ts`
- `grep -q "ElementState" src/lib/visualization/types.ts` returns 0
- `grep -q "AnimationSnapshot" src/lib/visualization/types.ts` returns 0
- `grep -q "SPEED_OPTIONS" src/lib/visualization/types.ts` returns 0

---

### Wave 2: Core Hooks

#### Task 2.1: Create animation player hook

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/useLanguagePreference.ts`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/useAnimationPlayer.ts`:

```typescript
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
```

**acceptance_criteria:**
- File exists at `src/hooks/useAnimationPlayer.ts`
- `grep -q "useAnimationPlayer" src/hooks/useAnimationPlayer.ts` returns 0
- `grep -q "animationReducer" src/hooks/useAnimationPlayer.ts` returns 0

---

#### Task 2.2: Create animation speed persistence hook

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/useLanguagePreference.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/useAnimationSpeed.ts`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { SPEED_OPTIONS, SpeedOption } from '@/lib/visualization/types';

const STORAGE_KEY = 'leetcode-viz-animation-speed';

export function useAnimationSpeed() {
  const [speed, setSpeedState] = useState<number>(1);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseFloat(stored);
      if (SPEED_OPTIONS.includes(parsed as SpeedOption)) {
        setSpeedState(parsed);
      }
    }
  }, []);

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(newSpeed));
    }
  };

  return { speed, setSpeed, isHydrated };
}
```

**acceptance_criteria:**
- File exists at `src/hooks/useAnimationSpeed.ts`
- `grep -q "useAnimationSpeed" src/hooks/useAnimationSpeed.ts` returns 0
- `grep -q "STORAGE_KEY" src/hooks/useAnimationSpeed.ts` returns 0

---

### Wave 3: Visualization Components

#### Task 3.1: Create ArrayElement component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/ArrayElement.tsx`:

```typescript
'use client';

import { motion } from 'motion/react';
import { ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface ArrayElementProps {
  value: number;
  index: number;
  state: ElementState;
}

const stateVariants = {
  normal: {
    scale: 1,
    backgroundColor: 'oklch(0.7 0 0)', // gray-500 equivalent
    transition: { duration: 0.2 },
  },
  comparing: {
    scale: 1.1,
    backgroundColor: 'oklch(0.6 0.2 250)', // blue-500
    transition: { duration: 0.15 },
  },
  swapping: {
    scale: 1.15,
    backgroundColor: 'oklch(0.7 0.2 40)', // orange-500
    transition: { duration: 0.15 },
  },
  sorted: {
    scale: 1,
    backgroundColor: 'oklch(0.65 0.2 145)', // green-500
    transition: { duration: 0.3 },
  },
};

export function ArrayElement({ value, index, state }: ArrayElementProps) {
  return (
    <motion.div
      layout
      variants={stateVariants}
      initial="normal"
      animate={state}
      className={cn(
        'flex flex-col items-center justify-center',
        'w-14 h-14 rounded-lg',
        'text-lg font-semibold text-white',
        'shadow-md'
      )}
    >
      <span className="text-base">{value}</span>
      <span className="text-xs opacity-70 mt-0.5">{index}</span>
    </motion.div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/components/visualization/ArrayElement.tsx`
- `grep -q "motion" src/components/visualization/ArrayElement.tsx` returns 0
- `grep -q "stateVariants" src/components/visualization/ArrayElement.tsx` returns 0

---

#### Task 3.2: Create PointerArrow component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/PointerArrow.tsx`:

```typescript
'use client';

import { motion } from 'motion/react';
import { Pointer } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface PointerArrowProps {
  pointer: Pointer;
  elementWidth: number;
  offset?: number; // Vertical offset for multiple pointers at same index
}

const pointerColors: Record<string, string> = {
  left: 'text-blue-600',
  right: 'text-purple-600',
  i: 'text-green-600',
  j: 'text-orange-600',
  mid: 'text-red-600',
  write: 'text-cyan-600',
  found: 'text-emerald-600',
};

export function PointerArrow({ pointer, elementWidth, offset = 0 }: PointerArrowProps) {
  const leftPosition = pointer.index * elementWidth + elementWidth / 2;
  const colorClass = pointerColors[pointer.name] || 'text-gray-600';

  return (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: leftPosition - elementWidth / 2,
        opacity: 1,
        y: offset * -24,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'absolute -top-8 flex flex-col items-center',
        'text-sm font-medium',
        colorClass
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="mb-0.5"
        fill="currentColor"
      >
        <path d="M8 12L3 6h10L8 12z" />
      </svg>
      <span className="font-mono">{pointer.name}</span>
    </motion.div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/components/visualization/PointerArrow.tsx`
- `grep -q "PointerArrow" src/components/visualization/PointerArrow.tsx` returns 0
- `grep -q "pointerColors" src/components/visualization/PointerArrow.tsx` returns 0

---

#### Task 3.3: Create ArrayVisualizer component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/ArrayElement.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/PointerArrow.tsx`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/ArrayVisualizer.tsx`:

```typescript
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ArraySnapshot, ElementState } from '@/lib/visualization/types';
import { ArrayElement } from './ArrayElement';
import { PointerArrow } from './PointerArrow';
import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  snapshot: ArraySnapshot | null;
  className?: string;
}

const ELEMENT_WIDTH = 56; // w-14 = 56px
const ELEMENT_GAP = 8; // gap-2 = 8px

export function ArrayVisualizer({ snapshot, className }: ArrayVisualizerProps) {
  if (!snapshot) {
    return (
      <div className={cn('flex items-center justify-center h-32', className)}>
        <p className="text-muted-foreground">点击"播放"开始动画演示</p>
      </div>
    );
  }

  const { elements, elementStates, pointers } = snapshot;

  // Group pointers by index for offset calculation
  const pointersByIndex = pointers.reduce(
    (acc, pointer) => {
      if (!acc[pointer.index]) {
        acc[pointer.index] = [];
      }
      acc[pointer.index].push(pointer);
      return acc;
    },
    {} as Record<number, typeof pointers>
  );

  return (
    <div className={cn('py-10 px-4', className)}>
      {/* Pointers */}
      <div className="relative h-10">
        {pointers.map((pointer, idx) => {
          const offset = pointersByIndex[pointer.index]?.indexOf(pointer) || 0;
          return (
            <PointerArrow
              key={`${pointer.name}-${pointer.index}`}
              pointer={pointer}
              elementWidth={ELEMENT_WIDTH + ELEMENT_GAP}
              offset={offset}
            />
          );
        })}
      </div>

      {/* Array elements */}
      <motion.div layout className="flex gap-2 justify-center">
        <AnimatePresence mode="popLayout">
          {elements.map((value, index) => {
            const state: ElementState = elementStates.get(index) || 'normal';
            return (
              <ArrayElement
                key={`el-${index}`}
                value={value}
                index={index}
                state={state}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/components/visualization/ArrayVisualizer.tsx`
- `grep -q "ArrayVisualizer" src/components/visualization/ArrayVisualizer.tsx` returns 0
- `grep -q "AnimatePresence" src/components/visualization/ArrayVisualizer.tsx` returns 0

---

#### Task 3.4: Create PlaybackControls component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/ui/button.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/PlaybackControls.tsx`:

```typescript
'use client';

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SPEED_OPTIONS, SpeedOption } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  canStepForward: boolean;
  canStepBackward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (index: number) => void;
}

export function PlaybackControls({
  isPlaying,
  currentIndex,
  totalSteps,
  speed,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onSeek,
}: PlaybackControlsProps) {
  const progress = totalSteps > 0 ? (currentIndex + 1) / totalSteps : 0;

  return (
    <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={currentIndex === 0}
          title="重置"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={!canStepBackward}
          title="上一步"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalSteps === 0 || (isPlaying && !canStepForward)}
          title={isPlaying ? '暂停' : '播放'}
          className="w-10 h-10"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={!canStepForward}
          title="下一步"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        {/* Speed selector */}
        <div className="ml-4 flex items-center gap-1">
          <span className="text-sm text-muted-foreground mr-1">速度:</span>
          {SPEED_OPTIONS.map((s) => (
            <Button
              key={s}
              variant={speed === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(s)}
              className="px-2 h-7 text-xs"
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground min-w-[60px] text-right">
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/components/visualization/PlaybackControls.tsx`
- `grep -q "PlaybackControls" src/components/visualization/PlaybackControls.tsx` returns 0
- `grep -q "SPEED_OPTIONS" src/components/visualization/PlaybackControls.tsx` returns 0

---

#### Task 3.5: Create AlgorithmPlayer component (composition)

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/ArrayVisualizer.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/PlaybackControls.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/useAnimationPlayer.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/AlgorithmPlayer.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { AnimationSnapshot } from '@/lib/visualization/types';
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer';
import { useAnimationSpeed } from '@/hooks/useAnimationSpeed';
import { ArrayVisualizer } from './ArrayVisualizer';
import { PlaybackControls } from './PlaybackControls';

interface AlgorithmPlayerProps {
  snapshots: AnimationSnapshot[];
  autoLoad?: boolean;
}

export function AlgorithmPlayer({ snapshots, autoLoad = true }: AlgorithmPlayerProps) {
  const { speed, setSpeed } = useAnimationSpeed();
  const player = useAnimationPlayer();

  // Load snapshots when provided
  useEffect(() => {
    if (autoLoad && snapshots.length > 0) {
      player.loadSnapshots(snapshots);
    }
  }, [snapshots, autoLoad, player]);

  // Sync speed from persistence
  useEffect(() => {
    player.setSpeed(speed);
  }, [speed, player]);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    player.setSpeed(newSpeed);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Step description */}
      {player.currentSnapshot && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium text-muted-foreground mr-2">
              步骤 {player.currentIndex + 1}:
            </span>
            {player.currentSnapshot.description}
          </p>
        </div>
      )}

      {/* Visualization */}
      <div className="border rounded-lg overflow-hidden">
        <ArrayVisualizer snapshot={player.currentSnapshot?.data ?? null} />
      </div>

      {/* Controls */}
      <PlaybackControls
        isPlaying={player.isPlaying}
        currentIndex={player.currentIndex}
        totalSteps={player.totalSteps}
        speed={player.speed}
        canStepForward={player.canStepForward}
        canStepBackward={player.canStepBackward}
        onPlay={player.play}
        onPause={player.pause}
        onStepForward={player.stepForward}
        onStepBackward={player.stepBackward}
        onReset={player.reset}
        onSpeedChange={handleSpeedChange}
        onSeek={player.goTo}
      />
    </div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/components/visualization/AlgorithmPlayer.tsx`
- `grep -q "AlgorithmPlayer" src/components/visualization/AlgorithmPlayer.tsx` returns 0
- `grep -q "useAnimationPlayer" src/components/visualization/AlgorithmPlayer.tsx` returns 0

---

#### Task 3.6: Create visualization index file

**read_first:**
- None needed

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/index.ts`:

```typescript
export { ArrayElement } from './ArrayElement';
export { ArrayVisualizer } from './ArrayVisualizer';
export { PointerArrow } from './PointerArrow';
export { PlaybackControls } from './PlaybackControls';
export { AlgorithmPlayer } from './AlgorithmPlayer';
```

**acceptance_criteria:**
- File exists at `src/components/visualization/index.ts`
- `grep -q "AlgorithmPlayer" src/components/visualization/index.ts` returns 0

---

### Wave 4: Algorithm Executors

#### Task 4.1: Create executor utilities

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/types.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/utils.ts`:

```typescript
import { AnimationSnapshot, ArraySnapshot, ElementState, Pointer } from '../types';

type SnapshotYield = Omit<AnimationSnapshot, 'step'>;

export function createSnapshot(
  step: number,
  description: string,
  elements: number[],
  elementStates: Map<number, ElementState> = new Map(),
  pointers: Pointer[] = []
): AnimationSnapshot {
  return {
    step,
    description,
    data: {
      elements: [...elements],
      elementStates: new Map(elementStates),
      pointers: [...pointers],
    },
  };
}

export function generatorToSnapshots(
  generator: Generator<Omit<AnimationSnapshot, 'step'>>
): AnimationSnapshot[] {
  const snapshots: AnimationSnapshot[] = [];
  let step = 0;

  for (const snapshot of generator) {
    snapshots.push({ ...snapshot, step: step++ });
  }

  return snapshots;
}

export function createNormalStates(length: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < length; i++) {
    states.set(i, 'normal');
  }
  return states;
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/utils.ts`
- `grep -q "generatorToSnapshots" src/lib/visualization/executors/utils.ts` returns 0

---

#### Task 4.2: Create Two Sum executor

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/utils.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/twoSum.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

interface TwoSumInput {
  nums: number[];
  target: number;
}

function* twoSumGenerator(
  nums: number[],
  target: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const hashTable = new Map<number, number>();

  // Initial state
  yield {
    description: `开始在数组 [${nums.join(', ')}] 中查找两数之和为 ${target}`,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    },
  };

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Show current element being checked
    const states = new Map<number, ElementState>();
    states.set(i, 'comparing');
    const pointers: Pointer[] = [{ name: 'i', index: i }];

    yield {
      description: `检查 nums[${i}] = ${nums[i]}，寻找补数 ${complement}`,
      data: {
        elements: [...nums],
        elementStates: states,
        pointers,
      },
    };

    if (hashTable.has(complement)) {
      const foundIndex = hashTable.get(complement)!;

      // Found result
      const foundStates = new Map<number, ElementState>();
      foundStates.set(foundIndex, 'sorted');
      foundStates.set(i, 'sorted');

      yield {
        description: `找到答案！nums[${foundIndex}] + nums[${i}] = ${nums[foundIndex]} + ${nums[i]} = ${target}`,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [
            { name: 'i', index: i },
            { name: 'found', index: foundIndex },
          ],
        },
      };
      return;
    }

    // Store in hash table
    hashTable.set(nums[i], i);
  }

  // No solution found
  yield {
    description: `未找到符合条件的两个数`,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    },
  };
}

export function executeTwoSum(input: TwoSumInput): AnimationSnapshot[] {
  return generatorToSnapshots(twoSumGenerator(input.nums, input.target));
}

export function getTwoSumDefaultInput(): TwoSumInput {
  return {
    nums: [2, 7, 11, 15],
    target: 9,
  };
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/twoSum.ts`
- `grep -q "executeTwoSum" src/lib/visualization/executors/twoSum.ts` returns 0
- `grep -q "twoSumGenerator" src/lib/visualization/executors/twoSum.ts` returns 0

---

#### Task 4.3: Create Move Zeroes executor

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/utils.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/moveZeroes.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

function* moveZeroesGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const arr = [...nums]; // Work on a copy
  let writeIndex = 0;

  // Initial state
  yield {
    description: `开始移动零操作，初始数组: [${arr.join(', ')}]`,
    data: {
      elements: [...arr],
      elementStates: createNormalStates(arr.length),
      pointers: [
        { name: 'write', index: writeIndex },
        { name: 'i', index: 0 },
      ],
    },
  };

  for (let i = 0; i < arr.length; i++) {
    // Show current element being checked
    const states = new Map<number, ElementState>();
    states.set(i, 'comparing');

    yield {
      description: `检查 nums[${i}] = ${arr[i]}`,
      data: {
        elements: [...arr],
        elementStates: states,
        pointers: [
          { name: 'write', index: writeIndex },
          { name: 'i', index: i },
        ],
      },
    };

    if (arr[i] !== 0) {
      if (i !== writeIndex) {
        // Swap
        [arr[writeIndex], arr[i]] = [arr[i], arr[writeIndex]];

        const swapStates = new Map<number, ElementState>();
        swapStates.set(writeIndex, 'swapping');
        swapStates.set(i, 'swapping');

        yield {
          description: `交换 nums[${writeIndex}] 和 nums[${i}]`,
          data: {
            elements: [...arr],
            elementStates: swapStates,
            pointers: [
              { name: 'write', index: writeIndex },
              { name: 'i', index: i },
            ],
          },
        };
      }
      writeIndex++;
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < arr.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！最终数组: [${arr.join(', ')}]`,
    data: {
      elements: [...arr],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeMoveZeroes(nums: number[]): AnimationSnapshot[] {
  return generatorToSnapshots(moveZeroesGenerator(nums));
}

export function getMoveZeroesDefaultInput(): number[] {
  return [0, 1, 0, 3, 12];
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/moveZeroes.ts`
- `grep -q "executeMoveZeroes" src/lib/visualization/executors/moveZeroes.ts` returns 0
- `grep -q "moveZeroesGenerator" src/lib/visualization/executors/moveZeroes.ts` returns 0

---

#### Task 4.4: Create Container With Most Water executor

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/utils.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/containerWithWater.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

function* containerWithWaterGenerator(
  height: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  // Initial state
  yield {
    description: `开始计算容器最大盛水量，初始高度: [${height.join(', ')}]`,
    data: {
      elements: [...height],
      elementStates: createNormalStates(height.length),
      pointers: [
        { name: 'left', index: left },
        { name: 'right', index: right },
      ],
    },
  };

  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);

    // Show comparison
    const states = new Map<number, ElementState>();
    states.set(left, 'comparing');
    states.set(right, 'comparing');

    yield {
      description: `计算面积: min(${height[left]}, ${height[right]}) × (${right} - ${left}) = ${currentArea}，当前最大: ${maxArea}`,
      data: {
        elements: [...height],
        elementStates: states,
        pointers: [
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    if (currentArea > maxArea) {
      maxArea = currentArea;
    }

    // Move pointer
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < height.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！最大盛水量为 ${maxArea}`,
    data: {
      elements: [...height],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeContainerWithWater(height: number[]): AnimationSnapshot[] {
  return generatorToSnapshots(containerWithWaterGenerator(height));
}

export function getContainerWithWaterDefaultInput(): number[] {
  return [1, 8, 6, 2, 5, 4, 8, 3, 7];
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/containerWithWater.ts`
- `grep -q "executeContainerWithWater" src/lib/visualization/executors/containerWithWater.ts` returns 0
- `grep -q "containerWithWaterGenerator" src/lib/visualization/executors/containerWithWater.ts` returns 0

---

#### Task 4.5: Create 3Sum executor

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/utils.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/threeSum.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

function* threeSumGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const arr = [...nums].sort((a, b) => a - b);
  const results: number[][] = [];

  // Initial state
  yield {
    description: `开始查找三数之和为 0 的组合，排序后数组: [${arr.join(', ')}]`,
    data: {
      elements: [...arr],
      elementStates: createNormalStates(arr.length),
      pointers: [],
    },
  };

  for (let i = 0; i < arr.length - 2; i++) {
    // Skip duplicates
    if (i > 0 && arr[i] === arr[i - 1]) continue;

    let left = i + 1;
    let right = arr.length - 1;

    // Show i pointer
    const iStates = new Map<number, ElementState>();
    iStates.set(i, 'comparing');

    yield {
      description: `固定第一个数 nums[${i}] = ${arr[i]}`,
      data: {
        elements: [...arr],
        elementStates: iStates,
        pointers: [
          { name: 'i', index: i },
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    while (left < right) {
      const sum = arr[i] + arr[left] + arr[right];

      // Show current comparison
      const states = new Map<number, ElementState>();
      states.set(i, 'sorted');
      states.set(left, 'comparing');
      states.set(right, 'comparing');

      yield {
        description: `计算: ${arr[i]} + ${arr[left]} + ${arr[right]} = ${sum}`,
        data: {
          elements: [...arr],
          elementStates: states,
          pointers: [
            { name: 'i', index: i },
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };

      if (sum === 0) {
        results.push([arr[i], arr[left], arr[right]]);

        // Found result
        const foundStates = new Map<number, ElementState>();
        foundStates.set(i, 'sorted');
        foundStates.set(left, 'sorted');
        foundStates.set(right, 'sorted');

        yield {
          description: `找到组合: [${arr[i]}, ${arr[left]}, ${arr[right]}]`,
          data: {
            elements: [...arr],
            elementStates: foundStates,
            pointers: [
              { name: 'i', index: i },
              { name: 'left', index: left },
              { name: 'right', index: right },
            ],
          },
        };

        // Skip duplicates
        while (left < right && arr[left] === arr[left + 1]) left++;
        while (left < right && arr[right] === arr[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let j = 0; j < arr.length; j++) {
    finalStates.set(j, 'normal');
  }

  yield {
    description: `完成！共找到 ${results.length} 个组合: ${JSON.stringify(results)}`,
    data: {
      elements: [...arr],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeThreeSum(nums: number[]): AnimationSnapshot[] {
  return generatorToSnapshots(threeSumGenerator(nums));
}

export function getThreeSumDefaultInput(): number[] {
  return [-1, 0, 1, 2, -1, -4];
}
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/threeSum.ts`
- `grep -q "executeThreeSum" src/lib/visualization/executors/threeSum.ts` returns 0
- `grep -q "threeSumGenerator" src/lib/visualization/executors/threeSum.ts` returns 0

---

#### Task 4.6: Create executors index file

**read_first:**
- None needed

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/index.ts`:

```typescript
// Executor functions
export { executeTwoSum, getTwoSumDefaultInput } from './twoSum';
export { executeMoveZeroes, getMoveZeroesDefaultInput } from './moveZeroes';
export { executeContainerWithWater, getContainerWithWaterDefaultInput } from './containerWithWater';
export { executeThreeSum, getThreeSumDefaultInput } from './threeSum';

// Utilities
export { createSnapshot, generatorToSnapshots, createNormalStates } from './utils';
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/executors/index.ts`
- `grep -q "executeTwoSum" src/lib/visualization/executors/index.ts` returns 0
- `grep -q "executeMoveZeroes" src/lib/visualization/executors/index.ts` returns 0

---

#### Task 4.7: Create visualization lib index file

**read_first:**
- None needed

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/index.ts`:

```typescript
export * from './types';
export * from './executors';
```

**acceptance_criteria:**
- File exists at `src/lib/visualization/index.ts`
- `grep -q "types" src/lib/visualization/index.ts` returns 0

---

### Wave 5: Page Integration

#### Task 5.1: Create VisualizationSection component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/AlgorithmPlayer.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/index.ts`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/VisualizationSection.tsx`:

```typescript
'use client';

import { useMemo } from 'react';
import { AlgorithmPlayer } from '@/components/visualization';
import {
  executeTwoSum,
  executeMoveZeroes,
  executeContainerWithWater,
  executeThreeSum,
  getTwoSumDefaultInput,
  getMoveZeroesDefaultInput,
  getContainerWithWaterDefaultInput,
  getThreeSumDefaultInput,
  AnimationSnapshot,
} from '@/lib/visualization';

interface VisualizationSectionProps {
  problemId: string;
}

// Map problem IDs to their executor functions
const executorMap: Record<string, () => AnimationSnapshot[]> = {
  '0001': () => executeTwoSum(getTwoSumDefaultInput()),
  '0283': () => executeMoveZeroes(getMoveZeroesDefaultInput()),
  '0011': () => executeContainerWithWater(getContainerWithWaterDefaultInput()),
  '0015': () => executeThreeSum(getThreeSumDefaultInput()),
};

// Problem IDs that support visualization
const supportedProblemIds = new Set(Object.keys(executorMap));

export function isVisualizationSupported(problemId: string): boolean {
  return supportedProblemIds.has(problemId);
}

export function VisualizationSection({ problemId }: VisualizationSectionProps) {
  const snapshots = useMemo(() => {
    const executor = executorMap[problemId];
    return executor ? executor() : [];
  }, [problemId]);

  if (snapshots.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        该题目暂无动画演示
      </div>
    );
  }

  return <AlgorithmPlayer snapshots={snapshots} />;
}
```

**acceptance_criteria:**
- File exists at `src/components/VisualizationSection.tsx`
- `grep -q "VisualizationSection" src/components/VisualizationSection.tsx` returns 0
- `grep -q "isVisualizationSupported" src/components/VisualizationSection.tsx` returns 0
- `grep -q "executorMap" src/components/VisualizationSection.tsx` returns 0

---

#### Task 5.2: Update problem detail page with visualization tab

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/page.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/ui/tabs.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/SolutionTabsClient.tsx`

**action:**
Create `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/ProblemPageClient.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Problem, Category } from '@/lib/data/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Language } from '@/hooks/useLanguagePreference';
import { ProblemDescription } from '@/components/ProblemDescription';
import { SolutionTabs } from '@/components/SolutionTabs';
import { VisualizationSection, isVisualizationSupported } from '@/components/VisualizationSection';

interface ProblemPageClientProps {
  problem: Problem;
  category: Category;
}

export function ProblemPageClient({ problem, category }: ProblemPageClientProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('go');
  const hasVisualization = isVisualizationSupported(problem.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="space-y-6">
        <ProblemDescription
          description={problem.description}
          lifeScenario={problem.lifeScenario}
        />
      </div>

      <div>
        {hasVisualization ? (
          <Tabs defaultValue="code" className="w-full">
            <TabsList>
              <TabsTrigger value="code">代码</TabsTrigger>
              <TabsTrigger value="visualization">动画演示</TabsTrigger>
            </TabsList>
            <TabsContent value="code">
              <SolutionTabs
                solutions={problem.solutions}
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </TabsContent>
            <TabsContent value="visualization">
              <VisualizationSection problemId={problem.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <SolutionTabs
            solutions={problem.solutions}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        )}
      </div>
    </div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/app/problems/[id]/ProblemPageClient.tsx`
- `grep -q "ProblemPageClient" src/app/problems/[id]/ProblemPageClient.tsx` returns 0
- `grep -q "isVisualizationSupported" src/app/problems/[id]/ProblemPageClient.tsx` returns 0

---

#### Task 5.3: Update problem page to use client component

**read_first:**
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/page.tsx`
- `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/ProblemPageClient.tsx`

**action:**
Modify `/Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/app/problems/[id]/page.tsx`:

```typescript
import { getProblemById, getCategoryById, getProblems } from '@/lib/data/loader';
import { ProblemHeader } from '@/components/ProblemHeader';
import { ProblemPageClient } from './ProblemPageClient';

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  const problems = getProblems();
  return problems.map((problem) => ({
    id: problem.id,
  }));
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);

  if (!problem) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">题目不存在</h1>
          <p className="text-muted-foreground">找不到该题目，请返回首页重新选择。</p>
        </div>
      </div>
    );
  }

  const category = getCategoryById(problem.categoryId);

  if (!category) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">分类不存在</h1>
          <p className="text-muted-foreground">找不到该题目所属分类。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <ProblemHeader problem={problem} category={category} />
      <ProblemPageClient problem={problem} category={category} />
    </div>
  );
}
```

**acceptance_criteria:**
- File exists at `src/app/problems/[id]/page.tsx`
- `grep -q "ProblemPageClient" src/app/problems/[id]/page.tsx` returns 0
- `grep -q "ProblemHeader" src/app/problems/[id]/page.tsx` returns 0

---

## Verification

### Build Verification

```bash
cd /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz && pnpm build
```

**Expected:** Build succeeds with no errors.

### Functional Verification

1. **Animation Player Hook:**
   - Navigate to `/problems/0001`
   - Click "动画演示" tab
   - Verify play/pause buttons work
   - Verify step forward/backward work
   - Verify speed control changes animation speed
   - Verify progress bar updates

2. **Array Visualization:**
   - Verify elements display with correct values
   - Verify state colors (normal, comparing, swapping, sorted)
   - Verify pointer arrows appear above elements
   - Verify animations are smooth

3. **Algorithm Executors:**
   - Test Two Sum (`/problems/0001`)
   - Test Move Zeroes (`/problems/0283`)
   - Test Container With Most Water (`/problems/0011`)
   - Test 3Sum (`/problems/0015`)

### File Structure Verification

```bash
# Check all files exist
ls -la /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/
ls -la /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/lib/visualization/executors/
ls -la /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/components/visualization/
ls -la /Users/chenchao/Workspace/claude/LeetCode-Solutions-Hot-100/leetcode-hot100-viz/src/hooks/
```

---

## Summary

| Wave | Tasks | Files Created | Files Modified |
|------|-------|---------------|----------------|
| 1 | Dependencies & Types | 2 | 1 |
| 2 | Core Hooks | 2 | 0 |
| 3 | Visualization Components | 6 | 0 |
| 4 | Algorithm Executors | 7 | 0 |
| 5 | Page Integration | 2 | 1 |
| **Total** | **19** | **19** | **2** |

---

*Plan created: 2026-05-03*
*Phase: 03-animation-engine-array-viz*
