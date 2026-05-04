import { AnimationSnapshot, ElementState, ArraySnapshot } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

// Find Kth Largest Element (LeetCode 215)
interface FindKthLargestInput {
  nums: number[];
  k: number;
}

function* findKthLargestGenerator(
  nums: number[],
  k: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  // Build max heap visualization using array
  const heap = [...nums];
  const n = heap.length;

  // Initial state
  yield {
    description: `开始查找第 ${k} 大元素，输入: [${nums.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...heap],
      elementStates: createNormalStates(n),
      pointers: [],
    } as ArraySnapshot,
  };

  // Heapify function
  function* heapify(size: number, i: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Show current node being compared
    const compareStates = new Map<number, ElementState>();
    compareStates.set(i, 'comparing');
    if (left < size) compareStates.set(left, 'highlighted');
    if (right < size) compareStates.set(right, 'highlighted');

    yield {
      description: `堆化: 比较节点 ${i} (值=${heap[i]}) 与子节点`,
      codeLine: 10,
      data: {
        elements: [...heap],
        elementStates: compareStates,
        pointers: [{ name: 'i', index: i }],
      } as ArraySnapshot,
    };

    if (left < size && heap[left] > heap[largest]) {
      largest = left;
    }
    if (right < size && heap[right] > heap[largest]) {
      largest = right;
    }

    if (largest !== i) {
      // Swap
      [heap[i], heap[largest]] = [heap[largest], heap[i]];

      const swapStates = new Map<number, ElementState>();
      swapStates.set(i, 'swapping');
      swapStates.set(largest, 'swapping');

      yield {
        description: `交换 ${heap[largest]} 和 ${heap[i]}`,
        codeLine: 15,
        data: {
          elements: [...heap],
          elementStates: swapStates,
          pointers: [{ name: 'i', index: i }, { name: 'largest', index: largest }],
        } as ArraySnapshot,
      };

      yield* heapify(size, largest);
    }
  }

  // Build max heap
  yield {
    description: `构建最大堆`,
    codeLine: 5,
    data: {
      elements: [...heap],
      elementStates: createNormalStates(n),
      pointers: [],
    } as ArraySnapshot,
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  yield {
    description: `最大堆构建完成: [${heap.join(', ')}]`,
    codeLine: 8,
    data: {
      elements: [...heap],
      elementStates: createNormalStates(n),
      pointers: [],
    } as ArraySnapshot,
  };

  // Extract max k times
  for (let i = n - 1; i >= n - k; i--) {
    // Swap root with last element
    [heap[0], heap[i]] = [heap[i], heap[0]];

    const extractStates = new Map<number, ElementState>();
    extractStates.set(0, 'swapping');
    extractStates.set(i, 'sorted');

    yield {
      description: `提取最大值 ${heap[i]}，剩余堆大小 ${i}`,
      codeLine: 20,
      data: {
        elements: [...heap],
        elementStates: extractStates,
        pointers: [],
      } as ArraySnapshot,
    };

    // Mark extracted as sorted
    for (let j = i; j < n; j++) {
      extractStates.set(j, 'sorted');
    }

    yield* heapify(i, 0);
  }

  const result = heap[n - k];

  // Final state
  const finalStates = new Map<number, ElementState>();
  for (let i = n - k; i < n; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！第 ${k} 大元素是 ${result}`,
    codeLine: 0,
    data: {
      elements: [...heap],
      elementStates: finalStates,
      pointers: [],
    } as ArraySnapshot,
  };
}

export function executeFindKthLargest(input: FindKthLargestInput): AnimationSnapshot[] {
  return generatorToSnapshots(findKthLargestGenerator([...input.nums], input.k));
}

export function getFindKthLargestDefaultInput(): FindKthLargestInput {
  return { nums: [3, 2, 1, 5, 6, 4], k: 2 };
}

// Top K Frequent Elements (LeetCode 347)
interface TopKFrequentInput {
  nums: number[];
  k: number;
}

