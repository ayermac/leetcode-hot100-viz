import { AnimationSnapshot, ElementState, Pointer } from '../types';
import { createNormalStates, generatorToSnapshots } from './utils';
import { lengthOfLongestSubstringInputSchema, minWindowInputSchema, validateInput } from './validation';

function* lengthOfLongestSubstringGenerator(
  s: string
): Generator<Omit<AnimationSnapshot, 'step'>> {
  const charArray = s.split('');
  const charSet = new Set<string>();
  let left = 0;
  let maxLength = 0;
  let maxStart = 0;

  yield {
    description: `开始在字符串 "${s}" 中查找无重复字符的最长子串`,
    codeLine: 1,
    data: {
      elements: charArray.map(c => c.charCodeAt(0)),
      elementStates: createNormalStates(s.length),
      pointers: [
        { name: 'left', index: 0 },
        { name: 'right', index: 0 },
      ],
    },
  };

  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    const examineStates = new Map<number, ElementState>();
    examineStates.set(right, 'comparing');
    for (let i = left; i < right; i++) {
      examineStates.set(i, 'highlighted');
    }

    yield {
      description: `检查字符 '${currentChar}' (位置 ${right})，当前窗口 [${left}, ${right}]`,
      codeLine: 5,
      data: {
        elements: charArray.map(c => c.charCodeAt(0)),
        elementStates: examineStates,
        pointers: [
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    while (charSet.has(currentChar)) {
      const leftChar = s[left];

      const removeStates = new Map<number, ElementState>();
      removeStates.set(left, 'swapping');
      removeStates.set(right, 'comparing');
      for (let i = left + 1; i < right; i++) {
        removeStates.set(i, 'highlighted');
      }

      yield {
        description: `字符 '${currentChar}' 已存在，移除左边字符 '${leftChar}' (位置 ${left})`,
        codeLine: 8,
        data: {
          elements: charArray.map(c => c.charCodeAt(0)),
          elementStates: removeStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };

      charSet.delete(leftChar);
      left++;
    }

    charSet.add(currentChar);

    const addStates = new Map<number, ElementState>();
    for (let i = left; i <= right; i++) {
      addStates.set(i, 'highlighted');
    }

    const currentLength = right - left + 1;
    if (currentLength > maxLength) {
      maxLength = currentLength;
      maxStart = left;

      const maxStates = new Map<number, ElementState>();
      for (let i = left; i <= right; i++) {
        maxStates.set(i, 'sorted');
      }

      yield {
        description: `发现更长子串！长度 = ${maxLength}，起始位置 = ${maxStart}`,
        codeLine: 12,
        data: {
          elements: charArray.map(c => c.charCodeAt(0)),
          elementStates: maxStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };
    } else {
      yield {
        description: `当前窗口 [${left}, ${right}]，子串: "${s.slice(left, right + 1)}"，长度 = ${currentLength}`,
        codeLine: 14,
        data: {
          elements: charArray.map(c => c.charCodeAt(0)),
          elementStates: addStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };
    }
  }

  const finalStates = new Map<number, ElementState>();
  for (let i = maxStart; i < maxStart + maxLength; i++) {
    finalStates.set(i, 'sorted');
  }

  yield {
    description: `完成！最长无重复字符子串: "${s.slice(maxStart, maxStart + maxLength)}"，长度 = ${maxLength}`,
    codeLine: 0,
    data: {
      elements: charArray.map(c => c.charCodeAt(0)),
      elementStates: finalStates,
      pointers: [
        { name: 'left', index: maxStart },
        { name: 'right', index: maxStart + maxLength - 1 },
      ],
    },
  };
}

export function executeLengthOfLongestSubstring(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(lengthOfLongestSubstringInputSchema, input);
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
  return generatorToSnapshots(lengthOfLongestSubstringGenerator(validation.data.s));
}

export function getLengthOfLongestSubstringDefaultInput() {
  return {
    s: 'abcabcbb',
  };
}

function* minWindowGenerator(
  s: string,
  t: string
): Generator<Omit<AnimationSnapshot, 'step'>> {
  if (s.length < t.length) {
    yield {
      description: `字符串 s 长度小于 t，无法找到`,
      codeLine: 0,
      data: {
        elements: s.split('').map(c => c.charCodeAt(0)),
        elementStates: createNormalStates(s.length),
        pointers: [],
      },
    };
    return;
  }

  const charArray = s.split('');

  const targetFreq = new Map<string, number>();
  for (const char of t) {
    targetFreq.set(char, (targetFreq.get(char) || 0) + 1);
  }

  const windowFreq = new Map<string, number>();
  let left = 0;
  let validCount = 0;
  let minLen = Infinity;
  let minStart = -1;

  yield {
    description: `开始在 "${s}" 中查找包含 "${t}" 所有字符的最小窗口`,
    codeLine: 1,
    data: {
      elements: charArray.map(c => c.charCodeAt(0)),
      elementStates: createNormalStates(s.length),
      pointers: [
        { name: 'left', index: 0 },
        { name: 'right', index: 0 },
      ],
    },
  };

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (targetFreq.has(char)) {
      windowFreq.set(char, (windowFreq.get(char) || 0) + 1);
      if (windowFreq.get(char) === targetFreq.get(char)) {
        validCount++;
      }
    }

    const expandStates = new Map<number, ElementState>();
    expandStates.set(right, 'comparing');
    for (let i = left; i < right; i++) {
      if (targetFreq.has(s[i])) {
        expandStates.set(i, 'highlighted');
      }
    }

    yield {
      description: `添加字符 '${char}' (位置 ${right})，有效字符数 = ${validCount}/${targetFreq.size}`,
      codeLine: 5,
      data: {
        elements: charArray.map(c => c.charCodeAt(0)),
        elementStates: expandStates,
        pointers: [
          { name: 'left', index: left },
          { name: 'right', index: right },
        ],
      },
    };

    while (validCount === targetFreq.size && left <= right) {
      const currentLen = right - left + 1;

      if (currentLen < minLen) {
        minLen = currentLen;
        minStart = left;

        const minStates = new Map<number, ElementState>();
        for (let i = left; i <= right; i++) {
          minStates.set(i, 'sorted');
        }

        yield {
          description: `找到更小窗口！起始 = ${minStart}，长度 = ${minLen}，内容: "${s.slice(minStart, minStart + minLen)}"`,
          codeLine: 10,
          data: {
            elements: charArray.map(c => c.charCodeAt(0)),
            elementStates: minStates,
            pointers: [
              { name: 'left', index: left },
              { name: 'right', index: right },
            ],
          },
        };
      }

      const leftChar = s[left];
      if (targetFreq.has(leftChar)) {
        if (windowFreq.get(leftChar) === targetFreq.get(leftChar)) {
          validCount--;
        }
        windowFreq.set(leftChar, windowFreq.get(leftChar)! - 1);
      }
      left++;

      const shrinkStates = new Map<number, ElementState>();
      shrinkStates.set(left - 1, 'swapping');
      for (let i = left; i <= right; i++) {
        if (targetFreq.has(s[i])) {
          shrinkStates.set(i, 'highlighted');
        }
      }

      yield {
        description: `收缩窗口，移除 '${leftChar}' (位置 ${left - 1})`,
        codeLine: 14,
        data: {
          elements: charArray.map(c => c.charCodeAt(0)),
          elementStates: shrinkStates,
          pointers: [
            { name: 'left', index: left },
            { name: 'right', index: right },
          ],
        },
      };
    }
  }

  if (minStart === -1) {
    yield {
      description: `未找到包含所有字符的窗口`,
      codeLine: 0,
      data: {
        elements: charArray.map(c => c.charCodeAt(0)),
        elementStates: createNormalStates(s.length),
        pointers: [],
      },
    };
  } else {
    const finalStates = new Map<number, ElementState>();
    for (let i = minStart; i < minStart + minLen; i++) {
      finalStates.set(i, 'sorted');
    }

    yield {
      description: `完成！最小窗口: "${s.slice(minStart, minStart + minLen)}"，长度 = ${minLen}`,
      codeLine: 0,
      data: {
        elements: charArray.map(c => c.charCodeAt(0)),
        elementStates: finalStates,
        pointers: [
          { name: 'left', index: minStart },
          { name: 'right', index: minStart + minLen - 1 },
        ],
      },
    };
  }
}

export function executeMinWindow(input: unknown): AnimationSnapshot[] {
  const validation = validateInput(minWindowInputSchema, input);
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
  const { s, t } = validation.data;
  return generatorToSnapshots(minWindowGenerator(s, t));
}

export function getMinWindowDefaultInput() {
  return {
    s: 'ADOBECODEBANC',
    t: 'ABC',
  };
}
