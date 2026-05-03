---
phase: "04"
plan: "04-custom-input"
type: execute
wave: 3
depends_on: ["02-linked-list-visualizer", "03-algorithm-executors"]
files_modified:
  - src/components/VisualizationSection.tsx
files_created:
  - src/components/visualization/CustomInputPanel.tsx
  - src/lib/visualization/presets.ts
autonomous: true
requirements: [VIZ-04]
---

# Plan 04: Custom Input Component

## Objective

Implement a custom input component that allows users to modify algorithm input data for both array and linked list algorithms. Includes preset test cases and input validation with error messages.

## Tasks

### Task 1: Create CustomInputPanel component

<read_first>
- `leetcode-hot100-viz/src/components/visualization/ArrayVisualizer.tsx` — Reference component structure
- `leetcode-hot100-viz/src/components/ui/button.tsx` — Button component to use
</read_first>

<action>
Create file `leetcode-hot100-viz/src/components/visualization/CustomInputPanel.tsx`:

```tsx
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PresetCase {
  label: string;
  value: string;
}

interface CustomInputPanelProps {
  problemId: string;
  defaultValue: string;
  presets: PresetCase[];
  onInputChange: (value: string) => void;
  placeholder?: string;
  inputType: 'array' | 'linkedlist' | 'twoArrays' | 'arrayWithN';
  className?: string;
}

// Validation per D-09, D-10, D-12
function validateInput(value: string, inputType: string): { valid: boolean; error: string } {
  if (!value.trim()) {
    return { valid: false, error: '输入不能为空' };
  }

  const parts = value.split(',').map(s => s.trim());

  // Check for valid numbers
  for (const part of parts) {
    if (part && isNaN(Number(part))) {
      return { valid: false, error: `"${part}" 不是有效的数字` };
    }
  }

  // Type-specific validation
  if (inputType === 'linkedlist') {
    // D-10: Last value can indicate cycle entry
    if (parts.length > 20) {
      return { valid: false, error: '链表节点数量不能超过 20 个' };
    }
  } else if (inputType === 'array') {
    if (parts.length > 50) {
      return { valid: false, error: '数组元素数量不能超过 50 个' };
    }
  } else if (inputType === 'twoArrays') {
    // Format: "1,2,3|4,5,6" (pipe-separated)
    const arrays = value.split('|');
    if (arrays.length !== 2) {
      return { valid: false, error: '请输入两个数组，用 | 分隔' };
    }
    for (const arr of arrays) {
      const arrParts = arr.split(',').map(s => s.trim()).filter(s => s);
      if (arrParts.length > 50) {
        return { valid: false, error: '数组元素数量不能超过 50 个' };
      }
    }
  } else if (inputType === 'arrayWithN') {
    // Format: "1,2,3,4,5;n=2"
    const [arrayPart, nPart] = value.split(';');
    if (!nPart || !nPart.includes('n=')) {
      return { valid: false, error: '请使用格式: 1,2,3,4,5;n=2' };
    }
    const n = parseInt(nPart.replace('n=', '').trim());
    const arrParts = arrayPart.split(',').map(s => s.trim()).filter(s => s);
    if (n < 1 || n > arrParts.length) {
      return { valid: false, error: `n 必须在 1 到 ${arrParts.length} 之间` };
    }
  }

  return { valid: true, error: '' };
}

export function CustomInputPanel({
  problemId,
  defaultValue,
  presets,
  onInputChange,
  placeholder = '输入逗号分隔的数字',
  inputType,
  className,
}: CustomInputPanelProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [validation, setValidation] = useState({ valid: true, error: '' });

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    const result = validateInput(value, inputType);
    setValidation(result);
    if (result.valid) {
      onInputChange(value);
    }
  }, [inputType, onInputChange]);

  const handlePresetClick = useCallback((preset: PresetCase) => {
    setInputValue(preset.value);
    setValidation({ valid: true, error: '' });
    onInputChange(preset.value);
  }, [onInputChange]);

  const handleRunClick = useCallback(() => {
    if (validation.valid) {
      onInputChange(inputValue);
    }
  }, [validation.valid, inputValue, onInputChange]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preset test cases per D-11 */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">预设用例:</span>
          {presets.map((preset, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

      {/* Input field per D-09 */}
      <div className="space-y-2">
        <textarea
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full min-h-[60px] px-3 py-2 text-sm font-mono',
            'border rounded-lg resize-y',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            !validation.valid && 'border-red-500 focus:ring-red-500'
          )}
        />

        {/* Error message per D-12 */}
        {!validation.valid && (
          <p className="text-sm text-red-500">{validation.error}</p>
        )}
      </div>

      {/* Run button */}
      <Button
        onClick={handleRunClick}
        disabled={!validation.valid}
        className="w-full"
      >
        运行
      </Button>
    </div>
  );
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/visualization/CustomInputPanel.tsx` exists
- Component accepts props: `problemId`, `defaultValue`, `presets`, `onInputChange`, `placeholder`, `inputType`, `className`
- `validateInput` function validates comma-separated format per D-09
- Shows 3-5 preset test case buttons per D-11
- Displays validation errors in red text below input field per D-12
- Disables "运行" button when input is invalid
- TypeScript compilation passes
</acceptance_criteria>

