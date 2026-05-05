/**
 * Executor Registry
 *
 * Maps problem IDs to their corresponding executor functions.
 * Provides a centralized, type-safe way to look up executors.
 */

import type { AnimationSnapshot } from '../types';
import { ProblemId, PROBLEM_IDS } from '@/lib/constants/problems';

// Import all executors
import { executeTwoSum } from './twoSum';
import { executeMoveZeroes } from './moveZeroes';
import { executeContainerWithWater } from './containerWithWater';
import { executeThreeSum } from './threeSum';
import { executeFindMin } from './findMin';
import { executeSearchInsert } from './searchInsert';
import { executeMaxSubArray } from './maxSubArray';
import { executeReverseList } from './reverseList';
import { executeHasCycle } from './hasCycle';
import { executeMergeTwoLists } from './mergeTwoLists';
import { executeRemoveNthFromEnd } from './removeNthFromEnd';
import { executeInorderTraversal } from './binaryTreeTraversal';
import { executeLengthOfLongestSubstring, executeMinWindow } from './slidingWindow';
import { executeValidParentheses, executeDailyTemperatures } from './stackAlgorithms';
import { executeNumIslands, executeOrangesRotting } from './graphAlgorithms';
import { executePermute, executeSubsets, executeLetterCombinations } from './backtrackingAlgorithms';
import { executeFindKthLargest, executeTopKFrequent } from './heapAlgorithms';

/**
 * Executor function type
 */
export type ExecutorFn = (input: unknown) => AnimationSnapshot[];

/**
 * Registry mapping problem IDs to their executors
 */
export const executorRegistry = new Map<ProblemId, ExecutorFn>([
  // Array algorithms
  [PROBLEM_IDS.TWO_SUM, executeTwoSum],
  [PROBLEM_IDS.MOVE_ZEROES, executeMoveZeroes],
  [PROBLEM_IDS.CONTAINER_WITH_WATER, executeContainerWithWater],
  [PROBLEM_IDS.THREE_SUM, executeThreeSum],

  // Binary search
  [PROBLEM_IDS.FIND_MIN, executeFindMin],
  [PROBLEM_IDS.SEARCH_INSERT, executeSearchInsert],

  // Dynamic programming
  [PROBLEM_IDS.MAX_SUBARRAY, executeMaxSubArray],

  // Linked list algorithms
  [PROBLEM_IDS.REVERSE_LIST, executeReverseList],
  [PROBLEM_IDS.HAS_CYCLE, executeHasCycle],
  [PROBLEM_IDS.MERGE_TWO_LISTS, executeMergeTwoLists],
  [PROBLEM_IDS.REMOVE_NTH_FROM_END, executeRemoveNthFromEnd],

  // Binary tree
  [PROBLEM_IDS.INORDER_TRAVERSAL, executeInorderTraversal],

  // Sliding window
  [PROBLEM_IDS.LONGEST_SUBSTRING, executeLengthOfLongestSubstring],
  [PROBLEM_IDS.MIN_WINDOW, executeMinWindow],

  // Stack
  [PROBLEM_IDS.VALID_PARENTHESES, executeValidParentheses],
  [PROBLEM_IDS.DAILY_TEMPERATURES, executeDailyTemperatures],

  // Graph
  [PROBLEM_IDS.NUM_ISLANDS, executeNumIslands],
  [PROBLEM_IDS.ORANGES_ROTTING, executeOrangesRotting],

  // Backtracking
  [PROBLEM_IDS.PERMUTE, executePermute],
  [PROBLEM_IDS.SUBSETS, executeSubsets],
  [PROBLEM_IDS.LETTER_COMBINATIONS, executeLetterCombinations],

  // Heap
  [PROBLEM_IDS.FIND_KTH_LARGEST, executeFindKthLargest],
  [PROBLEM_IDS.TOP_K_FREQUENT, executeTopKFrequent],
]);

/**
 * Get the executor for a problem ID
 * Returns undefined if no executor is registered
 */
export function getExecutor(problemId: string): ExecutorFn | undefined {
  return executorRegistry.get(problemId as ProblemId);
}

/**
 * Check if an executor exists for a problem ID
 */
export function hasExecutor(problemId: string): boolean {
  return executorRegistry.has(problemId as ProblemId);
}
