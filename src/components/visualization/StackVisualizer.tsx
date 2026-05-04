'use client';

import { motion, AnimatePresence } from 'motion/react';
import { StackSnapshot, ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface StackVisualizerProps {
  snapshot: StackSnapshot;
}

const stateColors: Record<ElementState, string> = {
  normal: 'bg-card border-border',
  comparing: 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400',
  swapping: 'bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400',
  sorted: 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900 dark:border-emerald-400',
  highlighted: 'bg-violet-100 border-violet-500 dark:bg-violet-900 dark:border-violet-400',
};

const STACK_ELEMENT_WIDTH = 120;
const STACK_ELEMENT_HEIGHT = 48;

export function StackVisualizer({ snapshot }: StackVisualizerProps) {
  const { elements, elementStates, topPointer } = snapshot;

  return (
    <div className="flex flex-col items-center p-4 min-h-[300px]">
      {/* Stack container */}
      <div className="relative">
        {/* Stack base */}
        <div className="border-b-4 border-l-4 border-r-4 border-muted-foreground/30 rounded-b-lg" style={{ width: STACK_ELEMENT_WIDTH + 16 }} />

        {/* Stack elements (bottom to top) */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1">
          <AnimatePresence mode="popLayout">
            {elements.map((element, index) => {
              const state = elementStates.get(index) || 'normal';
              const isTop = index === topPointer;
              const bgClass = stateColors[state] || stateColors.normal;

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn(
                    'flex items-center justify-center border-2 rounded-lg font-mono font-bold text-lg',
                    bgClass,
                    isTop && 'ring-2 ring-purple-400 ring-offset-2'
                  )}
                  style={{ width: STACK_ELEMENT_WIDTH, height: STACK_ELEMENT_HEIGHT }}
                >
                  <span>{element}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Top pointer arrow */}
        {elements.length > 0 && topPointer >= 0 && (
          <motion.div
            className="absolute right-0 flex items-center"
            style={{ bottom: topPointer * (STACK_ELEMENT_HEIGHT + 4) + STACK_ELEMENT_HEIGHT / 2 + 4 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-semibold text-purple-500 mr-1">TOP</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-purple-500">
              <path d="M0 10l10-5v10z" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Empty state */}
      {elements.length === 0 && (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          栈为空
        </div>
      )}

      {/* Stack info */}
      <div className="mt-4 text-sm text-muted-foreground">
        元素数量: {elements.length}
        {elements.length > 0 && ` | 栈顶索引: ${topPointer}`}
      </div>
    </div>
  );
}
