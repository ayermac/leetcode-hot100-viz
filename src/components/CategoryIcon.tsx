'use client';

import {
  Hash,
  GitBranch,
  Scan,
  Brackets,
  Grid3x3,
  Link2,
  Network,
  RotateCcw,
  Search,
  Layers,
  Triangle,
  Target,
  Table,
  Table2,
  Lightbulb,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Hash,
  GitBranch,
  Scan,
  Brackets,
  Grid3x3,
  Link2,
  BinaryTree: Network,
  Network,
  RotateCcw,
  Search,
  Layers,
  Triangle,
  Target,
  Table,
  Table2,
  Lightbulb,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = 'w-6 h-6' }: CategoryIconProps) {
  const Icon = ICON_MAP[name] || Hash;
  return <Icon className={className} />;
}
