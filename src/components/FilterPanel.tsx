'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FilterState, Difficulty } from '@/hooks/useProblemFilter';
import { Category } from '@/lib/data/types';

interface FilterPanelProps {
  filter: FilterState;
  setFilter: (updates: Partial<FilterState>) => void;
  resetFilter: () => void;
  hasActiveFilters: boolean;
  categories: Category[];
  showBookmarkFilter?: boolean;
  className?: string;
}

const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
  { value: 'all', label: '全部难度', color: '' },
  { value: 'easy', label: '简单', color: 'bg-green-500' },
  { value: 'medium', label: '中等', color: 'bg-yellow-500' },
  { value: 'hard', label: '困难', color: 'bg-red-500' },
];

export function FilterPanel({
  filter,
  setFilter,
  resetFilter,
  hasActiveFilters,
  categories,
  showBookmarkFilter = true,
  className,
}: FilterPanelProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Difficulty Filter */}
      <div className="flex items-center gap-1">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {difficultyOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter.difficulty === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter({ difficulty: option.value })}
            className="h-7 text-xs"
          >
            {option.color && (
              <span className={cn('w-2 h-2 rounded-full mr-1', option.color)} />
            )}
            {option.label}
          </Button>
        ))}
      </div>

      {/* Category Filter */}
      <select
        value={filter.categoryId}
        onChange={(e) => setFilter({ categoryId: e.target.value })}
        className="h-7 px-2 text-xs rounded-md border bg-background"
      >
        <option value="all">全部分类</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Bookmark Filter */}
      {showBookmarkFilter && (
        <Button
          variant={filter.bookmarkedOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter({ bookmarkedOnly: !filter.bookmarkedOnly })}
          className="h-7 text-xs"
        >
          已收藏
        </Button>
      )}

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilter}
          className="h-7 text-xs text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          清除筛选
        </Button>
      )}
    </div>
  );
}
