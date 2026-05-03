import { AnimationSnapshot, ElementState } from '../types';

/**
 * Creates a Map with all elements set to 'normal' state
 */
export function createNormalStates(length: number): Map<number, ElementState> {
  const states = new Map<number, ElementState>();
  for (let i = 0; i < length; i++) {
    states.set(i, 'normal');
  }
  return states;
}

/**
 * Converts a generator function to an array of AnimationSnapshots
 * with step numbers automatically assigned
 */
export function generatorToSnapshots(
  generator: Generator<Omit<AnimationSnapshot, 'step'>>
): AnimationSnapshot[] {
  const snapshots: AnimationSnapshot[] = [];
  let step = 0;

  for (const snapshot of generator) {
    snapshots.push({
      ...snapshot,
      step: step++,
    });
  }

  return snapshots;
}
