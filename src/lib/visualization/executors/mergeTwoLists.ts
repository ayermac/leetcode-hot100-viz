import { AnimationSnapshot, ElementState, LinkedListSnapshot } from '../types';
import { generatorToSnapshots } from './utils';
import { mergeTwoListsInputSchema, validateInput } from './validation';

interface VirtualNode {
  value: number;
  originalList: 1 | 2;
  originalIndex: number;
  nextIndex: number | null;
}

function* mergeTwoListsGenerator(
  list1: number[],
  list2: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  // Create virtual nodes from both lists for visualization
  const virtualNodes: VirtualNode[] = [];

  // Add list1 nodes
  for (let i = 0; i < list1.length; i++) {
    virtualNodes.push({
      value: list1[i],
      originalList: 1,
      originalIndex: i,
      nextIndex: i < list1.length - 1 ? i + 1 : null,
    });
  }

  // Add list2 nodes
  const list1Len = list1.length;
  for (let i = 0; i < list2.length; i++) {
    virtualNodes.push({
      value: list2[i],
      originalList: 2,
      originalIndex: i,
      nextIndex: i < list2.length - 1 ? list1Len + i + 1 : null,
    });
  }

  // Initial state
  yield {
    description: `开始合并两个有序链表: List1 [${list1.join(', ')}] 和 List2 [${list2.join(', ')}]`,
    codeLine: 1,
    data: {
      nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
      nodeStates: createNormalNodeStates(virtualNodes.length),
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  if (list1.length === 0 && list2.length === 0) {
    yield {
      description: '两个链表都为空，返回空链表',
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

  if (list1.length === 0) {
    yield {
      description: 'List1 为空，直接返回 List2',
      codeLine: 3,
      data: {
        nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
        nodeStates: createNormalNodeStates(virtualNodes.length),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  if (list2.length === 0) {
    yield {
      description: 'List2 为空，直接返回 List1',
      codeLine: 4,
      data: {
        nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
        nodeStates: createNormalNodeStates(virtualNodes.length),
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
    return;
  }

  // Pointers for both lists
  let p1 = 0; // Pointer to current node in list1
  let p2 = list1Len; // Pointer to current node in list2
  let mergedHead: number | null = null;
  let mergedTail: number | null = null;

  yield {
    description: '初始化指针: p1 指向 List1 头节点, p2 指向 List2 头节点',
    codeLine: 5,
    data: {
      nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
      nodeStates: createNormalNodeStates(virtualNodes.length),
      pointers: [
        { name: 'p1', index: p1 },
        { name: 'p2', index: p2 },
      ],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };

  // Merge loop
  while (p1 < list1Len && p2 < virtualNodes.length) {
    const val1 = virtualNodes[p1].value;
    const val2 = virtualNodes[p2].value;

    // Show comparison
    const compareStates = new Map<number, ElementState>();
    compareStates.set(p1, 'comparing');
    compareStates.set(p2, 'comparing');

    yield {
      description: `比较节点值: List1[${p1}]=${val1} vs List2[${p2 - list1Len}]=${val2}`,
      codeLine: 8,
      data: {
        nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
        nodeStates: compareStates,
        pointers: [
          { name: 'p1', index: p1 },
          { name: 'p2', index: p2 },
        ],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };

    let selectedNode: number;
    if (val1 <= val2) {
      selectedNode = p1;
      p1++;
    } else {
      selectedNode = p2;
      p2++;
    }

    // Add to merged list
    if (mergedHead === null) {
      mergedHead = selectedNode;
      mergedTail = selectedNode;
    } else if (mergedTail !== null) {
      virtualNodes[mergedTail].nextIndex = selectedNode;
      mergedTail = selectedNode;
    }

    // Show selected node
    const selectStates = new Map<number, ElementState>();
    selectStates.set(selectedNode, 'swapping');

    yield {
      description: `选择节点 ${selectedNode} (值=${virtualNodes[selectedNode].value}) 加入合并链表`,
      codeLine: 10,
      data: {
        nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
        nodeStates: selectStates,
        pointers: [
          { name: 'p1', index: Math.min(p1, list1Len - 1) },
          { name: 'p2', index: Math.min(p2, virtualNodes.length - 1) },
        ],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
  }

  // Append remaining nodes
  const remainingPointer = p1 < list1Len ? p1 : p2;
  if (mergedTail !== null && remainingPointer < virtualNodes.length) {
    virtualNodes[mergedTail].nextIndex = remainingPointer;

    const remainStates = new Map<number, ElementState>();
    remainStates.set(mergedTail, 'sorted');
    remainStates.set(remainingPointer, 'swapping');

    yield {
      description: `将剩余节点直接连接到合并链表末尾`,
      codeLine: 15,
      data: {
        nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
        nodeStates: remainStates,
        pointers: [],
        cycleEntryIndex: null,
      } as LinkedListSnapshot,
    };
  }

  // Final state - mark all as sorted
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < virtualNodes.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: '合并完成！两个有序链表已合并为一个有序链表',
    codeLine: 0,
    data: {
      nodes: virtualNodes.map(n => ({ value: n.value, nextIndex: n.nextIndex })),
      nodeStates: finalStates,
      pointers: [],
      cycleEntryIndex: null,
    } as LinkedListSnapshot,
  };
}

function createNormalNodeStates(count: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < count; i++) {
    states.set(i, 'normal');
  }
  return states;
}

export function executeMergeTwoLists(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(mergeTwoListsInputSchema, input);
  if (!validation.success) {
    return [{
      step: 0,
      description: `输入验证失败: ${validation.error}`,
      codeLine: 0,
      data: {
        nodes: [],
        nodeStates: new Map(),
        pointers: [],
        cycleEntryIndex: null,
      },
    }];
  }
  const { list1, list2 } = validation.data;
  return generatorToSnapshots(mergeTwoListsGenerator(list1, list2));
}

export function getMergeTwoListsDefaultInput() {
  return {
    list1: [1, 2, 4],
    list2: [1, 3, 4],
  };
}
