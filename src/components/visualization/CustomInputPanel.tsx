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
  inputType: 'array' | 'linkedlist' | 'twoArrays' | 'arrayWithN' | 'arrayWithTarget';
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
  } else if (inputType === 'arrayWithTarget') {
    // Format: "1,3,5,6;target=5"
    const [arrayPart, targetPart] = value.split(';');
    if (!targetPart || !targetPart.includes('target=')) {
      return { valid: false, error: '请使用格式: 1,3,5,6;target=5' };
    }
    const target = parseInt(targetPart.replace('target=', '').trim());
    if (isNaN(target)) {
      return { valid: false, error: 'target 必须是有效数字' };
    }
    const arrParts = arrayPart.split(',').map(s => s.trim()).filter(s => s);
    if (arrParts.length > 50) {
      return { valid: false, error: '数组元素数量不能超过 50 个' };
    }
  }

  return { valid: true, error: '' };
}

export function CustomInputPanel({
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

export type { PresetCase, CustomInputPanelProps };
