'use client';

import { motion, AnimatePresence } from 'motion/react';
import { LinkedListSnapshot, ElementState } from '@/lib/visualization/types';
import { ListNode } from './ListNode';
import { PointerArrow } from './PointerArrow';
import { cn } from '@/lib/utils';

interface LinkedListVisualizerProps {
  snapshot: LinkedListSnapshot | null;
  className?: string;
}

const NODE_WIDTH = 80;
const NODE_GAP = 32;

export function LinkedListVisualizer({ snapshot, className }: LinkedListVisualizerProps) {
  if (!snapshot) {
    return (
      <div className={cn('flex items-center justify-center h-32', className)}>
        <p className="text-muted-foreground">点击&ldquo;播放&rdquo;开始动画演示</p>
      </div>
    );
  }

  const { nodes, nodeStates, pointers, cycleEntryIndex } = snapshot;

  // Group pointers by index for offset calculation (same pattern as ArrayVisualizer)
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

  const hasCycle = cycleEntryIndex !== null;
  const totalWidth = nodes.length * (NODE_WIDTH + NODE_GAP);

  return (
    <div className={cn('py-10 px-4', className)}>
      {/* Pointers above nodes per D-04 */}
      <div className="relative h-10">
        {pointers.map((pointer) => {
          const offset = pointersByIndex[pointer.index]?.indexOf(pointer) || 0;
          return (
            <PointerArrow
              key={`${pointer.name}-${pointer.index}`}
              pointer={pointer}
              elementWidth={NODE_WIDTH + NODE_GAP}
              offset={offset}
            />
          );
        })}
      </div>

      {/* Nodes in horizontal layout per D-01 */}
      <motion.div layout className="flex gap-8 justify-center relative">
        <AnimatePresence mode="popLayout">
          {nodes.map((node, index) => {
            const state: ElementState = nodeStates.get(index) || 'normal';
            const hasNext = node.nextIndex !== null;
            const isCycleEntry = hasCycle && index === cycleEntryIndex;

            return (
              <ListNode
                key={`node-${index}`}
                value={node.value}
                index={index}
                state={state}
                hasNext={hasNext}
                isCycleEntry={isCycleEntry}
              />
            );
          })}
        </AnimatePresence>

        {/* Cycle back arrow (dashed arc) per D-02 */}
        {hasCycle && nodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
            style={{ width: totalWidth }}
          >
            <svg
              width="100%"
              height="50"
              className="overflow-visible"
              viewBox={`0 0 ${totalWidth} 50`}
            >
              {/* Dashed arc from last node back to cycle entry */}
              <path
                d={`M ${(nodes.length - 0.5) * (NODE_WIDTH + NODE_GAP)} 0
                    Q ${(nodes.length - 0.5) * (NODE_WIDTH + NODE_GAP)} 50
                      ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP)} 0`}
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                className="text-purple-500"
              />
              {/* Arrowhead at cycle entry */}
              <polygon
                points={`${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP) - 5},5
                         ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP) + 5},5
                         ${(cycleEntryIndex! + 0.5) * (NODE_WIDTH + NODE_GAP)},15`}
                className="fill-purple-500"
              />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
