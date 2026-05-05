import { ProblemId, PROBLEM_IDS } from '@/lib/constants/problems';

interface PresetCase {
  label: string;
  value: string;
}

interface ProblemPresets {
  inputType: 'array' | 'linkedlist' | 'twoArrays' | 'arrayWithN' | 'arrayWithTarget';
  defaultValue: string;
  presets: PresetCase[];
  placeholder: string;
}

export const problemPresets: Record<ProblemId, ProblemPresets> = {
  // Array algorithms
  [PROBLEM_IDS.TWO_SUM]: {
    inputType: 'array',
    defaultValue: '2, 7, 11, 15',
    presets: [
      { label: '基础用例', value: '2, 7, 11, 15' },
      { label: '无解', value: '1, 2, 3' },
      { label: '首尾', value: '1, 2, 3, 4' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },
  [PROBLEM_IDS.MOVE_ZEROES]: {
    inputType: 'array',
    defaultValue: '0, 1, 0, 3, 12',
    presets: [
      { label: '基础用例', value: '0, 1, 0, 3, 12' },
      { label: '全零', value: '0, 0, 0' },
      { label: '无零', value: '1, 2, 3' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },
  [PROBLEM_IDS.CONTAINER_WITH_WATER]: {
    inputType: 'array',
    defaultValue: '1, 8, 6, 2, 5, 4, 8, 3, 7',
    presets: [
      { label: '基础用例', value: '1, 8, 6, 2, 5, 4, 8, 3, 7' },
      { label: '简单', value: '1, 1' },
      { label: '递增', value: '1, 2, 3, 4, 5' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },
  [PROBLEM_IDS.THREE_SUM]: {
    inputType: 'array',
    defaultValue: '-1, 0, 1, 2, -1, -4',
    presets: [
      { label: '基础用例', value: '-1, 0, 1, 2, -1, -4' },
      { label: '全零', value: '0, 0, 0, 0' },
      { label: '无解', value: '1, 2, 3, 4' },
    ],
    placeholder: '输入数组元素，逗号分隔',
  },

  // Binary search
  [PROBLEM_IDS.FIND_MIN]: {
    inputType: 'array',
    defaultValue: '4, 5, 6, 7, 0, 1, 2',
    presets: [
      { label: '基础用例', value: '4, 5, 6, 7, 0, 1, 2' },
      { label: '未旋转', value: '1, 2, 3, 4, 5' },
      { label: '两元素', value: '2, 1' },
      { label: '最小在中间', value: '3, 4, 5, 1, 2' },
    ],
    placeholder: '输入旋转数组元素，逗号分隔',
  },
  [PROBLEM_IDS.SEARCH_INSERT]: {
    inputType: 'array',
    defaultValue: '1, 3, 5, 6;target=5',
    presets: [
      { label: '找到目标', value: '1, 3, 5, 6;target=5' },
      { label: '插入中间', value: '1, 3, 5, 6;target=2' },
      { label: '插入末尾', value: '1, 3, 5, 6;target=7' },
      { label: '插入开头', value: '1, 3, 5, 6;target=0' },
    ],
    placeholder: '输入有序数组;target=目标值',
  },

  // Dynamic programming
  [PROBLEM_IDS.MAX_SUBARRAY]: {
    inputType: 'array',
    defaultValue: '-2, 1, -3, 4, -1, 2, 1, -5, 4',
    presets: [
      { label: '经典用例', value: '-2, 1, -3, 4, -1, 2, 1, -5, 4' },
      { label: '全负数', value: '-5, -2, -8, -1' },
      { label: '全正数', value: '1, 2, 3, 4, 5' },
      { label: '单个元素', value: '5' },
    ],
    placeholder: '输入整数数组，逗号分隔',
  },

  // Linked list algorithms
  [PROBLEM_IDS.REVERSE_LIST]: {
    inputType: 'linkedlist',
    defaultValue: '1, 2, 3, 4, 5',
    presets: [
      { label: '基础用例', value: '1, 2, 3, 4, 5' },
      { label: '两个节点', value: '1, 2' },
      { label: '单节点', value: '1' },
    ],
    placeholder: '输入链表节点值，逗号分隔',
  },
  [PROBLEM_IDS.HAS_CYCLE]: {
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
  [PROBLEM_IDS.MERGE_TWO_LISTS]: {
    inputType: 'twoArrays',
    defaultValue: '1, 2, 4|1, 3, 4',
    presets: [
      { label: '基础用例', value: '1, 2, 4|1, 3, 4' },
      { label: '一个空', value: '|1, 2, 3' },
      { label: '交错', value: '1, 3, 5|2, 4, 6' },
    ],
    placeholder: '输入两个数组，用 | 分隔',
  },
  [PROBLEM_IDS.REMOVE_NTH_FROM_END]: {
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
  return problemPresets[problemId as ProblemId];
}

export type { PresetCase, ProblemPresets };
