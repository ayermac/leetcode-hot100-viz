'use client';

import { motion } from 'motion/react';
import { ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface ArrayElementProps {
  value: number;
  index: number;
  state: ElementState;
}

const stateVariants = {
  normal: {
    scale: 1,
    backgroundColor: 'var(--muted)',
    transition: { duration: 0.2 },
  },
  comparing: {
    scale: 1.1,
    backgroundColor: 'var(--anim-comparing)',
    transition: { duration: 0.15 },
  },
  swapping: {
    scale: 1.15,
    backgroundColor: 'var(--anim-swap)',
    transition: { duration: 0.15 },
  },
  sorted: {
    scale: 1,
    backgroundColor: 'var(--anim-found)',
    transition: { duration: 0.3 },
  },
};

export function ArrayElement({ value, index, state }: ArrayElementProps) {
  return (
    <motion.div
      layout
      variants={stateVariants}
      initial="normal"
      animate={state}
      className={cn(
        'flex flex-col items-center justify-center',
        'w-14 h-14 rounded-lg',
        'text-lg font-semibold text-white',
        'shadow-md'
      )}
    >
      <span className="text-base">{value}</span>
      <span className="text-xs opacity-70 mt-0.5">{index}</span>
    </motion.div>
  );
}
