import { getProblemsByCategory } from '@/lib/data/loader';
import { ProblemListItem } from './ProblemListItem';

interface ProblemListProps {
  categoryId: string;
}

export function ProblemList({ categoryId }: ProblemListProps) {
  const problems = getProblemsByCategory(categoryId);

  if (problems.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        该分类下暂无题目
      </p>
    );
  }

  // Sort by order field
  const sortedProblems = [...problems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedProblems.map((problem) => (
        <ProblemListItem key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