### Task 2: Create preset configurations

<read_first>
- `leetcode-hot100-viz/src/lib/visualization/executors/reverseList.ts` — For default input format `{ values: [1, 2, 3, 4, 5] }`
- `leetcode-hot100-viz/src/lib/visualization/executors/hasCycle.ts` — For cycle input format
</read_first>

<action>
Create file `leetcode-hot100-viz/src/lib/visualization/presets.ts`:

```typescript
interface PresetCase {
  label: string;
  value: string;
}

interface ProblemPresets {
  inputType: 'array' | 'linkedlist' | 'twoArrays' | 'arrayWithN';
  defaultValue: string;
  presets: PresetCase[];
  placeholder: string;
}

export const problemPresets: Record<string, ProblemPresets> = {
  // Array algorithms (existing)
  '0001': {
    inputType: 'array',
    defaultValue: '2, 7, 11, 15',
    presets: [
      { label: '基础用例', value: '2, 7, 11, 15' },
      { label: '无解', value: '1, 2, 3' },
      { label: '首尾', value: '1, 2, 3, 4' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },
  '0283': {
    inputType: 'array',
    defaultValue: '0, 1, 0, 3, 12',
    presets: [
      { label: '基础用例', value: '0, 1, 0, 3, 12' },
      { label: '全零', value: '0, 0, 0' },
      { label: '无零', value: '1, 2, 3' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },

  // Linked list algorithms (new) per D-13
  '0206': {
    inputType: 'linkedlist',
    defaultValue: '1, 2, 3, 4, 5',
    presets: [
      { label: '基础用例', value: '1, 2, 3, 4, 5' },
      { label: '两个节点', value: '1, 2' },
      { label: '单节点', value: '1' },
      { label: '空链表', value: '' },
    ],
    placeholder: '输入链表节点值，逗号分隔',
  },
  '0141': {
    inputType: 'linkedlist',
    defaultValue: '3, 2, 0, 4, 2',
    presets: [
      { label: '有环', value: '3, 2, 0, 4, 2' },
      { label: '无环', value: '1, 2, 3, 4, 5' },
      { label: '自环', value: '1, 1' },
      { label: '首尾环', value: '1, 2, 3, 4, 1' },
    ],
    placeholder: '输入链表节点值，最后一个值表示环入口',
  },
  '0021': {
    inputType: 'twoArrays',
    defaultValue: '1, 2, 4|1, 3, 4',
    presets: [
      { label: '基础用例', value: '1, 2, 4|1, 3, 4' },
      { label: '一个空', value: '|1, 2, 3' },
      { label: '交错', value: '1, 3, 5|2, 4, 6' },
    ],
    placeholder: '输入两个数组，用 | 分隔',
  },
  '0019': {
    inputType: 'arrayWithN',
    defaultValue: '1, 2, 3, 4, 5;n=2',
    presets: [
      { label: '删除倒数第2', value: '1, 2, 3, 4, 5;n=2' },
      { label: '删除尾节点', value: '1, 2, 3;n=1' },
      { label: '删除头节点', value: '1, 2, 3;n=3' },
    ],
    placeholder: '输入数组;n=倒数第n个',
  },
};

export function getProblemPresets(problemId: string): ProblemPresets | undefined {
  return problemPresets[problemId];
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/lib/visualization/presets.ts` exists
- Exports `problemPresets` object with entries for problem IDs: 0001, 0283, 0206, 0141, 0021, 0019
- Each preset has 3-5 preset cases per D-11
- Linked list presets include cycle examples per D-10 (e.g., `'3, 2, 0, 4, 2'` where last `2` indicates cycle entry)
- Exports `getProblemPresets(problemId: string): ProblemPresets | undefined`
</acceptance_criteria>

### Task 3: Integrate CustomInputPanel with VisualizationSection

<read_first>
- `leetcode-hot100-viz/src/components/VisualizationSection.tsx` — Current implementation to extend (check imports and executorMap structure)
- `leetcode-hot100-viz/src/lib/visualization/executors/index.ts` — For executor imports
</read_first>

