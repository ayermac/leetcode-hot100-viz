'use client';

import { useEffect } from 'react';
import { AnimationSnapshot, ArraySnapshot, BinaryTreeSnapshot, LinkedListSnapshot, StackSnapshot, MatrixSnapshot } from '@/lib/visualization/types';
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer';
import { useAnimationSpeed } from '@/hooks/useAnimationSpeed';
import { ArrayVisualizer } from './ArrayVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { BinaryTreeVisualizer } from './BinaryTreeVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { PlaybackControls } from './PlaybackControls';

interface AlgorithmPlayerProps {
  snapshots: AnimationSnapshot[];
  autoLoad?: boolean;
  onCodeLineChange?: (line: number) => void;  // Callback when code line changes
}

// Type guard to check if snapshot is ArraySnapshot
function isArraySnapshot(data: unknown): data is ArraySnapshot {
  return data !== null && typeof data === 'object' && 'elements' in data;
}

// Type guard to check if snapshot is BinaryTreeSnapshot
function isBinaryTreeSnapshot(data: unknown): data is BinaryTreeSnapshot {
  return data !== null && typeof data === 'object' && 'nodes' in data && 'highlightedPath' in data;
}

// Type guard to check if snapshot is LinkedListSnapshot
function isLinkedListSnapshot(data: unknown): data is LinkedListSnapshot {
  return data !== null && typeof data === 'object' && 'nodes' in data && 'pointers' in data && !('highlightedPath' in data);
}

// Type guard to check if snapshot is StackSnapshot
function isStackSnapshot(data: unknown): data is StackSnapshot {
  return data !== null && typeof data === 'object' && 'elements' in data && 'topPointer' in data;
}

// Type guard to check if snapshot is MatrixSnapshot
function isMatrixSnapshot(data: unknown): data is MatrixSnapshot {
  return data !== null && typeof data === 'object' && 'grid' in data && 'cellStates' in data;
}

export function AlgorithmPlayer({ snapshots, autoLoad = true, onCodeLineChange }: AlgorithmPlayerProps) {
  const { speed: persistedSpeed, setSpeed: setPersistedSpeed } = useAnimationSpeed();
  const { loadSnapshots, setSpeed: setPlayerSpeed, currentSnapshot, currentIndex, totalSteps, isPlaying, speed: playerSpeed, canStepForward, canStepBackward, play, pause, stepForward, stepBackward, reset, goTo } = useAnimationPlayer();

  // Load snapshots when provided
  useEffect(() => {
    if (autoLoad && snapshots.length > 0) {
      loadSnapshots(snapshots);
    }
  }, [snapshots, autoLoad, loadSnapshots]);

  // Sync speed from persistence
  useEffect(() => {
    setPlayerSpeed(persistedSpeed);
  }, [persistedSpeed, setPlayerSpeed]);

  // Emit codeLine changes per D-05
  useEffect(() => {
    if (currentSnapshot?.codeLine && onCodeLineChange) {
      onCodeLineChange(currentSnapshot.codeLine);
    }
  }, [currentSnapshot?.codeLine, onCodeLineChange]);

  const handleSpeedChange = (newSpeed: number) => {
    setPersistedSpeed(newSpeed);
    setPlayerSpeed(newSpeed);
  };

  // Get array snapshot if available
  const arraySnapshot = currentSnapshot && isArraySnapshot(currentSnapshot.data)
    ? currentSnapshot.data
    : null;

  // Get binary tree snapshot if available
  const binaryTreeSnapshot = currentSnapshot && isBinaryTreeSnapshot(currentSnapshot.data)
    ? currentSnapshot.data
    : null;

  // Get linked list snapshot if available
  const linkedListSnapshot = currentSnapshot && isLinkedListSnapshot(currentSnapshot.data)
    ? currentSnapshot.data
    : null;

  // Get stack snapshot if available
  const stackSnapshot = currentSnapshot && isStackSnapshot(currentSnapshot.data)
    ? currentSnapshot.data
    : null;

  // Get matrix snapshot if available
  const matrixSnapshot = currentSnapshot && isMatrixSnapshot(currentSnapshot.data)
    ? currentSnapshot.data
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Step description */}
      {currentSnapshot && (
        <div className="p-3 bg-muted rounded-lg" aria-live="polite" aria-atomic="true">
          <p className="text-sm">
            <span className="font-medium text-muted-foreground mr-2">
              步骤 {currentIndex + 1}:
            </span>
            {currentSnapshot.description}
          </p>
        </div>
      )}

      {/* Visualization - Array, Linked List, Binary Tree, Stack, or Matrix */}
      <div className="border rounded-lg overflow-hidden flex justify-center">
        {arraySnapshot && <ArrayVisualizer snapshot={arraySnapshot} />}
        {linkedListSnapshot && <LinkedListVisualizer snapshot={linkedListSnapshot} />}
        {binaryTreeSnapshot && <BinaryTreeVisualizer snapshot={binaryTreeSnapshot} />}
        {stackSnapshot && <StackVisualizer snapshot={stackSnapshot} />}
        {matrixSnapshot && <MatrixVisualizer snapshot={matrixSnapshot} />}
      </div>

      {/* Controls */}
      <PlaybackControls
        isPlaying={isPlaying}
        currentIndex={currentIndex}
        totalSteps={totalSteps}
        speed={playerSpeed}
        canStepForward={canStepForward}
        canStepBackward={canStepBackward}
        onPlay={play}
        onPause={pause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        onSpeedChange={handleSpeedChange}
        onSeek={goTo}
      />
    </div>
  );
}
