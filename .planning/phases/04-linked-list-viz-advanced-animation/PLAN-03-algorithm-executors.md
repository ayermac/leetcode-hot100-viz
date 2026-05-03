---
phase: "04"
plan: "03-algorithm-executors"
type: execute
wave: 2
depends_on: ["01-core-types"]
files_modified: []
files_created:
  - src/lib/visualization/executors/reverseList.ts
  - src/lib/visualization/executors/hasCycle.ts
  - src/lib/visualization/executors/mergeTwoLists.ts
  - src/lib/visualization/executors/removeNthFromEnd.ts
autonomous: true
requirements: [VIZ-02]
---

# Plan 03: Linked List Algorithm Executors

## Objective

Implement the algorithm executors for 4 linked list problems that generate animation snapshots. Each executor follows the generator pattern established in Phase 3, producing step-by-step visualizations with code line tracking.

## Tasks

### Task 1: Create reverseList executor (0206-反转链表)

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/twoSum.ts` — Reference for generator pattern (function* generator, yield objects with description/codeLine/data, generatorToSnapshots wrapper)
- `leetcode-hot100-viz/src/lib/visualization/executors/utils.ts` — For `generatorToSnapshots` helper function
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For `AnimationSnapshot`, `ElementState`, `Pointer`, `LinkedListSnapshot`, `createLinkedListFromValues`, `createNormalNodeStates`
</read_first>

<action>
Create file `leetcode-hot100-viz/src/lib/visualization/executors/reverseList.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer, LinkedListSnapshot, createLinkedListFromValues, createNormalNodeStates } from '../types';
import { generatorToSnapshots } from './utils';

interface ReverseListInput {
  values: number[];
}

