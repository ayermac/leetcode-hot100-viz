import { AnimationSnapshot, ElementState } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

function* moveZeroesGenerator(
  nums: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const arr = [...nums]; // Work on a copy
  let writeIndex = 0;

  // Initial state
  yield {
    description: `开始移动零操作，初始数组: [${arr.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...arr],
      elementStates: createNormalStates(arr.length),
      pointers: [
        { name: 'write', index: writeIndex },
        { name: 'i', index: 0 },
      ],
    },
  };

  for (let i = 0; i < arr.length; i++) {
    // Show current element being checked
    const states = new Map<number, ElementState>();
    states.set(i, 'comparing');

    yield {
      description: `检查 nums[${i}] = ${arr[i]}`,
      codeLine: 5,
      data: {
        elements: [...arr],
        elementStates: states,
        pointers: [
          { name: 'write', index: writeIndex },
          { name: 'i', index: i },
        ],
      },
    };

    if (arr[i] !== 0) {
      if (i !== writeIndex) {
        // Swap
        [arr[writeIndex], arr[i]] = [arr[i], arr[writeIndex]];

        const swapStates = new Map<number, ElementState>();
        swapStates.set(writeIndex, 'swapping');
        swapStates.set(i, 'swapping');

        yield {
          description: `交换 nums[${writeIndex}] 和 nums[${i}]`,
          codeLine: 8,
          data: {
            elements: [...arr],
            elementStates: swapStates,
            pointers: [
              { name: 'write', index: writeIndex },
              { name: 'i', index: i },
            ],
          },
        };
      }
      writeIndex++;
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < arr.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！最终数组: [${arr.join(', ')}]`,
    codeLine: 0,
    data: {
      elements: [...arr],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeMoveZeroes(nums: number[]): AnimationSnapshot[] {
  return generatorToSnapshots(moveZeroesGenerator(nums));
}

export function getMoveZeroesDefaultInput(): number[] {
  return [0, 1, 0, 3, 12];
}
