import { Badge } from '@/components/ui/badge';

type Difficulty = 'easy' | 'medium' | 'hard' | 'unknown';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: '简单', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100' },
  medium: { label: '中等', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100' },
  hard: { label: '困难', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 hover:bg-rose-100' },
  unknown: { label: '未知', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-400 hover:bg-slate-100' },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.unknown;

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
