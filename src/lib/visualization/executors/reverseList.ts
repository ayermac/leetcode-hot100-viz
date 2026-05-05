import { AnimationSnapshot, ElementState, Pointer, LinkedListSnapshot, createLinkedListFromValues, createNormalNodeStates } from '../types';
import { generatorToSnapshots } from './utils';
import { reverseListInputSchema, validateInput } from './validation';

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
    currIndex = nextIndex as number; // Safe because we check currIndex !== null in while condition
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

export function executeReverseList(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(reverseListInputSchema, input);
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
  return generatorToSnapshots(reverseListGenerator(validation.data.values));
}

export function getReverseListDefaultInput() {
  return { values: [1, 2, 3, 4, 5] };
}
