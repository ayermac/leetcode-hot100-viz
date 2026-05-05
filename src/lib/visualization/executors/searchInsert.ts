import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';
import { searchInsertInputSchema, validateInput } from './validation';

function* searchInsertGenerator(
  nums: number[],
  target: number
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const n = nums.length;

  // Initial state
  yield {
    description: `在有序数组 [${nums.join(', ')}] 中查找 ${target} 的插入位置`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(n),
      pointers: [],
    },
  };

  let left = 0;
  let right = n - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    // Show current search range
    const rangeStates = new Map<number, ElementState>();
    for (let i = left; i <= right; i++) {
      rangeStates.set(i, 'comparing');
    }
    rangeStates.set(mid, 'swapping');

    yield {
      description: `搜索范围 [${left}, ${right}]，中点 mid = ${mid}，nums[mid] = ${nums[mid]}`,
      codeLine: 4,
      data: {
        elements: [...nums],
        elementStates: rangeStates,
        pointers: [
          { name: 'left', index: left },
          { name: 'mid', index: mid },
          { name: 'right', index: right },
        ],
      },
    };

    if (nums[mid] === target) {
      const foundStates = new Map<number, ElementState>();
      foundStates.set(mid, 'sorted');
      yield {
        description: `找到目标！${target} 已存在于位置 ${mid}`,
        codeLine: 6,
        data: {
          elements: [...nums],
          elementStates: foundStates,
          pointers: [{ name: 'found', index: mid }],
        },
      };
      return;
    } else if (nums[mid] < target) {
      yield {
        description: `nums[${mid}] = ${nums[mid]} < ${target}，目标在右侧`,
        codeLine: 8,
        data: {
          elements: [...nums],
          elementStates: rangeStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'mid', index: mid },
            { name: 'right', index: right },
          ],
        },
      };
      left = mid + 1;
    } else {
      yield {
        description: `nums[${mid}] = ${nums[mid]} > ${target}，目标在左侧`,
        codeLine: 10,
        data: {
          elements: [...nums],
          elementStates: rangeStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'mid', index: mid },
            { name: 'right', index: right },
          ],
        },
      };
      right = mid - 1;
    }
  }

  // Insert position is left
  const insertStates = new Map<number, ElementState>();
  if (left < n) {
    insertStates.set(left, 'sorted');
  }
  yield {
    description: `未找到 ${target}，应插入到位置 ${left}`,
    codeLine: 13,
    data: {
      elements: [...nums],
      elementStates: insertStates,
      pointers: [{ name: 'insert', index: left >= n ? n - 1 : left }],
    },
  };
}

export function executeSearchInsert(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(searchInsertInputSchema, input);
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
  const { nums, target } = validation.data;
  return generatorToSnapshots(searchInsertGenerator(nums, target));
}

export function getSearchInsertDefaultInput() {
  return {
    nums: [1, 3, 5, 6],
    target: 5,
  };
}
