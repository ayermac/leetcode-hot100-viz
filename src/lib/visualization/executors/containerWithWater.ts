import { AnimationSnapshot, ElementState } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';

function* containerWithWaterGenerator(
  height: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  // Initial state
  yield {
    description: `开始计算容器最大盛水量，初始高度: [${height.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [...height],
      elementStates: createNormalStates(height.length),
      pointers: [
        { name: 'left', index: left },
        { name: 'right', index: right },
      ],
    },
  };

  while (left < right) {
    const currentArea = Math.min(height[left], height[right]) * (right - left);

    // Show comparison
    const states = new Map<number, ElementState>();
    states.set(left, 'comparing');
    states.set(right, 'comparing');

    yield {
      description: `计算面积: min(${height[left]}, ${height[right]}) × (${right} - ${left}) = ${currentArea}，当前最大: ${maxArea}`,
      codeLine: 8,
      data: {
        elements: [...height],
        elementStates: states,
        pointers: [
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    if (currentArea > maxArea) {
      maxArea = currentArea;
    }

    // Move pointer
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  // Complete
  const finalStates = new Map<number, ElementState>();
  for (let i = 0; i < height.length; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！最大盛水量为 ${maxArea}`,
    codeLine: 0,
    data: {
      elements: [...height],
      elementStates: finalStates,
      pointers: [],
    },
  };
}

export function executeContainerWithWater(height: number[]): AnimationSnapshot[] {
  return generatorToSnapshots(containerWithWaterGenerator(height));
}

export function getContainerWithWaterDefaultInput(): number[] {
  return [1, 8, 6, 2, 5, 4, 8, 3, 7];
}
