'use client';

import { useMemo, useState } from 'react';
import { AlgorithmPlayer, CustomInputPanel } from '@/components/visualization';
import { getProblemPresets } from '@/lib/visualization';
import { isVisualizationSupported } from '@/lib/constants/problems';
import { getExecutor } from '@/lib/visualization/executors/registry';

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

function parseArrayWithTargetInput(input: string): { nums: number[]; target: number } {
  const [arrPart, targetPart] = input.split(';');
  const nums = parseSimpleArray(arrPart);
  const target = parseInt(targetPart?.replace('target=', '').trim() || '0');
  return { nums, target };
}

function parseTwoArraysInput(input: string): { list1: number[]; list2: number[] } {
  const [arr1, arr2] = input.split('|');
  return {
    list1: parseSimpleArray(arr1),
    list2: parseSimpleArray(arr2 || ''),
  };
}

// Input parsing map for different problem types
const inputParsers: Record<string, (input: string) => unknown> = {
  '0001': (input) => ({ nums: parseSimpleArray(input), target: 9 }),
  '0283': (input) => parseSimpleArray(input),
  '0011': (input) => parseSimpleArray(input),
  '0015': (input) => parseSimpleArray(input),
  '0153': (input) => ({ nums: parseSimpleArray(input) }),
  '0035': (input) => parseArrayWithTargetInput(input),
  '0053': (input) => ({ nums: parseSimpleArray(input) }),
  '0206': (input) => ({ values: parseSimpleArray(input) }),
  '0141': (input) => ({ values: parseSimpleArray(input) }),
  '0021': (input) => parseTwoArraysInput(input),
  '0019': (input) => parseArrayWithNInput(input),
};

export function VisualizationSection({ problemId, onCodeLineChange }: VisualizationSectionProps) {
  const presets = getProblemPresets(problemId);
  const [customInput, setCustomInput] = useState<string>(presets?.defaultValue ?? '');

  const snapshots = useMemo(() => {
    const executor = getExecutor(problemId);
    const parser = inputParsers[problemId];

    if (executor && parser) {
      return executor(parser(customInput));
    }

    return [];
  }, [problemId, customInput]);

  if (!isVisualizationSupported(problemId)) {
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
