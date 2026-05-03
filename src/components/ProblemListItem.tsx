import Link from 'next/link';
import { Problem } from '@/lib/data/types';
import { DifficultyBadge } from './DifficultyBadge';

interface ProblemListItemProps {
  problem: Problem;
}

export function ProblemListItem({ problem }: ProblemListItemProps) {
  return (
    <Link href={`/problems/${problem.id}`}>
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground w-12">
            #{problem.leetcodeId}
          </span>
          <span className="font-medium">{problem.title}</span>
        </div>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </Link>
  );
}
