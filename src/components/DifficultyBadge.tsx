import { Badge } from '@/components/ui/badge';

type Difficulty = 'easy' | 'medium' | 'hard' | 'unknown';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; className: string }> = {
  easy: { label: '简单', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  medium: { label: '中等', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  hard: { label: '困难', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
  unknown: { label: '未知', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.unknown;

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
}
