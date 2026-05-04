import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

interface MaxSubArrayInput {
  nums: number[];
}

function* maxSubArrayGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const n = nums.length;

  // Initial state
  yield {
    description: `开始查找数组 [${nums.join(', ')}] 的最大子数组和`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(n),
      pointers: [],
    },
  };

  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  let maxStart = 0;
  let maxEnd = 0;
  let currentStart = 0;

  // Show first element initialization
  const initStates = new Map<number, ElementState>();
  initStates.set(0, 'comparing');
  yield {
    description: `初始化：maxSoFar = maxEndingHere = ${nums[0]}`,
    codeLine: 2,
    data: {
      elements: [...nums],
      elementStates: initStates,
      pointers: [{ name: 'start', index: 0 }],
    },
  };

  for (let i = 1; i < n; i++) {
    // Show current element
    const currentStates = new Map<number, ElementState>();
    currentStates.set(i, 'comparing');

    yield {
      description: `考虑元素 nums[${i}] = ${nums[i]}`,
      codeLine: 5,
      data: {
        elements: [...nums],
        elementStates: currentStates,
        pointers: [{ name: 'i', index: i }],
      },
    };

    // Decide whether to extend or start new subarray
    const prevSum = maxEndingHere + nums[i];

    if (prevSum < nums[i]) {
      // Start new subarray
      maxEndingHere = nums[i];
      currentStart = i;

      const newStartStates = new Map<number, ElementState>();
      newStartStates.set(i, 'swapping');

      yield {
        description: `重新开始！${prevSum} < ${nums[i]}，从位置 ${i} 开始新子数组`,
        codeLine: 7,
        data: {
          elements: [...nums],
          elementStates: newStartStates,
          pointers: [
            { name: 'i', index: i },
            { name: 'start', index: currentStart },
          ],
        },
      };
    } else {
      // Extend existing subarray
      maxEndingHere = prevSum;

      const extendStates = new Map<number, ElementState>();
      for (let j = currentStart; j <= i; j++) {
        extendStates.set(j, 'comparing');
      }

      yield {
        description: `扩展子数组：maxEndingHere = ${maxEndingHere}`,
        codeLine: 9,
        data: {
          elements: [...nums],
          elementStates: extendStates,
          pointers: [
            { name: 'i', index: i },
            { name: 'start', index: currentStart },
          ],
        },
      };
    }

    // Update maxSoFar if needed
    if (maxEndingHere > maxSoFar) {
      maxSoFar = maxEndingHere;
      maxStart = currentStart;
      maxEnd = i;

      const newMaxStates = new Map<number, ElementState>();
      for (let j = maxStart; j <= maxEnd; j++) {
        newMaxStates.set(j, 'sorted');
      }

      yield {
        description: `发现新的最大值！maxSoFar = ${maxSoFar} (子数组 [${maxStart}..${maxEnd}])`,
        codeLine: 12,
        data: {
          elements: [...nums],
          elementStates: newMaxStates,
          pointers: [
            { name: 'start', index: maxStart },
            { name: 'end', index: maxEnd },
          ],
        },
      };
    }
  }

  // Final result
  const finalStates = new Map<number, ElementState>();
  for (let i = maxStart; i <= maxEnd; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `最终结果：最大子数组和为 ${maxSoFar} (从 ${maxStart} 到 ${maxEnd})`,
    codeLine: 15,
    data: {
      elements: [...nums],
      elementStates: finalStates,
      pointers: [
        { name: 'start', index: maxStart },
        { name: 'end', index: maxEnd },
      ],
    },
  };
}

export function executeMaxSubArray(input: MaxSubArrayInput): AnimationSnapshot[] {
  return generatorToSnapshots(maxSubArrayGenerator(input.nums));
}

export function getMaxSubArrayDefaultInput(): MaxSubArrayInput {
  return {
    nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  };
}
