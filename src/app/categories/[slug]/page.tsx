import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getCategoryBySlug } from '@/lib/data/loader';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ProblemList } from '@/components/ProblemList';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: '分类未找到' };
  }

  return {
    title: `${category.name} - LeetCode Hot 100`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="container py-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/categories" className="hover:text-foreground">分类</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CategoryIcon name={category.icon} className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        <p className="text-muted-foreground">
          {category.description} · {category.problemCount} 道题目
        </p>
      </div>
      <ProblemList categoryId={category.id} />
    </div>
  );
}
