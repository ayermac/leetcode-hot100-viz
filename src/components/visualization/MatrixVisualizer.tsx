'use client';

import { motion } from 'motion/react';
import { MatrixSnapshot, ElementState } from '@/lib/visualization/types';
import { cn } from '@/lib/utils';

interface MatrixVisualizerProps {
  snapshot: MatrixSnapshot;
}

const stateColors: Record<ElementState, string> = {
  normal: 'bg-card border-border',
  comparing: 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400',
  swapping: 'bg-orange-100 border-orange-500 dark:bg-orange-900 dark:border-orange-400',
  sorted: 'bg-emerald-100 border-emerald-500 dark:bg-emerald-900 dark:border-emerald-400',
  highlighted: 'bg-violet-100 border-violet-500 dark:bg-violet-900 dark:border-violet-400',
};

const CELL_SIZE = 48;

export function MatrixVisualizer({ snapshot }: MatrixVisualizerProps) {
  const { grid, cellStates, highlightedCells, currentCell } = snapshot;
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  if (rows === 0 || cols === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        空矩阵
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const key = `${rowIndex},${colIndex}`;
            const state = cellStates.get(key) || 'normal';
            const isHighlighted = highlightedCells.includes(key);
            const isCurrent = currentCell?.row === rowIndex && currentCell?.col === colIndex;
            const bgClass = stateColors[state] || stateColors.normal;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: (rowIndex * cols + colIndex) * 0.02 }}
                className={cn(
                  'flex items-center justify-center border-2 rounded-md font-mono font-semibold',
                  bgClass,
                  isHighlighted && 'ring-2 ring-violet-400 ring-offset-1',
                  isCurrent && 'ring-2 ring-purple-500 ring-offset-2'
                )}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              >
                <span className="text-sm">{cell}</span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Matrix info */}
      <div className="mt-4 text-sm text-muted-foreground">
        {rows} × {cols} 矩阵
        {currentCell && ` | 当前: (${currentCell.row}, ${currentCell.col})`}
      </div>
    </div>
  );
}
