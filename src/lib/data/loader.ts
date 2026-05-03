import { Category, Problem } from './types';
import categoriesData from '../../../data/categories.json';
import problemsData from '../../../data/problems.json';

export function getCategories(): Category[] {
  return categoriesData as Category[];
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find(c => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find(c => c.slug === slug);
}

export function getProblems(): Problem[] {
  return problemsData as Problem[];
}

export function getProblemById(id: string): Problem | undefined {
  return getProblems().find(p => p.id === id);
}

export function getProblemsByCategory(categoryId: string): Problem[] {
  return getProblems().filter(p => p.categoryId === categoryId);
}