<action>
Modify `VisualizationSection.tsx`:

1. Add imports:
```typescript
import { CustomInputPanel } from './visualization/CustomInputPanel';
import { getProblemPresets } from '@/lib/visualization/presets';
import { useState, useMemo } from 'react';
```

2. Add parsing helper functions before the component:
```typescript
function parseSimpleArray(input: string): number[] {
  return input.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
}

function parseArrayWithNInput(input: string): { values: number[]; n: number } {
  const [arrPart, nPart] = input.split(';');
  const values = parseSimpleArray(arrPart);
  const n = parseInt(nPart?.replace('n=', '').trim() || '1');
  return { values, n };
}

function parseTwoArraysInput(input: string): { list1: number[]; list2: number[] } {
  const [arr1, arr2] = input.split('|');
  return {
    list1: parseSimpleArray(arr1),
    list2: parseSimpleArray(arr2 || ''),
  };
}
```

3. Update `VisualizationSection` component to add state and use custom input:
```typescript
export function VisualizationSection({ problemId }: VisualizationSectionProps) {
  const presets = getProblemPresets(problemId);
  const [customInput, setCustomInput] = useState<string>(presets?.defaultValue ?? '');

  const snapshots = useMemo(() => {
    // Map problem IDs to executors with custom input
    switch (problemId) {
      case '0001':
        return executeTwoSum({ nums: parseSimpleArray(customInput), target: 9 });
      case '0283':
        return executeMoveZeroes({ nums: parseSimpleArray(customInput) });
      case '0206':
        return executeReverseList({ values: parseSimpleArray(customInput) });
      case '0141':
        return executeHasCycle({ values: parseSimpleArray(customInput) });
      case '0021':
        return executeMergeTwoLists(parseTwoArraysInput(customInput));
      case '0019':
        return executeRemoveNthFromEnd(parseArrayWithNInput(customInput));
      default:
        return [];
    }
  }, [problemId, customInput]);

  // ... rest of component
}
```

4. Add CustomInputPanel to JSX:
```tsx
if (snapshots.length === 0) {
  return (
    <div className="p-6 text-center text-muted-foreground">
      该题目暂无动画演示
    </div>
  );
}

return (
  <div className="space-y-4">
    {presets && (
      <CustomInputPanel
        problemId={problemId}
        defaultValue={presets.defaultValue}
        presets={presets.presets}
        inputType={presets.inputType}
        placeholder={presets.placeholder}
        onInputChange={setCustomInput}
      />
    )}
    <AlgorithmPlayer snapshots={snapshots} />
  </div>
);
```

5. Update `supportedProblemIds`:
```typescript
const supportedProblemIds = new Set(['0001', '0283', '0011', '0015', '0206', '0141', '0021', '0019']);
```
</action>

<acceptance_criteria>
- `VisualizationSection.tsx` imports `CustomInputPanel` and `getProblemPresets`
- Component uses `useState` for `customInput` state
- `snapshots` useMemo depends on `customInput` and updates when input changes
- `CustomInputPanel` renders before `AlgorithmPlayer` when presets exist
- `supportedProblemIds` includes linked list problems: 0206, 0141, 0021, 0019
- TypeScript compilation passes
</acceptance_criteria>

### Task 4: Update exports

<read_first>
- `leetcode-hot100-viz/src/components/visualization/index.ts` — Current exports
- `leetcode-hot100-viz/src/lib/visualization/index.ts` — Current exports
</read_first>

<action>
Add to `components/visualization/index.ts`:
```typescript
export { CustomInputPanel } from './CustomInputPanel';
```

Add to `lib/visualization/index.ts`:
```typescript
export { problemPresets, getProblemPresets } from './presets';
```
</action>

<acceptance_criteria>
- `components/visualization/index.ts` contains `export { CustomInputPanel } from './CustomInputPanel';`
- `lib/visualization/index.ts` contains `export { problemPresets, getProblemPresets } from './presets';`
</acceptance_criteria>

## Verification

1. Run `pnpm tsc --noEmit` to verify TypeScript compilation
2. Navigate to `/problems/0206` and verify CustomInputPanel shows with preset buttons
3. Click a preset button and verify animation updates
4. Enter invalid input (e.g., "abc") and verify error message appears
5. Verify "运行" button is disabled for invalid input

## Must Haves

- [ ] `CustomInputPanel` component with textarea input per D-09
- [ ] 3-5 preset test case buttons per problem per D-11
- [ ] Input validation with error below input per D-12
- [ ] Linked list input supports cycle indicator per D-10
- [ ] Integration with `VisualizationSection` for re-running with custom input
