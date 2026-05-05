'use client';

import Link from 'next/link';
import { Category } from '@/lib/data/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10" aria-hidden="true">
              <CategoryIcon name={category.icon} className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">{category.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {category.description}
          </p>
          <p className="text-sm font-medium">
            {category.problemCount} 道题目
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
