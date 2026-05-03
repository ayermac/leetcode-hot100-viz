# Phase 3 Research: 动画引擎与数组可视化

**Gathered:** 2026-05-03
**Status:** Complete

---

## Executive Summary

This research covers the key technical knowledge needed to plan Phase 3 effectively. The phase focuses on building an animation state machine infrastructure and array visualizer for algorithm demonstrations.

**Key Findings:**
1. Framer Motion is NOT currently installed - must be added as a dependency
2. Existing codebase provides solid patterns: `useLanguagePreference` hook, `Tabs` component, `CodeViewer` component
3. Animation state machine should use `useReducer` with a clear action dispatch pattern
4. Full snapshot mode aligns well with step-by-step algorithm visualization

---

## 1. Framer Motion Animation Patterns for Array Visualizations

### 1.1 Installation Required

**Current Status:** Framer Motion is NOT in `package.json` dependencies.

**Action Required:**
```bash
pnpm add motion
```

Note: The library has moved from `framer-motion` to `motion` package (v12+). Based on STACK.md, we should use `motion` package.

### 1.2 Layout Animations for Element Swapping

Framer Motion's `layout` prop automatically animates position changes:

```tsx
import { motion } from 'motion/react'

// Array element that animates when position changes
function ArrayElement({ value, index }: { value: number; index: number }) {
  return (
    <motion.div
      layout
      key={index}
      className="array-element"
      transition={{ duration: 0.3 }}
    >
      {value}
    </motion.div>
  )
}
```

**Key Insight:** When array elements reorder (swap, move), the `layout` prop automatically:
- Tracks previous position
- Animates to new position
- Uses FLIP animation technique internally

### 1.3 Variants for State-Based Animation

Variants enable orchestrated parent-child animations with named states:

```tsx
const elementVariants = {
  normal: {
    scale: 1,
    backgroundColor: '#6b7280' // gray-500
  },
  comparing: {
    scale: 1.1,
    backgroundColor: '#3b82f6', // blue-500
    transition: { duration: 0.2 }
  },
  swapping: {
    scale: 1.2,
    backgroundColor: '#f97316', // orange-500
    transition: { duration: 0.15 }
  },
  sorted: {
    scale: 1,
    backgroundColor: '#22c55e', // green-500
    transition: { duration: 0.3 }
  }
}

function ArrayElement({ value, state }: { value: number; state: ElementState }) {
  return (
    <motion.div
      variants={elementVariants}
      initial="normal"
      animate={state}
    >
      {value}
    </motion.div>
  )
}
```

**Orchestration with staggerChildren:**

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
}

