'use client';

import { motion } from 'motion/react';
import { Pointer } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface PointerArrowProps {
  pointer: Pointer;
  elementWidth: number;
  offset?: number; // Vertical offset for multiple pointers at same index
}

const pointerColors: Record<string, string> = {
  left: 'text-blue-600',
  right: 'text-purple-600',
  i: 'text-green-600',
  j: 'text-orange-600',
  mid: 'text-red-600',
  write: 'text-cyan-600',
  found: 'text-emerald-600',
};

export function PointerArrow({ pointer, elementWidth, offset = 0 }: PointerArrowProps) {
  const leftPosition = pointer.index * elementWidth + elementWidth / 2;
  const colorClass = pointerColors[pointer.name] || 'text-gray-600';

  return (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: leftPosition - elementWidth / 2,
        opacity: 1,
        y: offset * -24,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'absolute -top-8 flex flex-col items-center',
        'text-sm font-medium',
        colorClass
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="mb-0.5"
        fill="currentColor"
      >
        <path d="M8 12L3 6h10L8 12z" />
      </svg>
      <span className="font-mono">{pointer.name}</span>
    </motion.div>
  );
}
