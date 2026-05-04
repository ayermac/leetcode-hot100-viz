# Conventions

**Last Updated:** 2026-05-04

## Code Style

### TypeScript

- **Strict mode:** Enabled in `tsconfig.json`
- **No `any`:** Use explicit types or `unknown`
- **Interfaces vs Types:** Prefer `type` for object shapes, `interface` for extendable contracts

### React

- **Functional components only** - No class components
- **Named exports** for components
- **Props interfaces** defined inline or in same file

```typescript
// Component pattern
type Props = {
  problem: Problem
  onToggle: () => void
}

export function ProblemCard({ problem, onToggle }: Props) {
  // ...
}
```

### File Organization

- One component per file
- Colocate related files (types, utils)
- Index files for clean exports

```typescript
// visualization/index.ts
export { AlgorithmPlayer } from './AlgorithmPlayer'
export { ArrayVisualizer } from './ArrayVisualizer'
```

## Naming Conventions

### Components

- **PascalCase:** `RichProblemView`, `AlgorithmPlayer`
- **Descriptive:** Name reflects purpose
- **Prefix by domain:** `Array...`, `LinkedList...` for visualizers

### Hooks

- **camelCase with `use` prefix:** `useAnimationPlayer`
- **Descriptive verb:** `use...Filter`, `use...Player`

### Functions

- **camelCase:** `loadProblems`, `formatDate`
- **Verb first:** `get...`, `set...`, `handle...`, `create...`

### Variables

- **camelCase:** `problemList`, `currentIndex`
- **Booleans with prefix:** `isPlaying`, `hasCycle`, `canEdit`

### Constants

- **SCREAMING_SNAKE_CASE:** `DEFAULT_SPEED`, `MAX_STEPS`

## Patterns

### Algorithm Executor Pattern

```typescript
// Generator-based visualization
export function* algorithmExecutor(
  input: AlgorithmInput
): Generator<AnimationSnapshot> {
  // Yield state at each step
  yield { type: 'step', data: currentState }
}

// Registration
export const twoSumExecutor = {
  id: 'two-sum',
  execute: twoSumExecutorFn,
  defaultInput: { nums: [2, 7, 11, 15], target: 9 }
}
```

### Hook Pattern

```typescript
// State + persistence pattern
export function usePreference<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue] as const
}
```

### Component Pattern

```typescript
// Props type, destructure, hooks, handlers, render
type Props = {
  // ...
}

export function Component({ prop1, prop2 }: Props) {
  // Hooks
  const [state, setState] = useState()
  
  // Handlers
  const handleClick = () => { }
  
  // Render
  return (
    <div>...</div>
  )
}
```

## Error Handling

### No try-catch in components

- Let errors bubble to error boundaries
- Handle at appropriate level

### Error Boundary

```typescript
// app/error.tsx (not implemented yet)
'use client'

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return <ErrorDisplay error={error} onRetry={reset} />
}
```

### Async Operations

- Show loading state
- Handle null/undefined states
- Graceful degradation

## Styling

### Tailwind Utilities

```typescript
// Conditional classes with clsx/tailwind-merge
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}>
```

### CSS Variables

```css
/* Theme colors as CSS variables */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
```

## State Management

### Local State

- Use `useState` for component-local state
- Keep state as close to where it's used

### Lifted State

- Lift only when multiple components need it
- Use custom hooks to encapsulate state logic

### Persistent State

- LocalStorage for preferences
- URL for shareable state

## Comments

### When to Comment

- **Why, not what:** Explain reasoning, not obvious code
- **Complex logic:** Algorithm decisions
- **Non-obvious constraints:** Why this number, not that
- **TODOs:** With issue reference if possible

### When NOT to Comment

- Obvious code
- Type information (use TypeScript)
- Redundant explanations

## Import Order

```typescript
// 1. React/Next
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. External libraries
import { motion } from 'motion/react'

// 3. Internal components
import { Button } from '@/components/ui/button'

// 4. Internal hooks
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer'

// 5. Internal utilities
import { cn } from '@/lib/utils'

// 6. Types
import type { AnimationSnapshot } from '@/lib/visualization/types'
```
