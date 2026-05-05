import { AnimationSnapshot, ElementState } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';
import { threeSumInputSchema, validateInput } from './validation';

function* threeSumGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const arr = [...nums].sort((a, b) => a - b);
  const results: number[][] = [];

  // Initial state
  yield {
    description: `开始查找三数之和为 0 的组合，排序后数组: [${arr.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...arr],
      elementStates: createNormalStates(arr.length),
      pointers: [],
    },
  };

  for (let i = 0; i < arr.length - 2; i++) {
    // Skip duplicates
    if (i > 0 && arr[i] === arr[i - 1]) continue;

    let left = i + 1;
    let right = arr.length - 1;

    // Show i pointer
    const iStates = new Map<number, ElementState>();
    iStates.set(i, 'comparing');

    yield {
      description: `固定第一个数 nums[${i}] = ${arr[i]}`,
      codeLine: 8,
      data: {
        elements: [...arr],
        elementStates: iStates,
        pointers: [
          { name: 'i', index: i },
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    while (left < right) {
      const sum = arr[i] + arr[left] + arr[right];

      // Show current comparison
      const states = new Map<number, ElementState>();
      states.set(i, 'sorted');
      states.set(left, 'comparing');
      states.set(right, 'comparing');

      yield {
        description: `计算: ${arr[i]} + ${arr[left]} + ${arr[right]} = ${sum}`,
        codeLine: 12,
        data: {
          elements: [...arr],
          elementStates: states,
          pointers: [
            { name: 'i', index: i },
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };

      if (sum === 0) {
        results.push([arr[i], arr[left], arr[right]]);

        // Found result
        const foundStates = new Map<number, ElementState>();
        foundStates.set(i, 'sorted');
        foundStates.set(left, 'sorted');
        foundStates.set(right, 'sorted');

        yield {
          description: `找到组合: [${arr[i]}, ${arr[left]}, ${arr[right]}]`,
          codeLine: 15,
          data: {
            elements: [...arr],
            elementStates: foundStates,
            pointers: [
              { name: 'i', index: i },
              { name: 'left', index: left },
              { name: 'right', index: right },
            ],
          },
        };

        // Skip duplicates
        while (left < right && arr[left] === arr[left + 1]) left++;
        while (left < right && arr[right] === arr[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let j = 0; j < arr.length; j++) {
    finalStates.set(j, 'normal');
  }

  yield {
    description: `完成！共找到 ${results.length} 个组合: ${JSON.stringify(results)}`,
    codeLine: 0,
    data: {
      elements: [...arr],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeThreeSum(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(threeSumInputSchema, input);
  if (!validation.success) {
    return [{
      step: 0,
      description: `输入验证失败: ${validation.error}`,
      codeLine: 0,
      data: {
        elements: [],
        elementStates: new Map(),
        pointers: [],
      },
    }];
  }
  return generatorToSnapshots(threeSumGenerator(validation.data.nums));
}

export function getThreeSumDefaultInput(): { nums: number[] } {
  return { nums: [-1, 0, 1, 2, -1, -4] };
}