function* topKFrequentGenerator(
  nums: number[],
  k: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  // Count frequencies
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Initial state
  yield {
    description: `开始查找前 ${k} 个高频元素，输入: [${nums.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    } as ArraySnapshot,
  };

  // Show frequency map
  const freqEntries = Array.from(freqMap.entries());
  const freqElements = freqEntries.map(([_, count]) => count);

  yield {
    description: `频率统计: ${freqEntries.map(([n, c]) => `${n}:${c}`).join(', ')}`,
    codeLine: 5,
    data: {
      elements: freqElements,
      elementStates: createNormalStates(freqElements.length),
      pointers: [],
    } as ArraySnapshot,
  };

  // Use min heap of size k
  const minHeap: [number, number][] = []; // [num, frequency]

  function* heapifyUp(index: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (minHeap[parent][1] <= minHeap[index][1]) break;

      // Swap
      [minHeap[parent], minHeap[index]] = [minHeap[index], minHeap[parent]];

      const heapStates = new Map<number, ElementState>();
      minHeap.forEach((_, i) => heapStates.set(i, 'highlighted'));
      heapStates.set(parent, 'swapping');
      heapStates.set(index, 'swapping');

      yield {
        description: `堆化上浮: 交换位置 ${parent} 和 ${index}`,
        codeLine: 12,
        data: {
          elements: minHeap.map(([_, f]) => f),
          elementStates: heapStates,
          pointers: [],
        } as ArraySnapshot,
      };

      index = parent;
    }
  }

  function* heapifyDown(index: number, size: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < size && minHeap[left][1] < minHeap[smallest][1]) {
        smallest = left;
      }
      if (right < size && minHeap[right][1] < minHeap[smallest][1]) {
        smallest = right;
      }

      if (smallest === index) break;

      [minHeap[smallest], minHeap[index]] = [minHeap[index], minHeap[smallest]];

      const heapStates = new Map<number, ElementState>();
      minHeap.forEach((_, i) => heapStates.set(i, 'highlighted'));
      heapStates.set(smallest, 'swapping');
      heapStates.set(index, 'swapping');

      yield {
        description: `堆化下沉: 交换位置 ${index} 和 ${smallest}`,
        codeLine: 18,
        data: {
          elements: minHeap.map(([_, f]) => f),
          elementStates: heapStates,
          pointers: [],
        } as ArraySnapshot,
      };

      index = smallest;
    }
  }

  // Build min heap of size k
  for (const [num, freq] of freqMap) {
    if (minHeap.length < k) {
      minHeap.push([num, freq]);

      const addStates = new Map<number, ElementState>();
      minHeap.forEach((_, i) => addStates.set(i, 'comparing'));

      yield {
        description: `添加元素 ${num} (频率 ${freq}) 到堆`,
        codeLine: 8,
        data: {
          elements: minHeap.map(([_, f]) => f),
          elementStates: addStates,
          pointers: [],
        } as ArraySnapshot,
      };

      yield* heapifyUp(minHeap.length - 1);
    } else if (freq > minHeap[0][1]) {
      // Replace root
      const oldNum = minHeap[0][0];
      const oldFreq = minHeap[0][1];
      minHeap[0] = [num, freq];

      const replaceStates = new Map<number, ElementState>();
      replaceStates.set(0, 'swapping');

      yield {
        description: `替换堆顶: ${oldNum}(${oldFreq}) → ${num}(${freq})`,
        codeLine: 15,
        data: {
          elements: minHeap.map(([_, f]) => f),
          elementStates: replaceStates,
          pointers: [],
        } as ArraySnapshot,
      };

      yield* heapifyDown(0, minHeap.length);
    }
  }

  // Extract result
  const result = minHeap.map(([num]) => num).sort((a, b) => (freqMap.get(b) || 0) - (freqMap.get(a) || 0));

  // Final state
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < minHeap.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！前 ${k} 个高频元素: [${result.join(', ')}]`,
    codeLine: 0,
    data: {
      elements: minHeap.map(([_, f]) => f),
      elementStates: finalStates,
      pointers: [],
    } as ArraySnapshot,
  };
}

export function executeTopKFrequent(input: TopKFrequentInput): AnimationSnapshot[] {
  return generatorToSnapshots(topKFrequentGenerator([...input.nums], input.k));
}

export function getTopKFrequentDefaultInput(): TopKFrequentInput {
  return { nums: [1, 1, 1, 2, 2, 3], k: 2 };
}
