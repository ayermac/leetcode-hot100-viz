import { Problem, Category } from '@/lib/data/types';
import { DifficultyBadge } from './DifficultyBadge';
import { Breadcrumb } from './Breadcrumb';
import { ExternalLink } from 'lucide-react';

interface ProblemHeaderProps {
  problem: Problem;
  category: Category;
}

export function ProblemHeader({ problem, category }: ProblemHeaderProps) {
  const breadcrumbItems = [
    { label: '首页', href: '/' },
    { label: category.name, href: `/categories/${category.slug}` },
    { label: problem.title },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center gap-4 mt-4">
        <h1 className="text-2xl font-bold">{problem.title}</h1>
        <a
          href={`https://leetcode.cn/problems/${problem.slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
          aria-label="在 LeetCode 打开（新标签页）"
        >
          <ExternalLink className="h-4 w-4" />
          LeetCode
          <span className="sr-only">（新标签页）</span>
        </a>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </div>
  );
}