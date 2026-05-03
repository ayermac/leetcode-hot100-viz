import { AnimationSnapshot, ElementState, LinkedListSnapshot, createLinkedListFromValues, createNormalNodeStates } from '../types';
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
