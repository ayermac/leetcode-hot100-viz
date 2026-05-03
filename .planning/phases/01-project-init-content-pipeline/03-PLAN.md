# PLAN: P1-03 分类列表页

---
id: 03
wave: 3
depends_on: [01, 02]
files_modified:
  - leetcode-hot100-viz/src/app/page.tsx
  - leetcode-hot100-viz/src/app/categories/page.tsx
  - leetcode-hot100-viz/src/components/CategoryCard.tsx
  - leetcode-hot100-viz/src/components/CategoryGrid.tsx
  - leetcode-hot100-viz/src/components/CategoryIcon.tsx
  - leetcode-hot100-viz/src/components/Header.tsx
  - leetcode-hot100-viz/src/app/layout.tsx
autonomous: true
requirements: [STRUCT-01]
must_haves:
  goal: "Display 16 algorithm categories in a responsive grid with icons and problem counts"
  truths:
    - "Home page (/) shows category overview"
    - "Categories page (/categories) shows full list"
    - "Each category card links to /categories/[slug]"
    - "Lucide icons for visual identity (Hash, GitBranch, Link2, etc.)"
    - "16 categories total (not including 1-目录 which is TOC)"
---

<objective>
Create the home page and categories list page that display all 16 algorithm categories in a responsive grid layout. Each category card shows the category name, icon, problem count, and links to the category detail page.
</objective>

<verification>
- [ ] Home page `/` displays category grid
- [ ] Categories page `/categories` displays all 16 categories
- [ ] Each category card shows icon (Lucide), name, and problem count
- [ ] Clicking a category card navigates to `/categories/[slug]`
- [ ] Grid is responsive (1-2-3-4 columns at different breakpoints)
- [ ] All 16 icons render correctly
</verification>

<tasks>
<task id="1">
<name>Create icon mapping component</name>
<read_first>
- leetcode-hot100-viz/data/categories.json (generated category data with icon field)
- .planning/phases/01-project-init-content-pipeline/01-CONTEXT.md (for D-09, D-10 decisions on Lucide Icons)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/CategoryIcon.tsx`:

```typescript
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
  LucideIcon
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/CategoryIcon.tsx` exists
- Component imports all required Lucide icons
- ICON_MAP contains entries for all 16 categories
- Component renders without errors when given valid icon name
</acceptance_criteria>
</task>

<task id="2">
<name>Create CategoryCard component</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts (Category interface)
- leetcode-hot100-viz/src/components/ui/card.tsx (shadcn Card component)
- leetcode-hot100-viz/src/components/CategoryIcon.tsx (icon component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/CategoryCard.tsx`:

```typescript
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
            <div className="p-2 rounded-lg bg-primary/10">
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/CategoryCard.tsx` exists
- Component accepts Category prop
- Component renders Card with icon, name, description, problem count
- Clicking card navigates to `/categories/${slug}`
- Uses shadcn Card components
</acceptance_criteria>
</task>

<task id="3">
<name>Create CategoryGrid component</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/loader.ts (getCategories function)
- leetcode-hot100-viz/src/components/CategoryCard.tsx (card component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/CategoryGrid.tsx`:

```typescript
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/CategoryGrid.tsx` exists
- Component uses CSS Grid with responsive breakpoints (1-2-3-4 columns)
- Grid displays all 16 categories from getCategories()
- Each category renders a CategoryCard
</acceptance_criteria>
</task>

<task id="4">
<name>Create Header component</name>
<read_first>
- leetcode-hot100-viz/src/app/layout.tsx (where Header will be used)
- leetcode-hot100-viz/src/components/ui/button.tsx (for navigation buttons)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/Header.tsx`:

```typescript
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl">LeetCode Hot 100</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">
            首页
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground/80 text-foreground/60">
            分类
          </Link>
        </nav>
      </div>
    </header>
  );
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/Header.tsx` exists
- Component shows site title "LeetCode Hot 100"
- Navigation links to "/" and "/categories"
- Header is sticky at top of page
</acceptance_criteria>
</task>

<task id="5">
<name>Update root layout with Header</name>
<read_first>
- leetcode-hot100-viz/src/app/layout.tsx (current layout)
- leetcode-hot100-viz/src/components/Header.tsx (header component)
</read_first>
<action>
Modify `leetcode-hot100-viz/src/app/layout.tsx` to include Header:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeetCode Hot 100 可视化学习",
  description: "通过可视化动画学习 LeetCode Hot 100 算法题",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/app/layout.tsx` imports Header component
- Layout renders Header above main content
- Layout has flex column with min-h-screen
- metadata has Chinese title and description
</acceptance_criteria>
</task>

<task id="6">
<name>Create home page with category grid</name>
<read_first>
- leetcode-hot100-viz/src/app/page.tsx (current page)
- leetcode-hot100-viz/src/components/CategoryGrid.tsx (grid component)
</read_first>
<action>
Modify `leetcode-hot100-viz/src/app/page.tsx`:

```typescript
import { CategoryGrid } from "@/components/CategoryGrid";

export default function Home() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">LeetCode Hot 100 可视化学习</h1>
        <p className="text-muted-foreground">
          通过交互式动画深入理解经典算法，掌握 Hot 100 核心题型
        </p>
      </div>
      <section>
        <h2 className="text-2xl font-semibold mb-4">算法分类</h2>
        <CategoryGrid />
      </section>
    </div>
  );
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/app/page.tsx` renders CategoryGrid
- Page displays title and description in Chinese
- Page renders without errors at `/`
</acceptance_criteria>
</task>

<task id="7">
<name>Create categories listing page</name>
<read_first>
- leetcode-hot100-viz/src/app/categories/page.tsx (stub created in P1-01)
- leetcode-hot100-viz/src/components/CategoryGrid.tsx (grid component)
</read_first>
<action>
Modify `leetcode-hot100-viz/src/app/categories/page.tsx`:

```typescript
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/app/categories/page.tsx` renders CategoryGrid
- Page displays title
- Page accessible at `/categories/`
</acceptance_criteria>
</task>

<task id="8">
<name>Verify all category cards render correctly</name>
<read_first>
- leetcode-hot100-viz/data/categories.json (data source)
- leetcode-hot100-viz/src/components/CategoryCard.tsx (card component)
</read_first>
<action>
Start development server and verify:
1. Navigate to `/`
2. Confirm 16 category cards are displayed
3. Verify each card shows:
   - Correct icon (from Lucide)
   - Chinese category name
   - Problem count
4. Click each card and verify navigation to `/categories/[slug]`
</action>
<acceptance_criteria>
- Command `cd leetcode-hot100-viz && pnpm dev` starts server successfully
- Page at `/` shows exactly 16 category cards
- Each card displays icon, name, description, problem count
- All cards are clickable and navigate to correct URL
- No console errors in browser
</acceptance_criteria>
</task>

<task id="9">
<name>Verify responsive layout</name>
<read_first>
- leetcode-hot100-viz/src/components/CategoryGrid.tsx (grid classes)
</read_first>
<action>
Test responsive breakpoints using browser dev tools:
1. Mobile (375px): 1 column
2. Tablet (640px-1024px): 2 columns
3. Desktop (1024px-1280px): 3 columns
4. Large Desktop (1280px+): 4 columns
</action>
<acceptance_criteria>
- Grid shows 1 column at 375px width
- Grid shows 2 columns at 768px width
- Grid shows 3 columns at 1024px width
- Grid shows 4 columns at 1440px width
- No horizontal overflow at any breakpoint
</acceptance_criteria>
</task>
</tasks>
