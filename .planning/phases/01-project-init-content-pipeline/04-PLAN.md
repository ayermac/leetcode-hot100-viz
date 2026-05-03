# PLAN: P1-04 题目列表页

---
id: 04
wave: 4
depends_on: [01, 02, 03]
files_modified:
  - leetcode-hot100-viz/src/app/categories/[slug]/page.tsx
  - leetcode-hot100-viz/src/app/categories/[slug]/not-found.tsx
  - leetcode-hot100-viz/src/components/ProblemListItem.tsx
  - leetcode-hot100-viz/src/components/ProblemList.tsx
  - leetcode-hot100-viz/src/components/DifficultyBadge.tsx
autonomous: true
requirements: [STRUCT-02]
must_haves:
  goal: "Display problems within a category with difficulty badges and links to detail pages"
  truths:
    - "Dynamic route: /categories/[slug] where slug matches category.id"
    - "Each problem shows: ID, title, difficulty badge"
    - "Difficulty colors: easy=green, medium=yellow, hard=red, unknown=gray"
    - "Problems sorted by order field within category"
    - "Links to /problems/[id] for detail page (Phase 2)"
---

<objective>
Create the category detail page that displays all problems within a selected category. Each problem item shows the LeetCode ID, title, difficulty badge, and links to the problem detail page.
</objective>

<verification>
- [ ] `/categories/hash` displays problems in "哈希" category
- [ ] `/categories/linked-list` displays problems in "链表" category
- [ ] Each problem shows padded ID (e.g., "0001", "0206")
- [ ] Difficulty badges show correct colors
- [ ] Problems are sorted by order within category
- [ ] Clicking problem navigates to `/problems/[id]`
- [ ] 404 page shown for invalid category slug
</verification>

<tasks>
<task id="1">
<name>Create DifficultyBadge component</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts (difficulty type: 'easy' | 'medium' | 'hard' | 'unknown')
- leetcode-hot100-viz/src/components/ui/badge.tsx (shadcn Badge component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/DifficultyBadge.tsx`:

```typescript
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/DifficultyBadge.tsx` exists
- Component accepts difficulty prop of type 'easy' | 'medium' | 'hard' | 'unknown'
- Badge shows "简单" for easy (green)
- Badge shows "中等" for medium (yellow)
- Badge shows "困难" for hard (red)
- Badge shows "未知" for unknown (gray)
</acceptance_criteria>
</task>

<task id="2">
<name>Create ProblemListItem component</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts (Problem interface)
- leetcode-hot100-viz/src/components/DifficultyBadge.tsx (badge component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/ProblemListItem.tsx`:

```typescript
import Link from 'next/link';
import { Problem } from '@/lib/data/types';
import { DifficultyBadge } from './DifficultyBadge';

interface ProblemListItemProps {
  problem: Problem;
}

export function ProblemListItem({ problem }: ProblemListItemProps) {
  return (
    <Link href={`/problems/${problem.id}`}>
      <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground w-12">
            #{problem.leetcodeId}
          </span>
          <span className="font-medium">{problem.title}</span>
        </div>
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </Link>
  );
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/ProblemListItem.tsx` exists
- Component accepts Problem prop
- Displays LeetCode ID with # prefix (e.g., "#1", "#206")
- Displays problem title
- Displays difficulty badge
- Entire item is clickable and links to `/problems/${id}`
</acceptance_criteria>
</task>

<task id="3">
<name>Create ProblemList component</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/loader.ts (getProblemsByCategory function)
- leetcode-hot100-viz/src/components/ProblemListItem.tsx (item component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/components/ProblemList.tsx`:

```typescript
import { getProblemsByCategory } from '@/lib/data/loader';
import { ProblemListItem } from './ProblemListItem';

interface ProblemListProps {
  categoryId: string;
}

export function ProblemList({ categoryId }: ProblemListProps) {
  const problems = getProblemsByCategory(categoryId);

  if (problems.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        该分类下暂无题目
      </p>
    );
  }

  // Sort by order field
  const sortedProblems = [...problems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-2">
      {sortedProblems.map((problem) => (
        <ProblemListItem key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/ProblemList.tsx` exists
- Component accepts categoryId prop
- Fetches problems using getProblemsByCategory()
- Sorts problems by order field
- Shows empty state message if no problems
- Renders ProblemListItem for each problem
</acceptance_criteria>
</task>

<task id="4">
<name>Create category detail page with dynamic route</name>
<read_first>
- leetcode-hot100-viz/src/lib/data/loader.ts (getCategoryBySlug, getCategories functions)
- leetcode-hot100-viz/src/components/ProblemList.tsx (list component)
- leetcode-hot100-viz/src/components/CategoryIcon.tsx (icon component)
</read_first>
<action>
Create file `leetcode-hot100-viz/src/app/categories/[slug]/page.tsx`:

```typescript
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/app/categories/[slug]/page.tsx` exists
- Page uses dynamic route parameter [slug]
- generateStaticParams returns all category slugs
- Page shows 404 for invalid slug via notFound()
- Page displays breadcrumb navigation
- Page displays category icon and name
- Page displays problem count
- ProblemList renders with category.id
</acceptance_criteria>
</task>

<task id="5">
<name>Create 404 not-found page for categories</name>
<read_first>
- leetcode-hot100-viz/src/app/categories/[slug]/page.tsx (calls notFound())
</read_first>
<action>
Create file `leetcode-hot100-viz/src/app/categories/[slug]/not-found.tsx`:

```typescript
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
```
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/app/categories/[slug]/not-found.tsx` exists
- Page shows "分类未找到" heading
- Page has link to /categories
</acceptance_criteria>
</task>

<task id="6">
<name>Verify category pages render correctly</name>
<read_first>
- leetcode-hot100-viz/data/categories.json (all category slugs)
- leetcode-hot100-viz/data/problems.json (problems data)
</read_first>
<action>
Start development server and verify:
1. Navigate to `/categories/hash`
2. Confirm "哈希" category header with icon
3. Confirm 3 problems listed (Two Sum, Group Anagrams, Longest Consecutive Sequence)
4. Navigate to `/categories/linked-list`
5. Confirm "链表" category header
6. Verify problem list sorted by order
7. Test invalid slug `/categories/nonexistent` shows 404
</action>
<acceptance_criteria>
- Page `/categories/hash` renders with 3 problems
- Page `/categories/linked-list` renders with correct problems
- Each problem shows #ID, title, and difficulty badge
- Invalid slug `/categories/invalid` shows 404 page
- All category pages accessible from category grid
</acceptance_criteria>
</task>

<task id="7">
<name>Verify build generates all static pages</name>
<read_first>
- leetcode-hot100-viz/src/app/categories/[slug]/page.tsx (generateStaticParams)
</read_first>
<action>
Run build and verify static generation:
1. `pnpm build`
2. Check `out/categories/` directory
3. Verify each category has its own directory (hash/, linked-list/, etc.)
4. Verify each has index.html file
5. Total static pages = 16 categories + home + categories list
</action>
<acceptance_criteria>
- Command `cd leetcode-hot100-viz && pnpm build` succeeds
- Directory `out/categories/hash/` exists with `index.html`
- Directory `out/categories/linked-list/` exists with `index.html`
- All 16 category directories exist in `out/categories/`
- Build log shows all pages generated
</acceptance_criteria>
</task>
</tasks>
