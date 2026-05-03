'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ArraySnapshot, ElementState } from '@/lib/visualization/types';
import { ArrayElement } from './ArrayElement';
import { PointerArrow } from './PointerArrow';
import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  snapshot: ArraySnapshot | null;
  className?: string;
}

const ELEMENT_WIDTH = 56; // w-14 = 56px
const ELEMENT_GAP = 8; // gap-2 = 8px

export function ArrayVisualizer({ snapshot, className }: ArrayVisualizerProps) {
  if (!snapshot) {
    return (
      <div className={cn('flex items-center justify-center h-32', className)}>
        <p className="text-muted-foreground">点击&ldquo;播放&rdquo;开始动画演示</p>
      </div>
    );
  }

  const { elements, elementStates, pointers } = snapshot;

  // Group pointers by index for offset calculation
  const pointersByIndex = pointers.reduce(
    (acc, pointer) => {
      if (!acc[pointer.index]) {
        acc[pointer.index] = [];
      }
      acc[pointer.index].push(pointer);
      return acc;
    },
    {} as Record<number, typeof pointers>
  );

  return (
    <div className={cn('py-10 px-4', className)}>
      {/* Pointers */}
      <div className="relative h-10">
        {pointers.map((pointer) => {
          const offset = pointersByIndex[pointer.index]?.indexOf(pointer) || 0;
          return (
            <PointerArrow
              key={`${pointer.name}-${pointer.index}`}
              pointer={pointer}
              elementWidth={ELEMENT_WIDTH + ELEMENT_GAP}
              offset={offset}
            />
          );
        })}
      </div>

      {/* Array elements */}
      <motion.div layout className="flex gap-2 justify-center">
        <AnimatePresence mode="popLayout">
          {elements.map((value, index) => {
            const state: ElementState = elementStates.get(index) || 'normal';
            return (
              <ArrayElement
                key={`el-${index}`}
                value={value}
                index={index}
                state={state}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