function ArrayContainer({ elements }: { elements: number[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {elements.map((el, i) => (
        <ArrayElement key={i} value={el} state="normal" />
      ))}
    </motion.div>
  )
}
```

### 1.4 AnimatePresence for Element Entry/Exit

For algorithms that add/remove elements:

```tsx
import { AnimatePresence, motion } from 'motion/react'

function DynamicArray({ elements }: { elements: number[] }) {
  return (
    <div className="flex gap-2">
      <AnimatePresence mode="popLayout">
        {elements.map((value, index) => (
          <motion.div
            key={`el-${index}`}
            layout
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

**Important Notes:**
- Always use stable, unique `key` props (not array indices when elements can reorder)
- `mode="popLayout"` allows entering elements to flow immediately while exiting elements animate out
- `AnimatePresence` must wrap the conditional rendering, not be inside it

### 1.5 layoutId for Shared Element Transitions

When the same conceptual element moves between containers:

```tsx
<motion.div layoutId={`element-${id}`}>
  {value}
</motion.div>
```

---

## 2. Animation State Machine Architecture Patterns

### 2.1 Core State Structure

Based on D-04 (full snapshot mode), each animation step is a complete state snapshot:

```typescript
type ElementState = 'normal' | 'comparing' | 'swapping' | 'sorted' | 'pivot'

interface Pointer {
  name: string        // "left", "right", "i", "j", "mid"
  index: number       // Position in array
}

interface ArraySnapshot {
  elements: number[]
  elementStates: Map<number, ElementState>
  pointers: Pointer[]
  highlightRange?: { start: number; end: number }
}

interface AnimationSnapshot {
  step: number
  description: string
  codeLine?: number        // For future code sync (Phase 4)
  data: ArraySnapshot
  metadata?: {
    action: 'compare' | 'swap' | 'move' | 'init' | 'complete'
    affectedIndices?: number[]
  }
}
```

### 2.2 Animation Player Hook Pattern

Use `useReducer` for complex state management:

```typescript
interface AnimationState {
  snapshots: AnimationSnapshot[]
  currentIndex: number
  isPlaying: boolean
  speed: number         // 0.5, 1, 2
}

type AnimationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'GO_TO'; payload: number }
  | { type: 'LOAD_SNAPSHOTS'; payload: AnimationSnapshot[] }

function animationReducer(state: AnimationState, action: AnimationAction): AnimationState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true }
    case 'PAUSE':
      return { ...state, isPlaying: false }
    case 'STEP_FORWARD':
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.snapshots.length - 1)
      }
    case 'STEP_BACKWARD':
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0)
      }
    case 'RESET':
      return { ...state, currentIndex: 0, isPlaying: false }
    case 'SET_SPEED':
      return { ...state, speed: action.payload }
    case 'GO_TO':
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.payload, state.snapshots.length - 1))
      }
    case 'LOAD_SNAPSHOTS':
      return {
        ...state,
        snapshots: action.payload,
        currentIndex: 0,
        isPlaying: false
      }
    default:
      return state
  }
}
```

### 2.3 Animation Player Hook Implementation

```typescript
function useAnimationPlayer(initialSpeed: number = 1) {
  const [state, dispatch] = useReducer(animationReducer, {
    snapshots: [],
    currentIndex: 0,
    isPlaying: false,
    speed: initialSpeed,
  })

  // Auto-play effect with speed control
  useEffect(() => {
    if (!state.isPlaying || state.snapshots.length === 0) return

    const baseInterval = 1000 // 1 second base
    const interval = baseInterval / state.speed

    const timer = setInterval(() => {
      dispatch({ type: 'STEP_FORWARD' })
    }, interval)

    return () => clearInterval(timer)
  }, [state.isPlaying, state.speed, state.snapshots.length])

  // Auto-pause at end
  useEffect(() => {
    if (state.isPlaying && state.currentIndex >= state.snapshots.length - 1) {
      dispatch({ type: 'PAUSE' })
    }
  }, [state.currentIndex, state.isPlaying, state.snapshots.length])

  const currentSnapshot = state.snapshots[state.currentIndex] ?? null
  const progress = state.snapshots.length > 0
    ? (state.currentIndex + 1) / state.snapshots.length
    : 0

  return {
    // State
    currentSnapshot,
    currentIndex: state.currentIndex,
    totalSteps: state.snapshots.length,
    isPlaying: state.isPlaying,
    speed: state.speed,
    progress,

    // Actions
    play: () => dispatch({ type: 'PLAY' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    stepForward: () => dispatch({ type: 'STEP_FORWARD' }),
    stepBackward: () => dispatch({ type: 'STEP_BACKWARD' }),
    reset: () => dispatch({ type: 'RESET' }),
    setSpeed: (speed: number) => dispatch({ type: 'SET_SPEED', payload: speed }),
    goTo: (index: number) => dispatch({ type: 'GO_TO', payload: index }),
    loadSnapshots: (snapshots: AnimationSnapshot[]) =>
      dispatch({ type: 'LOAD_SNAPSHOTS', payload: snapshots }),
  }
}
```

### 2.4 Playback Control UI Pattern

Based on existing `Button` and `Tabs` component patterns:

```tsx
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PlaybackControlsProps {
  isPlaying: boolean
  currentIndex: number
  totalSteps: number
  speed: number
  onPlay: () => void
  onPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  onSpeedChange: (speed: number) => void
  onSeek: (index: number) => void
}
```

---

## 3. Algorithm Executor Pattern for Generating Snapshots

### 3.1 Generator Pattern for Step-by-Step Execution

Using generator functions to yield snapshots at each step:

```typescript
type SnapshotYield = Omit<AnimationSnapshot, 'step'>

function* twoSumExecutor(nums: number[], target: number): Generator<SnapshotYield> {
  const hashTable = new Map<number, number>()

  yield {
    description: `开始在数组 [${nums.join(', ')}] 中查找两数之和为 ${target}`,
    data: {
      elements: [...nums],
      elementStates: new Map(nums.map((_, i) => [i, 'normal'] as const)),
      pointers: [],
    },
    metadata: { action: 'init' }
  }

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    yield {
      description: `检查 nums[${i}] = ${nums[i]}，寻找补数 ${complement}`,
      data: {
        elements: [...nums],
        elementStates: new Map([[i, 'comparing']]),
        pointers: [{ name: 'i', index: i }],
      },
      metadata: { action: 'compare', affectedIndices: [i] }
    }

    if (hashTable.has(complement)) {
      const foundIndex = hashTable.get(complement)!

      yield {
        description: `找到答案！nums[${foundIndex}] + nums[${i}] = ${nums[foundIndex]} + ${nums[i]} = ${target}`,
        data: {
          elements: [...nums],
          elementStates: new Map([
            [foundIndex, 'sorted'],
            [i, 'sorted'],
          ]),
          pointers: [
            { name: 'i', index: i },
            { name: 'found', index: foundIndex }
          ],
        },
        metadata: { action: 'complete', affectedIndices: [foundIndex, i] }
      }
      return
    }

    hashTable.set(nums[i], i)
  }
}

// Convert generator to snapshot array
function generateSnapshots(
  executor: Generator<SnapshotYield>
): AnimationSnapshot[] {
  const snapshots: AnimationSnapshot[] = []
  let step = 0

  for (const snapshot of executor) {
    snapshots.push({ ...snapshot, step: step++ })
  }

  return snapshots
}
```

### 3.2 Move Zeroes Executor Example

```typescript
function* moveZeroesExecutor(nums: number[]): Generator<SnapshotYield> {
  let writeIndex = 0

  yield {
    description: `开始移动零操作，初始数组: [${nums.join(', ')}]`,
    data: {
      elements: [...nums],
      elementStates: new Map(nums.map((_, i) => [i, 'normal'] as const)),
      pointers: [
        { name: 'write', index: writeIndex },
        { name: 'i', index: 0 }
      ],
    },
    metadata: { action: 'init' }
  }

  for (let i = 0; i < nums.length; i++) {
    yield {
      description: `检查 nums[${i}] = ${nums[i]}`,
      data: {
        elements: [...nums],
        elementStates: new Map([[i, 'comparing']]),
        pointers: [
          { name: 'write', index: writeIndex },
          { name: 'i', index: i }
        ],
      },
      metadata: { action: 'compare', affectedIndices: [i] }
    }

    if (nums[i] !== 0) {
      if (i !== writeIndex) {
        [nums[writeIndex], nums[i]] = [nums[i], nums[writeIndex]]

        yield {
          description: `交换 nums[${writeIndex}] 和 nums[${i}]`,
          data: {
            elements: [...nums],
            elementStates: new Map([
              [writeIndex, 'swapping'],
              [i, 'swapping']
            ]),
            pointers: [
              { name: 'write', index: writeIndex },
              { name: 'i', index: i }
            ],
          },
          metadata: { action: 'swap', affectedIndices: [writeIndex, i] }
        }
      }
      writeIndex++
    }
  }

  yield {
    description: `完成！最终数组: [${nums.join(', ')}]`,
    data: {
      elements: [...nums],
      elementStates: new Map(nums.map((_, i) => [i, 'sorted'] as const)),
      pointers: [],
    },
    metadata: { action: 'complete' }
  }
}
```

### 3.3 Container With Most Water Executor

```typescript
function* containerWithWaterExecutor(height: number[]): Generator<SnapshotYield> {
  let left = 0
  let right = height.length - 1
  let maxArea = 0

  yield {
    description: `开始计算容器最大盛水量，初始高度: [${height.join(', ')}]`,
    data: {
      elements: [...height],
      elementStates: new Map(height.map((_, i) => [i, 'normal'] as const)),
      pointers: [
        { name: 'left', index: left },
        { name: 'right', index: right }
      ],
    },
    metadata: { action: 'init' }
  }

  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left)

    yield {
      description: `计算: min(${height[left]}, ${height[right]}) x (${right} - ${left}) = ${currentArea}`,
      data: {
        elements: [...height],
        elementStates: new Map([
          [left, 'comparing'],
          [right, 'comparing']
        ]),
        pointers: [
          { name: 'left', index: left },
          { name: 'right', index: right }
        ],
        highlightRange: { start: left, end: right }
      },
      metadata: { action: 'compare', affectedIndices: [left, right] }
    }

    if (currentArea > maxArea) {
      maxArea = currentArea
    }

    if (height[left] < height[right]) {
      left++
    } else {
      right--
    }
  }

  yield {
    description: `完成！最大盛水量为 ${maxArea}`,
    data: {
      elements: [...height],
      elementStates: new Map(height.map((_, i) => [i, 'sorted'] as const)),
      pointers: [],
    },
    metadata: { action: 'complete' }
  }
}
```

---

## 4. Integration Points with Existing Codebase

### 4.1 Problem Detail Page Integration

Current structure in `src/app/problems/[id]/page.tsx`:

```tsx
// Current layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
  <div className="space-y-6">
    <ProblemDescription ... />
  </div>
  <div>
    <SolutionTabsClient solutions={problem.solutions} />
  </div>
</div>
```

**Integration approach (based on D-07):** Use tabs to switch between code and visualization:

```tsx
<Tabs defaultValue="code">
  <TabsList>
    <TabsTrigger value="code">代码</TabsTrigger>
    <TabsTrigger value="visualization">动画演示</TabsTrigger>
  </TabsList>
  <TabsContent value="code">
    <SolutionTabsClient ... />
  </TabsContent>
  <TabsContent value="visualization">
    <VisualizationSection problemId={problem.id} />
  </TabsContent>
</Tabs>
```

### 4.2 Reusable Hook Pattern

Follow the `useLanguagePreference` pattern for state persistence:

```typescript
// Similar pattern to useLanguagePreference.ts
'use client'

import { useState, useEffect } from 'react'

const SPEED_STORAGE_KEY = 'leetcode-viz-animation-speed'

export function useAnimationSpeed() {
  const [speed, setSpeedState] = useState<number>(1)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const stored = localStorage.getItem(SPEED_STORAGE_KEY)
    if (stored) {
      const parsed = parseFloat(stored)
      if ([0.5, 1, 2].includes(parsed)) {
        setSpeedState(parsed)
      }
    }
  }, [])

  const setSpeed = (newSpeed: number) => {
    setSpeedState(newSpeed)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SPEED_STORAGE_KEY, String(newSpeed))
    }
  }

  return { speed, setSpeed, isHydrated }
}
```

### 4.3 Component Organization

```
src/
├── components/
│   ├── visualization/
│   │   ├── ArrayVisualizer.tsx      # Main array visualization component
│   │   ├── ArrayElement.tsx         # Single array element
│   │   ├── PointerArrow.tsx         # Pointer annotation
│   │   ├── PlaybackControls.tsx     # Play/pause/step controls
│   │   └── ProgressBar.tsx          # Seekable progress bar
│   └── ui/
│       └── slider.tsx               # Add slider component for progress
├── hooks/
│   ├── useAnimationPlayer.ts        # Core animation state machine
│   ├── useAnimationSpeed.ts         # Speed preference persistence
│   └── useLanguagePreference.ts     # Existing
├── lib/
│   ├── visualization/
│   │   ├── types.ts                 # AnimationSnapshot, ElementState, etc.
│   │   ├── executors/
│   │   │   ├── index.ts             # Export all executors
│   │   │   ├── twoSum.ts
│   │   │   ├── moveZeroes.ts
│   │   │   └── containerWithWater.ts
│   │   └── utils.ts                 # Helper functions
│   └── data/
│       └── types.ts                 # Existing
```

---

## 5. Potential Pitfalls and Solutions

### 5.1 Framer Motion Installation Issue

**Pitfall:** Framer Motion is not installed in the current project.

**Solution:** Add `motion` package (v12+) as dependency: `pnpm add motion`

### 5.2 Key Stability for Array Elements

**Pitfall:** Using array index as key causes animation issues when elements swap.

**Wrong:**
```tsx
{elements.map((el, index) => (
  <motion.div key={index}>{el}</motion.div>  // Bad!
))}
```

**Solution:** Use element value combined with original position or a unique ID:
```tsx
interface AnnotatedElement {
  id: string
  value: number
}
```

### 5.3 Animation State Desynchronization

**Pitfall:** Animation state can get out of sync with actual data when user rapidly clicks controls.

**Solution:** Always derive visual state from current snapshot, never from intermediate state:

```tsx
// Good: Always derive from snapshot
const currentState = snapshots[currentIndex]

// Bad: Storing intermediate visual state
const [visualState, setVisualState] = useState(...)
```

### 5.4 Hydration Mismatch with localStorage

**Pitfall:** Using `localStorage` before hydration causes SSR mismatch.

**Solution:** Follow `useLanguagePreference` pattern - use `isHydrated` flag:

```tsx
const { speed, isHydrated } = useAnimationSpeed()

if (!isHydrated) {
  return <Skeleton />
}
```

### 5.5 Memory Usage with Large Snapshots

**Pitfall:** Full snapshot mode can be memory-intensive for long-running algorithms.

**Solution:** For MVP, keep full snapshots - they are simpler and correct. Limit snapshot count for complex algorithms. Consider compression only if needed.

### 5.6 Animation Performance with Many Elements

**Pitfall:** Framer Motion can struggle with 50+ animated elements.

**Solution:**
1. Use `layout` prop sparingly - only on elements that move
2. Use CSS transforms (Framer Motion does this by default)
3. For large arrays (>30 elements), consider canvas-based visualization

**Recommendation:** For algorithm visualization, limit array size to 10-15 elements by default.

### 5.7 Auto-play Timer Drift

**Pitfall:** `setInterval` can drift when browser tab is inactive.

**Solution:** Use `requestAnimationFrame` for precise timing:

```tsx
useEffect(() => {
  if (!state.isPlaying) return

  let lastTime = performance.now()
  let animationId: number

  const animate = (currentTime: number) => {
    const delta = currentTime - lastTime
    const interval = 1000 / state.speed

    if (delta >= interval) {
      dispatch({ type: 'STEP_FORWARD' })
      lastTime = currentTime
    }

    if (state.currentIndex < state.snapshots.length - 1) {
      animationId = requestAnimationFrame(animate)
    }
  }

  animationId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(animationId)
}, [state.isPlaying, state.speed, state.currentIndex, state.snapshots.length])
```

### 5.8 Pointer Positioning Edge Cases

**Pitfall:** Pointers can overlap when multiple pointers point to same element.

**Solution:** Offset pointers vertically when grouped by index:

```tsx
function PointerArrow({ pointers, elementWidth }: Props) {
  const grouped = pointers.reduce((acc, p) => {
    acc[p.index] = acc[p.index] || []
    acc[p.index].push(p)
    return acc
  }, {} as Record<number, Pointer[]>)

  return (
    <>
      {Object.entries(grouped).map(([index, ptrs]) => (
        <div key={index} style={{ left: Number(index) * elementWidth }}>
          {ptrs.map((p, i) => (
            <div key={p.name} style={{ top: i * -20 }}>
              {p.name}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
```

---

## 6. Recommended Implementation Order

Based on ROADMAP.md P3-01 to P3-04:

1. **P3-01: Animation State Machine** (Day 1)
   - Define types in `lib/visualization/types.ts`
   - Implement `useAnimationPlayer` hook
   - Unit tests for state transitions

2. **P3-02: Playback Controls UI** (Day 1-2)
   - Create `PlaybackControls` component
   - Add `Slider` component for progress bar (from shadcn/ui)
   - Integrate with `useAnimationPlayer`

3. **P3-03: Array Visualizer** (Day 2-3)
   - Install `motion` package
   - Create `ArrayElement` with Framer Motion variants
   - Create `ArrayVisualizer` container
   - Implement `PointerArrow` component
   - Test with manual snapshots

4. **P3-04: Algorithm Executors** (Day 3-5)
   - Implement generator-based executor pattern
   - Create Two Sum executor
   - Create Move Zeroes executor
   - Create Container With Most Water executor
   - Integrate with problem detail page

---

## 7. Key Questions for Planning Phase

Before proceeding to PLAN.md, clarify:

1. **Default Input Values:** What default array values for each algorithm?
   - Two Sum: `[2, 7, 11, 15]`, target=9
   - Move Zeroes: `[0, 1, 0, 3, 12]`
   - Container With Water: `[1, 8, 6, 2, 5, 4, 8, 3, 7]`

2. **Array Element Styling:**
   - Size: `w-12 h-12` or `w-16 h-16`?
   - Gap: `gap-2` or `gap-4`?
   - Font size for values?

3. **Pointer Design:**
   - Color per pointer name?
   - Arrow style: simple text or SVG?
   - Label position: above or below arrow?

4. **Step Description Display:**
   - Position: below array or in separate panel?
   - Typography: mono or sans-serif?

5. **Mobile Responsiveness:**
   - Reduce element size on small screens?
   - Stack controls vertically?

---

*Research completed: 2026-05-03*
