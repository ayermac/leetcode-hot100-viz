---
phase: "04"
plan: "01-core-types"
type: execute
wave: 1
depends_on: []
files_modified:
  - src/lib/visualization/types.ts
files_created: []
autonomous: true
requirements: [VIZ-02, VIZ-05]
---

# Plan 01: Core Types for Linked List Visualization

## Objective

Extend the existing visualization type system to support linked list data structures and code synchronization. This establishes the foundational types that all other Phase 4 components will depend on.

## Tasks

### Task 1: Add LinkedListSnapshot type to types.ts

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — Current type definitions to extend
</read_first>

<action>
Add the following types after the existing `ArraySnapshot` interface (around line 15):

```typescript
// Linked list node reference (index-based for simplicity)
export interface ListNodeRef {
  value: number;
  nextIndex: number | null;  // null means end of list
}

// Linked list snapshot for a single animation step
export interface LinkedListSnapshot {
  nodes: ListNodeRef[];
  nodeStates: Map<number, ElementState>;
  pointers: Pointer[];
  cycleEntryIndex: number | null;  // For cycle detection, null if no cycle
}
```

Then modify the `AnimationSnapshot` interface (around line 18-22) to add `codeLine` and change `data` type:

```typescript
// Complete animation snapshot
export interface AnimationSnapshot {
  step: number;
  description: string;
  codeLine: number;  // NEW: for code synchronization (1-indexed, 0 means no highlight)
  data: ArraySnapshot | LinkedListSnapshot;  // CHANGED: union type
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/types.ts` contains `ListNodeRef` interface with `value: number`, `nextIndex: number | null` fields
- File contains `LinkedListSnapshot` interface with `nodes: ListNodeRef[]`, `nodeStates: Map<number, ElementState>`, `pointers: Pointer[]`, `cycleEntryIndex: number | null` fields
- `AnimationSnapshot` interface has `codeLine: number` field
- `AnimationSnapshot.data` is typed as `ArraySnapshot | LinkedListSnapshot`
- TypeScript compilation passes with `pnpm tsc --noEmit`
</acceptance_criteria>

### Task 2: Add utility functions for linked list creation

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — Where to add helper functions (at end of file)
- `leetcode-hot100-viz/src/lib/visualization/executors/utils.ts` — Reference for existing utility patterns
</read_first>

<action>
Add the following helper functions at the end of `types.ts` (after the existing exports):

```typescript
// Helper to create a linked list from an array of values
// For cycle detection: if last value matches an earlier value, create a cycle
export function createLinkedListFromValues(
  values: number[]
): { nodes: ListNodeRef[]; cycleEntryIndex: number | null } {
  if (values.length === 0) {
    return { nodes: [], cycleEntryIndex: null };
  }

  const nodes: ListNodeRef[] = [];
  let cycleEntryIndex: number | null = null;

  // Check if last value matches any earlier value (cycle indicator per D-10)
  const lastValue = values[values.length - 1];
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === lastValue) {
      cycleEntryIndex = i;
      break;
    }
  }

  // Create nodes (exclude last value if it's a cycle indicator)
  const nodeCount = cycleEntryIndex !== null ? values.length - 1 : values.length;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      value: values[i],
      nextIndex: i === nodeCount - 1 ? null : i + 1,
    });
  }

  // If cycle exists, point last node to cycle entry
  if (cycleEntryIndex !== null && nodes.length > 0) {
    nodes[nodes.length - 1].nextIndex = cycleEntryIndex;
  }

  return { nodes, cycleEntryIndex };
}

// Helper to create normal states for all nodes
export function createNormalNodeStates(nodeCount: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < nodeCount; i++) {
    states.set(i, 'normal');
  }
  return states;
}
```
</action>

<acceptance_criteria>
- File `types.ts` contains `createLinkedListFromValues` function that takes `values: number[]` and returns `{ nodes: ListNodeRef[], cycleEntryIndex: number | null }`
- File contains `createNormalNodeStates` function that takes `nodeCount: number` and returns `Map<number, ElementState>`
- Both functions are exported from the module
- TypeScript compilation passes
</acceptance_criteria>

### Task 3: Update module exports

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/index.ts` — Current exports to extend
</read_first>

<action>
Add the new types and functions to the exports in `index.ts`. The file currently exports from `./types`. Verify these are included:

```typescript
export {
  // ... existing exports
  // Add new types
  ListNodeRef,
  LinkedListSnapshot,
  // Add new helper functions
  createLinkedListFromValues,
  createNormalNodeStates,
} from './types';
```
</action>

<acceptance_criteria>
- `index.ts` exports `ListNodeRef`, `LinkedListSnapshot`
- `index.ts` exports `createLinkedListFromValues`, `createNormalNodeStates`
- Running `pnpm tsc --noEmit` shows no import errors
</acceptance_criteria>

## Verification

1. Run `pnpm tsc --noEmit` in `leetcode-hot100-viz/` directory to verify TypeScript compilation
2. Verify new types are importable: `import { LinkedListSnapshot, ListNodeRef } from '@/lib/visualization'`
3. Verify `AnimationSnapshot` accepts both `ArraySnapshot` and `LinkedListSnapshot` in its `data` field

## Must Haves

- [ ] `LinkedListSnapshot` type defined with `nodes`, `nodeStates`, `pointers`, `cycleEntryIndex` fields
- [ ] `AnimationSnapshot.codeLine` field added for code sync
- [ ] `AnimationSnapshot.data` accepts union type for array and linked list
- [ ] Helper function `createLinkedListFromValues` handles cycle detection per D-10
- [ ] All types exported from module index
