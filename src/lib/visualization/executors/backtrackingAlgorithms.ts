import { AnimationSnapshot, ElementState, ArraySnapshot } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';
import { permuteInputSchema, subsetsInputSchema, letterCombinationsInputSchema, validateInput } from './validation';

function* permuteGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const result: number[][] = [];
  const used = new Set<number>();
  const path: number[] = [];

  yield {
    description: `开始生成全排列，输入: [${nums.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    } as ArraySnapshot,
  };

  function* backtrack(): Generator<Omit<AnimationSnapshot, 'step'>> {
    if (path.length === nums.length) {
      const permStates = new Map<number, ElementState>();
      path.forEach((_, i) => {
        permStates.set(i, 'sorted');
      });

      result.push([...path]);

      yield {
        description: `找到排列 ${result.length}: [${path.join(', ')}]`,
        codeLine: 8,
        data: {
          elements: [...path],
          elementStates: permStates,
          pointers: [],
        } as ArraySnapshot,
      };
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;

      const considerStates = new Map<number, ElementState>();
      used.forEach(idx => {
        considerStates.set(idx, 'sorted');
      });
      considerStates.set(i, 'comparing');

      yield {
        description: `选择 nums[${i}] = ${nums[i]}，路径: [${path.join(', ')}]`,
        codeLine: 12,
        data: {
          elements: [...nums],
          elementStates: considerStates,
          pointers: [{ name: 'i', index: i }],
        } as ArraySnapshot,
      };

      used.add(i);
      path.push(nums[i]);

      yield* backtrack();

      used.delete(i);
      path.pop();

      const backStates = new Map<number, ElementState>();
      used.forEach(idx => {
        backStates.set(idx, 'sorted');
      });

      yield {
        description: `撤销选择 nums[${i}]，回溯`,
        codeLine: 18,
        data: {
          elements: [...nums],
          elementStates: backStates,
          pointers: [{ name: 'i', index: i }],
        } as ArraySnapshot,
      };
    }
  }

  yield* backtrack();

  yield {
    description: `完成！共生成 ${result.length} 个排列`,
    codeLine: 0,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    } as ArraySnapshot,
  };
}

export function executePermute(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(permuteInputSchema, input);
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
  return generatorToSnapshots(permuteGenerator(validation.data.nums));
}

export function getPermuteDefaultInput() {
  return { nums: [1, 2, 3] };
}

function* subsetsGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const result: number[][] = [];
  const path: number[] = [];

  yield {
    description: `开始生成子集，输入: [${nums.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    } as ArraySnapshot,
  };

  function* backtrack(start: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    result.push([...path]);

    const subsetStates = new Map<number, ElementState>();
    path.forEach((_, i) => {
      subsetStates.set(i, 'sorted');
    });

    yield {
      description: `收集子集 ${result.length}: [${path.join(', ')}]`,
      codeLine: 5,
      data: {
        elements: path.length > 0 ? [...nums] : [...nums],
        elementStates: subsetStates,
        pointers: start < nums.length ? [{ name: 'start', index: start }] : [],
      } as ArraySnapshot,
    };

    for (let i = start; i < nums.length; i++) {
      const considerStates = new Map<number, ElementState>();
      path.forEach((_, idx) => {
        considerStates.set(idx, 'sorted');
      });
      considerStates.set(i, 'comparing');

      yield {
        description: `选择 nums[${i}] = ${nums[i]}，路径: [${path.join(', ')}]`,
        codeLine: 10,
        data: {
          elements: [...nums],
          elementStates: considerStates,
          pointers: [{ name: 'i', index: i }],
        } as ArraySnapshot,
      };

      path.push(nums[i]);

      yield* backtrack(i + 1);

      path.pop();

      const backStates = new Map<number, ElementState>();
      path.forEach((_, idx) => {
        backStates.set(idx, 'sorted');
      });

      yield {
        description: `撤销选择 nums[${i}]，回溯`,
        codeLine: 15,
        data: {
          elements: [...nums],
          elementStates: backStates,
          pointers: [{ name: 'i', index: i }],
        } as ArraySnapshot,
      };
    }
  }

  yield* backtrack(0);

  yield {
    description: `完成！共生成 ${result.length} 个子集`,
    codeLine: 0,
    data: {
      elements: [...nums],
      elementStates: createNormalStates(nums.length),
      pointers: [],
    } as ArraySnapshot,
  };
}

export function executeSubsets(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(subsetsInputSchema, input);
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
  return generatorToSnapshots(subsetsGenerator(validation.data.nums));
}

export function getSubsetsDefaultInput() {
  return { nums: [1, 2, 3] };
}

const phoneMap: Record<string, string> = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz',
};

function* letterCombinationsGenerator(
  digits: string
): Generator<Omit<AnimationSnapshot, 'step'>> {
  if (digits.length === 0) {
    yield {
      description: `输入为空，返回空数组`,
      codeLine: 0,
      data: {
        elements: [],
        elementStates: new Map(),
        pointers: [],
      } as ArraySnapshot,
    };
    return;
  }

  const result: string[] = [];
  const path: string[] = [];

  const digitNums = digits.split('').map(d => parseInt(d));
  yield {
    description: `开始生成字母组合，输入: ${digits}`,
    codeLine: 1,
    data: {
      elements: digitNums,
      elementStates: createNormalStates(digits.length),
      pointers: [{ name: 'index', index: 0 }],
    } as ArraySnapshot,
  };

  function* backtrack(index: number): Generator<Omit<AnimationSnapshot, 'step'>> {
    if (index === digits.length) {
      result.push(path.join(''));

      const combStates = new Map<number, ElementState>();
      for (let i = 0; i < digits.length; i++) {
        combStates.set(i, 'sorted');
      }

      yield {
        description: `找到组合 ${result.length}: "${path.join('')}"`,
        codeLine: 8,
        data: {
          elements: digitNums,
          elementStates: combStates,
          pointers: [],
        } as ArraySnapshot,
      };
      return;
    }

    const digit = digits[index];
    const letters = phoneMap[digit] || '';

    for (const letter of letters) {
      const considerStates = new Map<number, ElementState>();
      for (let i = 0; i < index; i++) {
        considerStates.set(i, 'sorted');
      }
      considerStates.set(index, 'comparing');

      yield {
        description: `位置 ${index}: 选择字母 '${letter}'，当前: "${path.join('')}"`,
        codeLine: 12,
        data: {
          elements: digitNums,
          elementStates: considerStates,
          pointers: [{ name: 'index', index }],
        } as ArraySnapshot,
      };

      path.push(letter);

      yield* backtrack(index + 1);

      path.pop();
    }
  }

  yield* backtrack(0);

  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < digits.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！共生成 ${result.length} 个字母组合`,
    codeLine: 0,
    data: {
      elements: digitNums,
      elementStates: finalStates,
      pointers: [],
    } as ArraySnapshot,
  };
}

export function executeLetterCombinations(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(letterCombinationsInputSchema, input);
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
  return generatorToSnapshots(letterCombinationsGenerator(validation.data.digits));
}

export function getLetterCombinationsDefaultInput() {
  return { digits: '23' };
}
