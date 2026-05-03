import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">分类未找到</h1>
      <p className="text-muted-foreground mb-8">
        您访问的分类不存在或已被删除
      </p>
      <Link
        href="/categories"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        返回分类列表
      </Link>
    </div>
  );
}
