import { AnimationSnapshot, ElementState, LinkedListSnapshot, createLinkedListFromValues, createNormalNodeStates } from '../types';
import { generatorToSnapshots } from './utils';

interface RemoveNthFromEndInput {
  values: number[];
  n: number;  // Remove the nth node from the end (1-indexed)
}

function* removeNthFromEndGenerator(
  values: number[],
  n: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const { nodes } = createLinkedListFromValues(values);

  // Initial state
  yield {
    description: `开始删除链表倒数第 ${n} 个节点`,
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
      description: '链表为空，无需删除',
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

  if (n <= 0 || n > nodes.length) {
    yield {
      description: `无效的 n 值: ${n}，链表长度为 ${nodes.length}`,
      codeLine: 0,
      data: {
        nodes: [...nodes],
        nodeStates: createNormalNodeStates(nodes.length),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  // Use dummy node technique
  // fast and slow pointers, fast moves n steps first
  let fastIndex = 0;
  let slowIndex = -1; // -1 represents dummy node (before head)

  yield {
    description: '使用快慢指针技巧: 快指针先走 n 步',
    codeLine: 5,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [
        { name: 'fast', index: fastIndex },
        { name: 'slow', index: 0 }, // Show slow at head initially
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  // Move fast n steps ahead
  for (let i = 0; i < n; i++) {
    const nextFast = nodes[fastIndex]?.nextIndex;
    if (nextFast !== null) {
      fastIndex = nextFast;

      const moveStates = new Map<number, ElementState>();
      moveStates.set(fastIndex, 'comparing');

      yield {
        description: `快指针前进: fast → 节点 ${fastIndex}`,
        codeLine: 6,
        data: {
          nodes: [...nodes],
          nodeStates: moveStates,
          pointers: [
            { name: 'fast', index: fastIndex },
            { name: 'slow', index: 0 },
          ],
          cycleEntryIndex: null,
        } as LinkedListSnapshot,
      };
    }
  }

  // Now move both pointers until fast reaches the end
  slowIndex = 0; // slow starts at head
  let prevSlowIndex = -1; // Track the node before slow (for deletion)

  yield {
    description: '快慢指针同时前进，直到快指针到达末尾',
    codeLine: 8,
    data: {
      nodes: [...nodes],
      nodeStates: createNormalNodeStates(nodes.length),
      pointers: [
        { name: 'fast', index: fastIndex },
        { name: 'slow', index: slowIndex },
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  while (nodes[fastIndex]?.nextIndex !== null) {
    fastIndex = nodes[fastIndex].nextIndex!;
    prevSlowIndex = slowIndex;
    slowIndex = nodes[slowIndex].nextIndex!;

    const moveStates = new Map<number, ElementState>();
    moveStates.set(fastIndex, 'comparing');
    moveStates.set(slowIndex, 'swapping');

    yield {
      description: `移动指针: fast → 节点 ${fastIndex}, slow → 节点 ${slowIndex}`,
      codeLine: 9,
      data: {
        nodes: [...nodes],
        nodeStates: moveStates,
        pointers: [
          { name: 'fast', index: fastIndex },
          { name: 'slow', index: slowIndex },
        ],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
  }

  // slow is now at the nth node from end
  // Need to remove slow by updating prevSlow's next pointer
  const deleteStates = new Map<number, ElementState>();
  deleteStates.set(slowIndex, 'swapping');

  yield {
    description: `找到目标节点 ${slowIndex} (值=${nodes[slowIndex].value})，准备删除`,
    codeLine: 12,
    data: {
      nodes: [...nodes],
      nodeStates: deleteStates,
      pointers: [
        { name: 'fast', index: fastIndex },
        { name: 'slow', index: slowIndex },
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  // Perform deletion
  const removedNodeNext = nodes[slowIndex].nextIndex;

  if (prevSlowIndex === -1) {
    // Removing head node - update all nodes' indices
    // For visualization, we mark the head as removed
    const finalStates = new Map<number, ElementState>();
    finalStates.set(0, 'swapping');
    for (let i = 1; i < nodes.length; i++) {
      finalStates.set(i, 'sorted');
    }

    // Create new nodes array without the removed node
    const newNodes = nodes.slice(1).map((node, idx) => ({
      value: node.value,
      nextIndex: node.nextIndex !== null ? idx + 1 : null,
    }));

    yield {
      description: `删除头节点 ${slowIndex}，新头节点为节点 0`,
      codeLine: 14,
      data: {
        nodes: newNodes.length > 0 ? newNodes : [],
        nodeStates: newNodes.length > 0 ? createNormalNodeStates(newNodes.length) : new Map(),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
  } else {
    // Update previous node's next pointer
    nodes[prevSlowIndex].nextIndex = removedNodeNext;

    const finalStates = new Map<number, ElementState>();
    for (let i = 0; i < nodes.length; i++) {
      if (i === slowIndex) {
        finalStates.set(i, 'swapping'); // Mark as removed
      } else {
        finalStates.set(i, 'sorted');
      }
    }

    // Create new nodes array without the removed node
    const newNodes: typeof nodes = [];
    for (let i = 0; i < nodes.length; i++) {
      if (i === slowIndex) continue;
      const node = nodes[i];
      let newNextIndex = node.nextIndex;
      if (newNextIndex !== null && newNextIndex > slowIndex) {
        newNextIndex--;
      } else if (newNextIndex === slowIndex) {
        newNextIndex = removedNodeNext !== null && removedNodeNext > slowIndex ? removedNodeNext - 1 : removedNodeNext;
      }
      newNodes.push({
        value: node.value,
        nextIndex: newNextIndex,
      });
    }

    yield {
      description: `删除节点 ${slowIndex}，完成删除操作`,
      codeLine: 15,
      data: {
        nodes: newNodes,
        nodeStates: createNormalNodeStates(newNodes.length),
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
