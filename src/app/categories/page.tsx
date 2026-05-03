import { CategoryGrid } from "@/components/CategoryGrid";

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">算法分类</h1>
        <p className="text-muted-foreground">
          选择一个分类开始学习
        </p>
      </div>
      <CategoryGrid />
    </div>
  );
}
