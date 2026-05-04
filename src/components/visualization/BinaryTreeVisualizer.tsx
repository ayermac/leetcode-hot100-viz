'use client';

import { BinaryTreeSnapshot, ElementState } from '@/lib/visualization/types';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import React from 'react';

interface BinaryTreeVisualizerProps {
  snapshot: BinaryTreeSnapshot;
}

// Calculate positions for binary tree layout
function calculatePositions(
  nodes: BinaryTreeSnapshot['nodes'],
  containerWidth: number
): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();

  if (nodes.length === 0) return positions;

  const levelHeight = 60;

  // BFS to assign positions
  const queue: { index: number; x: number; y: number; width: number }[] = [];
  queue.push({ index: 0, x: containerWidth / 2, y: 40, width: containerWidth / 2 });

  while (queue.length > 0) {
    const { index, x, y, width } = queue.shift()!;

    if (index >= nodes.length || nodes[index] === undefined) continue;

    positions.set(index, { x, y });

    const node = nodes[index];
    const childWidth = width / 2;
    const xOffset = childWidth / 2;

    if (node.leftIndex !== null) {
      queue.push({
        index: node.leftIndex,
        x: x - xOffset,
        y: y + levelHeight,
        width: childWidth,
      });
    }

    if (node.rightIndex !== null) {
      queue.push({
        index: node.rightIndex,
        x: x + xOffset,
        y: y + levelHeight,
        width: childWidth,
      });
    }
  }

  return positions;
}

function getNodeColor(state: ElementState): string {
  switch (state) {
    case 'comparing':
      return 'bg-yellow-500 text-white border-yellow-600';
    case 'swapping':
      return 'bg-orange-500 text-white border-orange-600';
    case 'sorted':
      return 'bg-emerald-500 text-white border-emerald-600';
    case 'highlighted':
      return 'bg-violet-500 text-white border-violet-600';
    default:
      return 'bg-card text-foreground border-border';
  }
}

export function BinaryTreeVisualizer({ snapshot }: BinaryTreeVisualizerProps) {
  const { nodes, nodeStates, highlightedPath } = snapshot;
  const containerWidth = 600;
  const containerHeight = 400;

  const positions = calculatePositions(nodes, containerWidth);

  return (
    <div
      className="relative bg-muted/30 rounded-lg overflow-hidden"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <svg className="absolute inset-0 w-full h-full">
        {/* Draw edges first (behind nodes) */}
        {nodes.map((node, index) => {
          const pos = positions.get(index);
          if (!pos) return null;

          const edges: React.ReactElement[] = [];

          if (node.leftIndex !== null) {
            const leftPos = positions.get(node.leftIndex);
            if (leftPos) {
              edges.push(
                <motion.line
                  key={`edge-${index}-left`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={leftPos.x}
                  y2={leftPos.y}
                  stroke={highlightedPath.includes(index) && highlightedPath.includes(node.leftIndex)
                    ? '#8b5cf6'
                    : 'rgb(156 163 175)'}
                  strokeWidth={highlightedPath.includes(index) && highlightedPath.includes(node.leftIndex)
                    ? 3
                    : 2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            }
          }

          if (node.rightIndex !== null) {
            const rightPos = positions.get(node.rightIndex);
            if (rightPos) {
              edges.push(
                <motion.line
                  key={`edge-${index}-right`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={rightPos.x}
                  y2={rightPos.y}
                  stroke={highlightedPath.includes(index) && highlightedPath.includes(node.rightIndex)
                    ? '#8b5cf6'
                    : 'rgb(156 163 175)'}
                  strokeWidth={highlightedPath.includes(index) && highlightedPath.includes(node.rightIndex)
                    ? 3
                    : 2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              );
            }
          }

          return edges;
        })}
      </svg>

      {/* Render nodes */}
      {nodes.map((node, index) => {
        const pos = positions.get(index);
        if (!pos) return null;

        const state = nodeStates.get(index) || 'normal';
        const isInPath = highlightedPath.includes(index);

        return (
          <motion.div
            key={index}
            className={cn(
              'absolute w-12 h-12 rounded-full flex items-center justify-center',
              'text-sm font-semibold border-2 shadow-sm',
              getNodeColor(state),
              isInPath && 'ring-2 ring-violet-400 ring-offset-2'
            )}
            style={{
              left: pos.x - 24,
              top: pos.y - 24,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {node.value}
          </motion.div>
        );
      })}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          空树
        </div>
      )}
    </div>
  );
}
