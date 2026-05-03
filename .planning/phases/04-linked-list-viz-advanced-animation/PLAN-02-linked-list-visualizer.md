---
phase: "04"
plan: "02-linked-list-visualizer"
type: execute
wave: 1
depends_on: ["01-core-types"]
files_modified: []
files_created:
  - src/components/visualization/ListNode.tsx
  - src/components/visualization/LinkedListVisualizer.tsx
autonomous: true
requirements: [VIZ-02]
---

# Plan 02: Linked List Visualizer Components

## Objective

Create the visual components for rendering linked list data structures, following the established patterns from ArrayVisualizer. Implements horizontal layout with node boxes, pointer arrows, and cycle visualization.

## Tasks

### Task 1: Create ListNode component

<read_first>
- `leetcode-hot100-viz/src/components/visualization/ArrayElement.tsx` — Reference for element styling and animation patterns (stateColors mapping, motion.div usage)
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For `ElementState` type ('normal' | 'comparing' | 'swapping' | 'sorted')
</read_first>

<action>
Create file `leetcode-hot100-viz/src/components/visualization/ListNode.tsx` with the following content:

```tsx
'use client';

import { motion } from 'motion/react';
import { ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface ListNodeProps {
  value: number;
  index: number;
  state: ElementState;
  hasNext: boolean;  // Whether this node has a next pointer
  isCycleEntry?: boolean;  // Whether this is the entry point of a cycle
}

const stateColors: Record<ElementState, string> = {
  normal: 'bg-card border-border',
  comparing: 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400',
  swapping: 'bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400',
  sorted: 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900 dark:border-emerald-400',
};

const NODE_WIDTH = 80;
const NODE_HEIGHT = 48;

export function ListNode({ value, index, state, hasNext, isCycleEntry }: ListNodeProps) {
  const bgClass = stateColors[state] || stateColors.normal;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-center border-2 rounded-lg overflow-hidden relative',
        bgClass,
        isCycleEntry && 'ring-2 ring-purple-400 ring-offset-2'
      )}
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      {/* Value section (left half) per D-03 */}
      <div className="flex-1 flex items-center justify-center border-r border-inherit">
        <span className="font-mono font-bold text-lg">{value}</span>
      </div>

      {/* Pointer section (right half) per D-03 */}
      <div className="flex-1 flex items-center justify-center">
        {hasNext ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">NULL</span>
        )}
      </div>

      {/* Index label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">
        [{index}]
      </div>
    </motion.div>
  );
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/visualization/ListNode.tsx` exists
- Component has props interface with `value`, `index`, `state`, `hasNext`, `isCycleEntry` fields
- Component renders two sections: value (left) and pointer (right) per D-03
- `stateColors` maps all 4 states: normal, comparing, swapping, sorted
- Component shows arrow icon when `hasNext=true`, "NULL" when `hasNext=false`
- Component displays index in format `[n]` below the node
- Uses `motion.div` with layout, initial, animate, exit props from Framer Motion
- TypeScript compilation passes
</acceptance_criteria>

### Task 2: Create LinkedListVisualizer component

<read_first>
- `leetcode-hot100-viz/src/components/visualization/ArrayVisualizer.tsx` — Reference for visualizer structure (Element width/gap constants, pointersByIndex grouping, motion.div layout)
- `leetcode-hot100-viz/src/components/visualization/PointerArrow.tsx` — Reuse for pointer annotations (check signature: takes `pointer`, `elementWidth`, `offset` props)
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For `LinkedListSnapshot` type
</read_first>

<action>
Create file `leetcode-hot100-viz/src/components/visualization/LinkedListVisualizer.tsx`:

