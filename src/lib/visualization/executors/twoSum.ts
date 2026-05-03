import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

interface TwoSumInput {
  nums: number[];
  target: number;
}

function* twoSumGenerator(
  nums: number[],
  target: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const hashTable = new Map<number, number>();

  // Initial state
  yield {
    description: `开始在数组 [${nums.join(', ')}] 中查找两数之和为 ${target}`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    },
  };

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // Show current element being checked
    const states = new Map<number, ElementState>();
    states.set(i, 'comparing');
    const pointers: Pointer[] = [{ name: 'i', index: i }];

    yield {
      description: `检查 nums[${i}] = ${nums[i]}，寻找补数 ${complement}`,
      codeLine: 5,
      data: {
        elements: [...nums],
        elementStates: states,
        pointers,
      },
    };

    if (hashTable.has(complement)) {
      const foundIndex = hashTable.get(complement)!;

      // Found result
      const foundStates = new Map<number, ElementState>();
      foundStates.set(foundIndex, 'sorted');
      foundStates.set(i, 'sorted');

      yield {
        description: `找到答案！nums[${foundIndex}] + nums[${i}] = ${nums[foundIndex]} + ${nums[i]} = ${target}`,
        codeLine: 8,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [
            { name: 'i', index: i },
            { name: 'found', index: foundIndex },
          ],
        },
      };
      return;
    }

    // Store in hash table
    hashTable.set(nums[i], i);
  }

  // No solution found
  yield {
    description: `未找到符合条件的两个数`,
    codeLine: 0,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    },
  };
}

export function executeTwoSum(input: TwoSumInput): AnimationSnapshot[] {
  return generatorToSnapshots(twoSumGenerator(input.nums, input.target));
}

export function getTwoSumDefaultInput(): TwoSumInput {
  return {
    nums: [2, 7, 11, 15],
    target: 9,
  };
}
