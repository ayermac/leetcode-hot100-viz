import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

interface FindMinInput {
  nums: number[];
}

function* findMinGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const n = nums.length;

  // Initial state
  yield {
    description: `开始在旋转数组 [${nums.join(', ')}] 中寻找最小值`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(n),
      pointers: [],
    },
  };

  // Check if array is not rotated
  if (nums[0] < nums[n - 1]) {
    const states = new Map<number, ElementState>();
    states.set(0, 'sorted');
    yield {
      description: `数组未旋转，最小值是 nums[0] = ${nums[0]}`,
      codeLine: 10,
      data: {
        elements: [...nums],
        elementStates: states,
        pointers: [{ name: 'min', index: 0 }],
      },
    };
    return;
  }

  let left = 0;
  let right = n - 1;

  while (left <= right) {
    // Show current search range
    const rangeStates = new Map<number, ElementState>();
    for (let i = left; i <= right; i++) {
      rangeStates.set(i, 'comparing');
    }

    const pointers: Pointer[] = [
      { name: 'left', index: left },
      { name: 'right', index: right },
    ];

    yield {
      description: `搜索范围 [${left}, ${right}]`,
      codeLine: 14,
      data: {
        elements: [...nums],
        elementStates: rangeStates,
        pointers,
      },
    };

    if (left === right) {
      const foundStates = new Map<number, ElementState>();
      foundStates.set(left, 'sorted');
      yield {
        description: `找到最小值！nums[${left}] = ${nums[left]}`,
        codeLine: 17,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [{ name: 'min', index: left }],
        },
      };
      return;
    }

    const mid = Math.floor(left + (right - left) / 2);

    // Show mid calculation
    const midStates = new Map<number, ElementState>();
    midStates.set(mid, 'swapping');
    const midPointers: Pointer[] = [
      { name: 'left', index: left },
      { name: 'mid', index: mid },
      { name: 'right', index: right },
    ];

    yield {
      description: `中点 mid = ${mid}，nums[mid] = ${nums[mid]}`,
      codeLine: 23,
      data: {
        elements: [...nums],
        elementStates: midStates,
        pointers: midPointers,
      },
    };

    // Check if found the pivot point
    if (nums[mid] > nums[mid + 1]) {
      const foundStates = new Map<number, ElementState>();
      foundStates.set(mid + 1, 'sorted');
      yield {
        description: `找到旋转点！nums[${mid}] > nums[${mid + 1}]，最小值是 nums[${mid + 1}] = ${nums[mid + 1]}`,
        codeLine: 26,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [{ name: 'min', index: mid + 1 }],
        },
      };
      return;
    }

    if (mid > 0 && nums[mid - 1] > nums[mid]) {
      const foundStates = new Map<number, ElementState>();
      foundStates.set(mid, 'sorted');
      yield {
        description: `找到最小值！nums[${mid - 1}] > nums[${mid}]，最小值是 nums[${mid}] = ${nums[mid]}`,
        codeLine: 31,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [{ name: 'min', index: mid }],
        },
      };
      return;
    }

    // Determine search direction
    if (nums[mid] > nums[0]) {
      yield {
        description: `nums[${mid}] = ${nums[mid]} > nums[0] = ${nums[0]}，最小值在右侧`,
        codeLine: 36,
        data: {
          elements: [...nums],
          elementStates: midStates,
          pointers: midPointers,
        },
      };
      left = mid + 1;
    } else {
      yield {
        description: `nums[${mid}] = ${nums[mid]} <= nums[0] = ${nums[0]}，最小值在左侧`,
        codeLine: 39,
        data: {
          elements: [...nums],
          elementStates: midStates,
          pointers: midPointers,
        },
      };
      right = mid - 1;
    }
  }

  // Default return
  const defaultStates = new Map<number, ElementState>();
  defaultStates.set(0, 'sorted');
  yield {
    description: `返回 nums[0] = ${nums[0]}`,
    codeLine: 44,
    data: {
      elements: [...nums],
      elementStates: defaultStates,
      pointers: [{ name: 'min', index: 0 }],
    },
  };
}

export function executeFindMin(input: FindMinInput): AnimationSnapshot[] {
  return generatorToSnapshots(findMinGenerator(input.nums));
}

export function getFindMinDefaultInput(): FindMinInput {
  return {
    nums: [4, 5, 6, 7, 0, 1, 2],
  };
}
