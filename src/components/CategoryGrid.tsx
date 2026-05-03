'use client';

import { getCategories } from '@/lib/data/loader';
import { CategoryCard } from './CategoryCard';

export function CategoryGrid() {
  const categories = getCategories();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
