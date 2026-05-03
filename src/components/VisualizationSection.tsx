'use client';

import { useMemo, useState } from 'react';
import { AlgorithmPlayer, CustomInputPanel } from '@/components/visualization';
import {
  executeTwoSum,
  executeMoveZeroes,
  executeContainerWithWater,
  executeThreeSum,
  executeFindMin,
  executeReverseList,
  executeHasCycle,
  executeMergeTwoLists,
  executeRemoveNthFromEnd,
  getProblemPresets,
} from '@/lib/visualization';

interface VisualizationSectionProps {
  problemId: string;
  onCodeLineChange?: (line: number) => void;  // Callback when code line changes
}

// Parsing helper functions
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

// Problem IDs that support visualization
const supportedProblemIds = new Set(['0001', '0283', '0011', '0015', '0153', '0206', '0141', '0021', '0019']);

export function isVisualizationSupported(problemId: string): boolean {
  return supportedProblemIds.has(problemId);
}

export function VisualizationSection({ problemId, onCodeLineChange }: VisualizationSectionProps) {
  const presets = getProblemPresets(problemId);
  const [customInput, setCustomInput] = useState<string>(presets?.defaultValue ?? '');

  const snapshots = useMemo(() => {
    // Map problem IDs to executors with custom input
    switch (problemId) {
      case '0001':
        return executeTwoSum({ nums: parseSimpleArray(customInput), target: 9 });
      case '0283':
        return executeMoveZeroes(parseSimpleArray(customInput));
      case '0011':
        return executeContainerWithWater(parseSimpleArray(customInput));
      case '0015':
        return executeThreeSum(parseSimpleArray(customInput));
      case '0153':
        return executeFindMin({ nums: parseSimpleArray(customInput) });
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

  if (!supportedProblemIds.has(problemId)) {
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
      <AlgorithmPlayer snapshots={snapshots} onCodeLineChange={onCodeLineChange} />
    </div>
  );
}