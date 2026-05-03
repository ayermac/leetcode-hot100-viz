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
    backgroundColor: 'oklch(0.7 0 0)', // gray-500 equivalent
    transition: { duration: 0.2 },
  },
  comparing: {
    scale: 1.1,
    backgroundColor: 'oklch(0.6 0.2 250)', // blue-500
    transition: { duration: 0.15 },
  },
  swapping: {
    scale: 1.15,
    backgroundColor: 'oklch(0.7 0.2 40)', // orange-500
    transition: { duration: 0.15 },
  },
  sorted: {
    scale: 1,
    backgroundColor: 'oklch(0.65 0.2 145)', // green-500
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
