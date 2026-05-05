import { z } from 'zod';

// Common validation schemas
export const numberArraySchema = z.array(z.number()).min(1, 'Array must have at least one element');
export const positiveIntegerSchema = z.number().int().positive('Must be a positive integer');
export const nonNegativeIntegerSchema = z.number().int().nonnegative('Must be a non-negative integer');

// TwoSum: nums + target
export const twoSumInputSchema = z.object({
  nums: numberArraySchema,
  target: z.number(),
});

// ThreeSum: nums array
export const threeSumInputSchema = z.object({
  nums: numberArraySchema.min(3, 'Array must have at least 3 elements'),
});

// MoveZeroes: nums array
export const moveZeroesInputSchema = z.object({
  nums: numberArraySchema,
});

// ContainerWithWater: height array
export const containerWithWaterInputSchema = z.object({
  height: numberArraySchema.min(2, 'Height array must have at least 2 elements'),
});

// FindMin (rotated sorted array): nums array
export const findMinInputSchema = z.object({
  nums: numberArraySchema,
});

// SearchInsert: sorted nums + target
export const searchInsertInputSchema = z.object({
  nums: numberArraySchema,
  target: z.number(),
});

// MaxSubArray: nums array
export const maxSubArrayInputSchema = z.object({
  nums: numberArraySchema,
});

// ReverseList: linked list values
export const reverseListInputSchema = z.object({
  values: z.array(z.number()),
});

// HasCycle: linked list values (may include cycle indicator)
export const hasCycleInputSchema = z.object({
  values: z.array(z.number()),
});

// MergeTwoLists: two linked list value arrays
export const mergeTwoListsInputSchema = z.object({
  list1: z.array(z.number()),
  list2: z.array(z.number()),
});

// RemoveNthFromEnd: linked list values + n
export const removeNthFromEndInputSchema = z.object({
  values: z.array(z.number()),
  n: positiveIntegerSchema,
});

// InorderTraversal: tree values (null for empty nodes)
export const inorderTraversalInputSchema = z.object({
  values: z.array(z.number().nullable()),
});

// LengthOfLongestSubstring: input string
export const lengthOfLongestSubstringInputSchema = z.object({
  s: z.string().min(1, 'String must not be empty'),
});

// MinWindow: s + t strings
export const minWindowInputSchema = z.object({
  s: z.string().min(1, 'String s must not be empty'),
  t: z.string().min(1, 'String t must not be empty'),
});

// ValidParentheses: parentheses string
export const validParenthesesInputSchema = z.object({
  s: z.string(),
});

// DailyTemperatures: temperatures array
export const dailyTemperaturesInputSchema = z.object({
  temperatures: numberArraySchema,
});

// NumIslands: grid of '0' and '1'
export const numIslandsInputSchema = z.object({
  grid: z.array(z.array(z.enum(['0', '1']))).min(1, 'Grid must not be empty'),
});

// OrangesRotting: grid of 0, 1, 2
export const orangesRottingInputSchema = z.object({
  grid: z.array(z.array(z.enum(['0', '1', '2']))).min(1, 'Grid must not be empty'),
});

// Permute: nums array
export const permuteInputSchema = z.object({
  nums: numberArraySchema.max(6, 'Array too large for permutation visualization'),
});

// Subsets: nums array
export const subsetsInputSchema = z.object({
  nums: numberArraySchema.max(10, 'Array too large for subsets visualization'),
});

// LetterCombinations: digits string
export const letterCombinationsInputSchema = z.object({
  digits: z.string().regex(/^[2-9]*$/, 'Digits must be 2-9 only'),
});

// FindKthLargest: nums + k
export const findKthLargestInputSchema = z.object({
  nums: numberArraySchema,
  k: positiveIntegerSchema,
}).refine(data => data.k <= data.nums.length, {
  message: 'k must be less than or equal to array length',
});

// TopKFrequent: nums + k
export const topKFrequentInputSchema = z.object({
  nums: numberArraySchema,
  k: positiveIntegerSchema,
});

// Validation helper with error message
export function validateInput<T>(
  schema: z.ZodType<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessage = result.error.issues
    .map(e => `${e.path.join('.')}: ${e.message}`)
    .join('; ');
  return { success: false, error: errorMessage };
}
