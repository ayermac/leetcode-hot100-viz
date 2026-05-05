/**
 * Problem ID type and constants
 *
 * Provides type-safe problem ID references throughout the codebase.
 * Eliminates hardcoded string literals and enables IDE autocomplete.
 */

/**
 * Branded type for problem IDs
 * Provides compile-time type safety while still being compatible with strings
 */
export type ProblemId = string & { readonly __brand: unique symbol };

/**
 * Helper to create a ProblemId from a string
 */
function asProblemId(id: string): ProblemId {
  return id as ProblemId;
}

/**
 * All problem IDs that support visualization
 * Add new problems here to enable them in the visualization system
 */
export const PROBLEM_IDS = {
  // Array algorithms
  TWO_SUM: asProblemId('0001'),
  MOVE_ZEROES: asProblemId('0283'),
  CONTAINER_WITH_WATER: asProblemId('0011'),
  THREE_SUM: asProblemId('0015'),

  // Binary search
  FIND_MIN: asProblemId('0153'),
  SEARCH_INSERT: asProblemId('0035'),

  // Dynamic programming
  MAX_SUBARRAY: asProblemId('0053'),

  // Linked list algorithms
  REVERSE_LIST: asProblemId('0206'),
  HAS_CYCLE: asProblemId('0141'),
  MERGE_TWO_LISTS: asProblemId('0021'),
  REMOVE_NTH_FROM_END: asProblemId('0019'),

  // Binary tree
  INORDER_TRAVERSAL: asProblemId('0094'),

  // Sliding window
  LONGEST_SUBSTRING: asProblemId('0003'),
  MIN_WINDOW: asProblemId('0076'),

  // Stack
  VALID_PARENTHESES: asProblemId('0020'),
  DAILY_TEMPERATURES: asProblemId('0739'),

  // Graph
  NUM_ISLANDS: asProblemId('0200'),
  ORANGES_ROTTING: asProblemId('0994'),

  // Backtracking
  PERMUTE: asProblemId('0046'),
  SUBSETS: asProblemId('0078'),
  LETTER_COMBINATIONS: asProblemId('0017'),

  // Heap
  FIND_KTH_LARGEST: asProblemId('0215'),
  TOP_K_FREQUENT: asProblemId('0347'),
} as const;

/**
 * Type for the PROBLEM_IDS object keys
 */
export type ProblemIdKey = keyof typeof PROBLEM_IDS;

/**
 * Set of all visualization-supported problem IDs
 * Use this for O(1) lookup to check if a problem supports visualization
 */
export const VISUALIZATION_SUPPORTED_IDS: ReadonlySet<ProblemId> = new Set<ProblemId>(
  Object.values(PROBLEM_IDS)
);

/**
 * Type guard to check if a string is a valid ProblemId
 */
export function isVisualizationSupported(id: string): boolean {
  return VISUALIZATION_SUPPORTED_IDS.has(id as ProblemId);
}

/**
 * Problem IDs that have rich content (detailed explanations)
 * Rich content includes life scenarios, step-by-step solutions, etc.
 */
export const RICH_CONTENT_IDS: ReadonlySet<ProblemId> = new Set<ProblemId>([
  PROBLEM_IDS.TWO_SUM,
  // Add more problem IDs as rich content is created
]);

/**
 * Check if a problem has rich content
 */
export function hasRichContent(id: string): boolean {
  return RICH_CONTENT_IDS.has(id as ProblemId);
}

/**
 * Get the LeetCode problem number from a ProblemId
 */
export function getLeetCodeNumber(id: ProblemId): number {
  return parseInt(id, 10);
}

/**
 * Create a ProblemId from a LeetCode problem number
 */
export function fromLeetCodeNumber(num: number): ProblemId {
  return asProblemId(num.toString().padStart(4, '0'));
}