function* reverseListGenerator(
  values: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const { nodes } = createLinkedListFromValues(values);
  
  // Initial state
  yield {
    description: `开始反转链表: ${values.join(' → ')}`,
    codeLine: 1,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  if (nodes.length === 0) {
    yield {
      description: '链表为空，无需反转',
      codeLine: 0,
      data: {
        nodes: [],
        nodeStates: new Map(),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  // Iterative reversal: prev = null, curr = head
  let prevIndex: number | null = null;
  let currIndex = 0;

  yield {
    description: '初始化: prev = null, curr = head',
    codeLine: 5,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [{ name: 'curr', index: 0 }],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  while (currIndex !== null && currIndex < nodes.length) {
    const nextIndex = nodes[currIndex].nextIndex;

    // Show current operation
    const states = new Map<number, ElementState>();
    states.set(currIndex, 'comparing');
    if (prevIndex !== null && prevIndex >= 0) {
      states.set(prevIndex, 'swapping');
    }

    const pointers: Pointer[] = [{ name: 'curr', index: currIndex }];
    if (prevIndex !== null && prevIndex >= 0) {
      pointers.push({ name: 'prev', index: prevIndex });
    }
    if (nextIndex !== null) {
      pointers.push({ name: 'next', index: nextIndex });
    }

    yield {
      description: `反转节点 ${nodes[currIndex].value}: next = curr.next, curr.next = prev`,
      codeLine: 8,
      data: {
        nodes: [...nodes],
        nodeStates: states,
        pointers,
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };

    // Perform reversal
    nodes[currIndex].nextIndex = prevIndex;
    prevIndex = currIndex;
    currIndex = nextIndex;
  }

  // Final state - all reversed
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < nodes.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: '反转完成！链表已反转',
    codeLine: 0,
    data: {
      nodes: [...nodes],
      nodeStates: finalStates,
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };
}

export function executeReverseList(input: ReverseListInput): AnimationSnapshot[] {
  return generatorToSnapshots(reverseListGenerator(input.values));
}

export function getReverseListDefaultInput(): ReverseListInput {
  return { values: [1, 2, 3, 4, 5] };
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/executors/reverseList.ts` exists
- Exports `executeReverseList(input: { values: number[] }): AnimationSnapshot[]`
- Exports `getReverseListDefaultInput(): { values: [1, 2, 3, 4, 5] }`
- Each snapshot has `codeLine: number` field (1-indexed, 0 for no highlight)
- Generator yields descriptive messages in Chinese for each step
- Uses `generatorToSnapshots` wrapper pattern
- TypeScript compilation passes
</acceptance_criteria>

### Task 2: Create hasCycle executor (0141-环形链表检测)

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/twoSum.ts` — Reference for generator pattern
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For `createLinkedListFromValues` which handles cycle detection via last value matching earlier value
</read_first>

<action>
Create file `leetcode-hot100-viz/src/lib/visualization/executors/hasCycle.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer, LinkedListSnapshot, createLinkedListFromValues, createNormalNodeStates } from '../types';
import { generatorToSnapshots } from './utils';

interface HasCycleInput {
  values: number[];  // Last value indicates cycle entry if matches earlier value per D-10
}

function* hasCycleGenerator(
  values: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const { nodes, cycleEntryIndex } = createLinkedListFromValues(values);
  const hasCycle = cycleEntryIndex !== null;

  // Initial state
  yield {
    description: `开始检测链表是否有环`,
    codeLine: 1,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [],
      cycleEntryIndex,
    } as LinkedListSnapshot,
  };

  if (nodes.length === 0) {
    yield {
      description: '链表为空，无环',
      codeLine: 0,
      data: {
        nodes: [],
        nodeStates: new Map(),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  // Fast and slow pointers start at head
  let slowIndex = 0;
  let fastIndex = 0;

  yield {
    description: '初始化快慢指针: slow = head, fast = head',
    codeLine: 5,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [
        { name: 'slow', index: 0 },
        { name: 'fast', index: 0 },
      ],
      cycleEntryIndex,
    } as LinkedListSnapshot,
  };

  let steps = 0;
  const maxSteps = nodes.length * 3;

  while (fastIndex !== null && steps < maxSteps) {
    // Move slow pointer one step
    const nextSlow = nodes[slowIndex]?.nextIndex;
    if (nextSlow === null) break;
    slowIndex = nextSlow;

    // Move fast pointer two steps
    const fastNext = nodes[fastIndex]?.nextIndex;
    if (fastNext === null) break;
    const fastNextNext = nodes[fastNext]?.nextIndex;
    fastIndex = fastNextNext ?? fastNext;

    steps++;

    // Show movement
    const states = new Map<number, ElementState>();
    states.set(slowIndex, 'comparing');
    if (fastIndex >= 0 && fastIndex < nodes.length) {
      states.set(fastIndex, 'swapping');
    }

    yield {
      description: `移动指针: slow → 节点 ${slowIndex}, fast → 节点 ${fastIndex}`,
      codeLine: 10,
      data: {
        nodes: [...nodes],
        nodeStates: states,
        pointers: [
          { name: 'slow', index: slowIndex },
          { name: 'fast', index: fastIndex },
        ],
        cycleEntryIndex,
      } as LinkedListSnapshot,
    };

    // Check if they meet
    if (slowIndex === fastIndex && hasCycle) {
      const meetStates = new Map<number, ElementState>();
      meetStates.set(slowIndex, 'sorted');

      yield {
        description: `快慢指针相遇！链表有环，入口在节点 ${cycleEntryIndex}`,
        codeLine: 14,
        data: {
          nodes: [...nodes],
          nodeStates: meetStates,
          pointers: [
            { name: 'slow', index: slowIndex },
            { name: 'fast', index: fastIndex },
          ],
          cycleEntryIndex,
        } as LinkedListSnapshot,
      };
      return;
    }
  }

  // No cycle found
  yield {
    description: '快指针到达链表末尾，链表无环',
    codeLine: 0,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };
}

export function executeHasCycle(input: HasCycleInput): AnimationSnapshot[] {
  return generatorToSnapshots(hasCycleGenerator(input.values));
}

export function getHasCycleDefaultInput(): HasCycleInput {
  return { values: [3, 2, 0, 4, 2] };  // Last 2 indicates cycle entry at node with value 2
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/executors/hasCycle.ts` exists
- Exports `executeHasCycle(input: { values: number[] }): AnimationSnapshot[]`
- Default input `{ values: [3, 2, 0, 4, 2] }` creates a cycle (per D-10)
- Fast/slow pointer movement is visualized with 'comparing' and 'swapping' states
- `cycleEntryIndex` is passed to snapshot for visualizer to render dashed arc
- TypeScript compilation passes
</acceptance_criteria>

### Task 3: Create mergeTwoLists executor (0021-合并两个有序链表)

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/twoSum.ts` — Reference for generator pattern
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For types
</read_first>

<action>
Create file `leetcode-hot100-viz/src/lib/visualization/executors/mergeTwoLists.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer, ListNodeRef, LinkedListSnapshot } from '../types';
import { generatorToSnapshots } from './utils';

interface MergeTwoListsInput {
  list1: number[];
  list2: number[];
}

function createNormalNodeStates(count: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < count; i++) {
    states.set(i, 'normal');
  }
  return states;
}

function* mergeTwoListsGenerator(
  list1: number[],
  list2: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const mergedNodes: ListNodeRef[] = [];
  
  // Initial state - show both lists side by side
  const initialNodes: ListNodeRef[] = [
    ...list1.map((v, i) => ({ value: v, nextIndex: i < list1.length - 1 ? i + 1 : null })),
    ...list2.map((v, i) => ({ value: v, nextIndex: list1.length + i < list1.length + list2.length - 1 ? list1.length + i + 1 : null })),
  ];

  yield {
    description: `开始合并两个有序链表: [${list1.join(', ')}] 和 [${list2.join(', ')}]`,
    codeLine: 1,
    data: {
      nodes: initialNodes,
      nodeStates: createNormalNodeStates(initialNodes.length),
      pointers: [
        { name: 'l1', index: 0 },
        { name: 'l2', index: list1.length },
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  let i = 0;
  let j = 0;

  while (i < list1.length && j < list2.length) {
    const val1 = list1[i];
    const val2 = list2[j];

    // Show comparison
    const states = new Map<number, ElementState>();
    states.set(i, 'comparing');
    states.set(list1.length + j, 'comparing');

    yield {
      description: `比较: l1.val(${val1}) vs l2.val(${val2})`,
      codeLine: 8,
      data: {
        nodes: initialNodes,
        nodeStates: states,
        pointers: [
          { name: 'l1', index: i },
          { name: 'l2', index: list1.length + j },
        ],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };

    // Add smaller value to merged list
    if (val1 <= val2) {
      mergedNodes.push({ value: val1, nextIndex: null });
      i++;
    } else {
      mergedNodes.push({ value: val2, nextIndex: null });
      j++;
    }

    // Update merged list links
    if (mergedNodes.length > 1) {
      mergedNodes[mergedNodes.length - 2].nextIndex = mergedNodes.length - 1;
    }
  }

  // Add remaining elements from list1
  while (i < list1.length) {
    mergedNodes.push({ value: list1[i], nextIndex: null });
    if (mergedNodes.length > 1) {
      mergedNodes[mergedNodes.length - 2].nextIndex = mergedNodes.length - 1;
    }
    i++;
  }

  // Add remaining elements from list2
  while (j < list2.length) {
    mergedNodes.push({ value: list2[j], nextIndex: null });
    if (mergedNodes.length > 1) {
      mergedNodes[mergedNodes.length - 2].nextIndex = mergedNodes.length - 1;
    }
    j++;
  }

  // Final merged list
  const finalStates = new Map<number, ElementState>();
  for (let k = 0; k < mergedNodes.length; k++) {
    finalStates.set(k, 'sorted');
  }

  yield {
    description: `合并完成！结果: [${mergedNodes.map(n => n.value).join(' → ')}]`,
    codeLine: 0,
    data: {
      nodes: mergedNodes,
      nodeStates: finalStates,
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };
}

export function executeMergeTwoLists(input: MergeTwoListsInput): AnimationSnapshot[] {
  return generatorToSnapshots(mergeTwoListsGenerator(input.list1, input.list2));
}

export function getMergeTwoListsDefaultInput(): MergeTwoListsInput {
  return {
    list1: [1, 2, 4],
    list2: [1, 3, 4],
  };
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/executors/mergeTwoLists.ts` exists
- Exports `executeMergeTwoLists(input: { list1: number[], list2: number[] }): AnimationSnapshot[]`
- Default input `{ list1: [1, 2, 4], list2: [1, 3, 4] }`
- Comparison steps show both lists' current elements with 'comparing' state
- Final merged list displays all nodes with 'sorted' state
- TypeScript compilation passes
</acceptance_criteria>

### Task 4: Create removeNthFromEnd executor (0019-删除链表的倒数第N个结点)

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/twoSum.ts` — Reference for generator pattern
- `leetcode-hot100-viz/src/lib/visualization/types.ts` — For types
</read_first>

<action>
Create file `leetcode-hot100-viz/src/lib/visualization/executors/removeNthFromEnd.ts`:

```typescript
import { AnimationSnapshot, ElementState, Pointer, ListNodeRef, LinkedListSnapshot } from '../types';
import { generatorToSnapshots } from './utils';

interface RemoveNthFromEndInput {
  values: number[];
  n: number;
}

function createNormalNodeStates(count: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < count; i++) {
    states.set(i, 'normal');
  }
  return states;
}

function* removeNthFromEndGenerator(
  values: number[],
  n: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const nodes: ListNodeRef[] = values.map((v, i) => ({
    value: v,
    nextIndex: i < values.length - 1 ? i + 1 : null,
  }));

  // Initial state
  yield {
    description: `开始删除链表的倒数第 ${n} 个节点`,
    codeLine: 1,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  if (nodes.length === 0) {
    yield {
      description: '链表为空，无法删除',
      codeLine: 0,
      data: {
        nodes: [],
        nodeStates: new Map(),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  // Two pointers: fast moves n+1 steps first, then both move until fast reaches end
  let fastIndex = 0;
  let slowIndex = 0;

  yield {
    description: '初始化快慢指针',
    codeLine: 6,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [
        { name: 'slow', index: 0 },
        { name: 'fast', index: 0 },
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  // Move fast n+1 steps ahead
  for (let step = 0; step <= n && fastIndex >= 0; step++) {
    if (nodes[fastIndex]?.nextIndex !== null && nodes[fastIndex]?.nextIndex !== undefined) {
      fastIndex = nodes[fastIndex].nextIndex!;
      
      const states = new Map<number, ElementState>();
      states.set(fastIndex, 'comparing');

      yield {
        description: `快指针移动到节点 ${fastIndex} (${nodes[fastIndex]?.value})`,
        codeLine: 10,
        data: {
          nodes: [...nodes],
          nodeStates: states,
          pointers: [
            { name: 'slow', index: slowIndex },
            { name: 'fast', index: fastIndex },
          ],
          cycleEntryIndex: null,
        } as LinkedListSnapshot,
      };
    } else {
      fastIndex = -1;
      break;
    }
  }

  // Move both pointers until fast reaches end
  while (fastIndex >= 0 && nodes[fastIndex]?.nextIndex !== null) {
    slowIndex = nodes[slowIndex].nextIndex ?? slowIndex;
    fastIndex = nodes[fastIndex].nextIndex ?? -1;

    if (fastIndex >= 0 && fastIndex < nodes.length) {
      const states = new Map<number, ElementState>();
      states.set(slowIndex, 'comparing');
      states.set(fastIndex, 'swapping');

      yield {
        description: `移动指针: slow → ${slowIndex}, fast → ${fastIndex}`,
        codeLine: 15,
        data: {
          nodes: [...nodes],
          nodeStates: states,
          pointers: [
            { name: 'slow', index: slowIndex },
            { name: 'fast', index: fastIndex },
          ],
          cycleEntryIndex: null,
        } as LinkedListSnapshot,
      };
    }
  }

  // Now slow.next is the node to delete
  const deleteIndex = nodes[slowIndex]?.nextIndex ?? -1;
  if (deleteIndex >= 0 && deleteIndex < nodes.length) {
    // Mark node to delete
    const deleteStates = new Map<number, ElementState>();
    deleteStates.set(deleteIndex, 'swapping');

    yield {
      description: `找到要删除的节点: 节点 ${deleteIndex} (${nodes[deleteIndex].value})`,
      codeLine: 18,
      data: {
        nodes: [...nodes],
        nodeStates: deleteStates,
        pointers: [
          { name: 'slow', index: slowIndex },
          { name: 'delete', index: deleteIndex },
        ],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };

    // Perform deletion (skip the node in the nodes array)
    const resultNodes = nodes.filter((_, idx) => idx !== deleteIndex);
    // Update nextIndex values after deletion
    resultNodes.forEach((node, idx) => {
      node.nextIndex = idx < resultNodes.length - 1 ? idx + 1 : null;
    });

    // Show result
    const finalStates = new Map<number, ElementState>();
    for (let k = 0; k < resultNodes.length; k++) {
      finalStates.set(k, 'sorted');
    }

    yield {
      description: `删除完成！节点已从链表中移除`,
      codeLine: 0,
      data: {
        nodes: resultNodes,
        nodeStates: finalStates,
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
  }
}

export function executeRemoveNthFromEnd(input: RemoveNthFromEndInput): AnimationSnapshot[] {
  return generatorToSnapshots(removeNthFromEndGenerator(input.values, input.n));
}

export function getRemoveNthFromEndDefaultInput(): RemoveNthFromEndInput {
  return {
    values: [1, 2, 3, 4, 5],
    n: 2,
  };
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/executors/removeNthFromEnd.ts` exists
- Exports `executeRemoveNthFromEnd(input: { values: number[], n: number }): AnimationSnapshot[]`
- Default input `{ values: [1, 2, 3, 4, 5], n: 2 }` removes the 4th node (value 4)
- Fast/slow pointer technique is visualized
- Deleted node is marked with 'swapping' state before removal
- TypeScript compilation passes
</acceptance_criteria>

### Task 5: Update executor exports

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/index.ts` — Current exports to extend
</read_first>

<action>
Add new executor exports to `index.ts`:

```typescript
export {
  executeReverseList,
  getReverseListDefaultInput,
} from './reverseList';

export {
  executeHasCycle,
  getHasCycleDefaultInput,
} from './hasCycle';

export {
  executeMergeTwoLists,
  getMergeTwoListsDefaultInput,
} from './mergeTwoLists';

export {
  executeRemoveNthFromEnd,
  getRemoveNthFromEndDefaultInput,
} from './removeNthFromEnd';
```
</action>

<acceptance_criteria>
- `index.ts` exports all 8 functions: `executeReverseList`, `getReverseListDefaultInput`, `executeHasCycle`, `getHasCycleDefaultInput`, `executeMergeTwoLists`, `getMergeTwoListsDefaultInput`, `executeRemoveNthFromEnd`, `getRemoveNthFromEndDefaultInput`
- All exports accessible from `@/lib/visualization`
</acceptance_criteria>

## Verification

1. Run `pnpm tsc --noEmit` in `leetcode-hot100-viz/` to verify TypeScript compilation
2. Test each executor generates valid snapshots:
   - `executeReverseList({ values: [1, 2, 3, 4, 5] })` should reverse to 5 → 4 → 3 → 2 → 1
   - `executeHasCycle({ values: [3, 2, 0, 4, 2] })` should detect cycle
   - `executeMergeTwoLists({ list1: [1, 2, 4], list2: [1, 3, 4] })` should merge to [1, 1, 2, 3, 4, 4]
   - `executeRemoveNthFromEnd({ values: [1, 2, 3, 4, 5], n: 2 })` should remove node with value 4

## Must Haves

- [ ] 4 algorithm executors created (reverseList, hasCycle, mergeTwoLists, removeNthFromEnd)
- [ ] Each executor uses generator pattern with `generatorToSnapshots` wrapper
- [ ] Each snapshot includes `codeLine: number` field for code sync
- [ ] Each snapshot includes `description: string` field with Chinese text
- [ ] Default input getters provided for each executor
- [ ] All executors exported from `@/lib/visualization`
