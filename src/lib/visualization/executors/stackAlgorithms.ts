import { AnimationSnapshot, ElementState, StackSnapshot } from '../types';
import { generatorToSnapshots } from './utils';

interface ValidParenthesesInput {
  s: string;
}

function* validParenthesesGenerator(
  s: string
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  // Initial state
  yield {
    description: `开始验证括号字符串: "${s}"`,
    codeLine: 1,
    data: {
      elements: [],
      elementStates: new Map(),
      topPointer: -1,
    } as StackSnapshot,
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const isOpening = char === '(' || char === '[' || char === '{';

    // Show current character being processed
    const processStates = new Map<number, ElementState>();
    if (stack.length > 0) {
      processStates.set(stack.length - 1, 'highlighted');
    }

    yield {
      description: `处理字符 '${char}' (位置 ${i})，当前栈: [${stack.join(', ')}]`,
      codeLine: 5,
      data: {
        elements: [...stack],
        elementStates: processStates,
        topPointer: stack.length - 1,
      } as StackSnapshot,
    };

    if (isOpening) {
      // Push opening bracket
      stack.push(char);
      const pushStates = new Map<number, ElementState>();
      pushStates.set(stack.length - 1, 'comparing');

      yield {
        description: `压入左括号 '${char}'`,
        codeLine: 8,
        data: {
          elements: [...stack],
          elementStates: pushStates,
          topPointer: stack.length - 1,
        } as StackSnapshot,
      };
    } else {
      // Closing bracket - check match
      if (stack.length === 0) {
        const errorStates = new Map<number, ElementState>();
        yield {
          description: `错误：栈为空，无法匹配 '${char}'`,
          codeLine: 12,
          data: {
            elements: [],
            elementStates: errorStates,
            topPointer: -1,
          } as StackSnapshot,
        };
        return;
      }

      const top = stack[stack.length - 1];
      if (top !== pairs[char]) {
        const errorStates = new Map<number, ElementState>();
        errorStates.set(stack.length - 1, 'swapping');

        yield {
          description: `错误：栈顶 '${top}' 与 '${char}' 不匹配`,
          codeLine: 15,
          data: {
            elements: [...stack],
            elementStates: errorStates,
            topPointer: stack.length - 1,
          } as StackSnapshot,
        };
        return;
      }

      // Pop matching bracket
      stack.pop();
      const popStates = new Map<number, ElementState>();
      if (stack.length > 0) {
        popStates.set(stack.length - 1, 'sorted');
      }

      yield {
        description: `匹配成功，弹出 '${top}'`,
        codeLine: 18,
        data: {
          elements: [...stack],
          elementStates: popStates,
          topPointer: stack.length - 1,
        } as StackSnapshot,
      };
    }
  }

  // Final state
  if (stack.length === 0) {
    yield {
      description: `验证通过！括号字符串有效`,
      codeLine: 0,
      data: {
        elements: [],
        elementStates: new Map(),
        topPointer: -1,
      } as StackSnapshot,
    };
  } else {
    const errorStates = new Map<number, ElementState>();
    errorStates.set(stack.length - 1, 'swapping');
    yield {
      description: `验证失败！栈中仍有未匹配的括号`,
      codeLine: 0,
      data: {
        elements: [...stack],
        elementStates: errorStates,
        topPointer: stack.length - 1,
      } as StackSnapshot,
    };
  }
}

export function executeValidParentheses(input: ValidParenthesesInput): AnimationSnapshot[] {
  return generatorToSnapshots(validParenthesesGenerator(input.s));
}

export function getValidParenthesesDefaultInput(): ValidParenthesesInput {
  return {
    s: '()[]{}',
  };
}

// Daily Temperatures (LeetCode 739) - Monotonic Stack
interface DailyTemperaturesInput {
  temperatures: number[];
}

function* dailyTemperaturesGenerator(
  temperatures: number[]
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const n = temperatures.length;
  const result = new Array(n).fill(0);
  const stack: number[] = []; // Indices of temperatures

  // Initial state
  yield {
    description: `开始计算每日温度，输入: [${temperatures.join(', ')}]`,
    codeLine: 1,
    data: {
      elements: [],
      elementStates: new Map(),
      topPointer: -1,
    } as StackSnapshot,
  };

  for (let i = 0; i < n; i++) {
    // Show current day
    const currentStates = new Map<number, ElementState>();
    if (stack.length > 0) {
      currentStates.set(stack.length - 1, 'highlighted');
    }

    yield {
      description: `处理第 ${i} 天，温度 = ${temperatures[i]}°C`,
      codeLine: 5,
      data: {
        elements: stack.map(idx => `${temperatures[idx]}°`),
        elementStates: currentStates,
        topPointer: stack.length - 1,
      } as StackSnapshot,
    };

    // Pop while current temperature is higher
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prevIndex = stack.pop()!;
      result[prevIndex] = i - prevIndex;

      const popStates = new Map<number, ElementState>();
      if (stack.length > 0) {
        popStates.set(stack.length - 1, 'sorted');
      }

      yield {
        description: `第 ${prevIndex} 天找到更高温度，需等待 ${result[prevIndex]} 天`,
        codeLine: 9,
        data: {
          elements: stack.map(idx => `${temperatures[idx]}°`),
          elementStates: popStates,
          topPointer: stack.length - 1,
        } as StackSnapshot,
      };
    }

    // Push current index
    stack.push(i);
    const pushStates = new Map<number, ElementState>();
    pushStates.set(stack.length - 1, 'comparing');

    yield {
      description: `将第 ${i} 天压入栈，栈: [${stack.map(idx => temperatures[idx] + '°').join(', ')}]`,
      codeLine: 14,
      data: {
        elements: stack.map(idx => `${temperatures[idx]}°`),
        elementStates: pushStates,
        topPointer: stack.length - 1,
      } as StackSnapshot,
    };
  }

  // Final state
  yield {
    description: `完成！结果: [${result.join(', ')}]`,
    codeLine: 0,
    data: {
      elements: [],
      elementStates: new Map(),
      topPointer: -1,
    } as StackSnapshot,
  };
}

export function executeDailyTemperatures(input: DailyTemperaturesInput): AnimationSnapshot[] {
  return generatorToSnapshots(dailyTemperaturesGenerator(input.temperatures));
}

export function getDailyTemperaturesDefaultInput(): DailyTemperaturesInput {
  return {
    temperatures: [73, 74, 75, 71, 69, 72, 76, 73],
  };
}
