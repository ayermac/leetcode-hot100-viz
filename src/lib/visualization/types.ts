// Element states for array visualization
export type ElementState = 'normal' | 'comparing' | 'swapping' | 'sorted';

// Pointer annotation
export interface Pointer {
  name: string;        // "left", "right", "i", "j", "mid"
  index: number;       // Position in array
}

// Array snapshot for a single animation step
export interface ArraySnapshot {
  elements: number[];
  elementStates: Map<number, ElementState>;
  pointers: Pointer[];
}

// Linked list node reference (index-based for simplicity)
export interface ListNodeRef {
  value: number;
  nextIndex: number | null;  // null means end of list
}

// Linked list snapshot for a single animation step
export interface LinkedListSnapshot {
  nodes: ListNodeRef[];
  nodeStates: Map<number, ElementState>;
  pointers: Pointer[];
  cycleEntryIndex: number | null;  // For cycle detection, null if no cycle
}

// Complete animation snapshot
export interface AnimationSnapshot {
  step: number;
  description: string;
  codeLine: number;  // For code synchronization (1-indexed, 0 means no highlight)
  data: ArraySnapshot | LinkedListSnapshot;
}

// Animation player state
export interface AnimationState {
  snapshots: AnimationSnapshot[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;  // 0.5, 1, 2
}

// Animation player actions
export type AnimationAction =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP_FORWARD' }
  | { type: 'STEP_BACKWARD' }
  | { type: 'RESET' }
  | { type: 'SET_SPEED'; payload: number }
  | { type: 'GO_TO'; payload: number }
  | { type: 'LOAD_SNAPSHOTS'; payload: AnimationSnapshot[] };

// Speed options
export const SPEED_OPTIONS = [0.5, 1, 2] as const;
export type SpeedOption = typeof SPEED_OPTIONS[number];

// Executor interface
export interface AlgorithmExecutor {
  execute(input: unknown): AnimationSnapshot[];
  getDefaultInput(): unknown;
}

// Helper to create a linked list from an array of values
// For cycle detection: if last value matches an earlier value, create a cycle
export function createLinkedListFromValues(
  values: number[]
): { nodes: ListNodeRef[]; cycleEntryIndex: number | null } {
  if (values.length === 0) {
    return { nodes: [], cycleEntryIndex: null };
  }

  const nodes: ListNodeRef[] = [];
  let cycleEntryIndex: number | null = null;

  // Check if last value matches any earlier value (cycle indicator per D-10)
  const lastValue = values[values.length - 1];
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === lastValue) {
      cycleEntryIndex = i;
      break;
    }
  }

  // Create nodes (exclude last value if it's a cycle indicator)
  const nodeCount = cycleEntryIndex !== null ? values.length - 1 : values.length;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      value: values[i],
      nextIndex: i === nodeCount - 1 ? null : i + 1,
    });
  }

  // If cycle exists, point last node to cycle entry
  if (cycleEntryIndex !== null && nodes.length > 0) {
    nodes[nodes.length - 1].nextIndex = cycleEntryIndex;
  }

  return { nodes, cycleEntryIndex };
}

// Helper to create normal states for all nodes
export function createNormalNodeStates(nodeCount: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < nodeCount; i++) {
    states.set(i, 'normal');
  }
  return states;
}
