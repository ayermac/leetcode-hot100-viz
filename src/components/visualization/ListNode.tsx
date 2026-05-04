'use client';

import { motion } from 'motion/react';
import { ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface ListNodeProps {
  value: number;
  index: number;
  state: ElementState;
  hasNext: boolean;  // Whether this node has a next pointer
  isCycleEntry?: boolean;  // Whether this is the entry point of a cycle
}

const stateColors: Record<ElementState, string> = {
  normal: 'bg-card border-border',
  comparing: 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400',
  swapping: 'bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400',
  sorted: 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900 dark:border-emerald-400',
  highlighted: 'bg-violet-100 border-violet-500 dark:bg-violet-900 dark:border-violet-400',
};

const NODE_WIDTH = 80;
const NODE_HEIGHT = 48;

export function ListNode({ value, index, state, hasNext, isCycleEntry }: ListNodeProps) {
  const bgClass = stateColors[state] || stateColors.normal;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-center border-2 rounded-lg overflow-hidden relative',
        bgClass,
        isCycleEntry && 'ring-2 ring-purple-400 ring-offset-2'
      )}
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      {/* Value section (left half) per D-03 */}
      <div className="flex-1 flex items-center justify-center border-r border-inherit">
        <span className="font-mono font-bold text-lg">{value}</span>
      </div>

      {/* Pointer section (right half) per D-03 */}
      <div className="flex-1 flex items-center justify-center">
        {hasNext ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">NULL</span>
        )}
      </div>

      {/* Index label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">
        [{index}]
      </div>
    </motion.div>
  );
}