```tsx
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { LinkedListSnapshot, ElementState } from '@/lib/visualization/types';
import { ListNode } from './ListNode';
import { PointerArrow } from './PointerArrow';
import { cn } from '@/lib/utils';

interface LinkedListVisualizerProps {
  snapshot: LinkedListSnapshot | null;
  className?: string;
}

const NODE_WIDTH = 80;
const NODE_GAP = 32;

export function LinkedListVisualizer({ snapshot, className }: LinkedListVisualizerProps) {
  if (!snapshot) {
    return (
      <div className={cn('flex items-center justify-center h-32', className)}>
        <p className="text-muted-foreground">点击"播放"开始动画演示</p>
      </div>
    );
  }

  const { nodes, nodeStates, pointers, cycleEntryIndex } = snapshot;

  // Group pointers by index for offset calculation (same pattern as ArrayVisualizer)
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

  const hasCycle = cycleEntryIndex !== null;
  const totalWidth = nodes.length * (NODE_WIDTH + NODE_GAP);

  return (
    <div className={cn('py-10 px-4', className)}>
      {/* Pointers above nodes per D-04 */}
      <div className="relative h-10">
        {pointers.map((pointer, idx) => {
          const offset = pointersByIndex[pointer.index]?.indexOf(pointer) || 0;
          return (
            <PointerArrow
              key={`${pointer.name}-${pointer.index}`}
              pointer={pointer}
              elementWidth={NODE_WIDTH + NODE_GAP}
              offset={offset}
            />
          );
        })}
      </div>

      {/* Nodes in horizontal layout per D-01 */}
      <motion.div layout className="flex gap-8 justify-center relative">
        <AnimatePresence mode="popLayout">
          {nodes.map((node, index) => {
            const state: ElementState = nodeStates.get(index) || 'normal';
            const hasNext = node.nextIndex !== null;
            const isCycleEntry = hasCycle && index === cycleEntryIndex;

            return (
              <ListNode
                key={`node-${index}`}
                value={node.value}
                index={index}
                state={state}
                hasNext={hasNext}
                isCycleEntry={isCycleEntry}
              />
            );
          })}
        </AnimatePresence>

        {/* Cycle back arrow (dashed arc) per D-02 */}
        {hasCycle && nodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
            style={{ width: totalWidth }}
          >
            <svg
              width="100%"
              height="50"
              className="overflow-visible"
              viewBox={`0 0 ${totalWidth} 50`}
            >
              {/* Dashed arc from last node back to cycle entry */}
              <path
                d={`M ${(nodes.length - 0.5) * (NODE_WIDTH + NODE_GAP)} 0 
                    Q ${(nodes.length - 0.5) * (NODE_WIDTH + NODE_GAP)} 50 
                      ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP)} 0`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                className="text-purple-500"
              />
              {/* Arrowhead at cycle entry */}
              <polygon
                points={`${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP) - 5},5 
                         ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP) + 5},5 
                         ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP)},15`}
                className="fill-purple-500"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/visualization/LinkedListVisualizer.tsx` exists
- Component accepts `snapshot: LinkedListSnapshot | null` and `className?: string` props
- Renders nodes horizontally from left to right per D-01
- Reuses `PointerArrow` component for pointer annotations above nodes per D-04
- When `cycleEntryIndex !== null`, renders dashed arc arrow from last node to cycle entry per D-02
- Shows "点击'播放'开始动画演示" when snapshot is null
- Uses `motion.div` with layout prop and `AnimatePresence` for animations
- TypeScript compilation passes
</acceptance_criteria>

### Task 3: Update visualization exports

<read_first>
- `leetcode-hot100-viz/src/components/visualization/index.ts` — Current exports to extend
</read_first>

<action>
Add new component exports to `index.ts`:

```typescript
export { ListNode } from './ListNode';
export { LinkedListVisualizer } from './LinkedListVisualizer';
```
</action>

<acceptance_criteria>
- `index.ts` contains `export { ListNode } from './ListNode';`
- `index.ts` contains `export { LinkedListVisualizer } from './LinkedListVisualizer';`
- Components are importable via `import { ListNode, LinkedListVisualizer } from '@/components/visualization'`
</acceptance_criteria>

## Verification

1. Run `pnpm tsc --noEmit` in `leetcode-hot100-viz/` to verify TypeScript compilation
2. Verify components are importable from `@/components/visualization`
3. Visual test: Render `LinkedListVisualizer` with a sample snapshot containing 4 nodes

## Must Haves

- [ ] `ListNode` component with value + pointer section design per D-03
- [ ] `LinkedListVisualizer` with horizontal layout per D-01
- [ ] Pointer arrows rendered above nodes reusing `PointerArrow` per D-04
- [ ] Cycle visualization with dashed arc arrow per D-02
- [ ] Framer Motion animations for layout changes
- [ ] All 4 element states (normal, comparing, swapping, sorted) supported with correct colors
