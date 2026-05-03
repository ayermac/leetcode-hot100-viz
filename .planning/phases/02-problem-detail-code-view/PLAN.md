# Phase 2: Problem Detail & Code View - Execution Plan

**Wave:** 1
**depends_on:** []
**files_modified:**
  - leetcode-hot100-viz/package.json
  - leetcode-hot100-viz/src/app/problems/[id]/page.tsx
  - leetcode-hot100-viz/src/components/Breadcrumb.tsx
  - leetcode-hot100-viz/src/components/ProblemHeader.tsx
  - leetcode-hot100-viz/src/components/ProblemDescription.tsx
  - leetcode-hot100-viz/src/components/CodeViewer.tsx
  - leetcode-hot100-viz/src/components/LanguageSelector.tsx
  - leetcode-hot100-viz/src/components/SolutionTabs.tsx
  - leetcode-hot100-viz/src/components/ui/tabs.tsx
  - leetcode-hot100-viz/src/lib/shiki.ts
  - leetcode-hot100-viz/src/lib/mdx.ts
  - leetcode-hot100-viz/src/hooks/useLanguagePreference.ts
  - leetcode-hot100-viz/src/app/globals.css
**autonomous:** true

---

## Phase Goal

实现题目详情页，包含问题描述、难度标签、多语言代码展示和语法高亮。

## must_haves

1. `/problems/[id]` 页面显示完整的题目详情（标题、难度、描述）
2. 代码块使用 Shiki 进行语法高亮，显示行号
3. 用户可以切换 Go、Python、Java 三种语言
4. 用户可以在不同解法之间切换（暴力解法/优化解法）
5. 面包屑导航正确显示路径
6. LeetCode 原题链接可点击跳转

---

## Wave 1: Dependencies & UI Primitives

### Task 1.1: Install Dependencies

<read_first>
- leetcode-hot100-viz/package.json
</read_first>

<action>
Install the following dependencies using `pnpm add`:
- `shiki` (v4.x) - for syntax highlighting
- `next-mdx-remote` (v6.x) - for markdown rendering

Add to devDependencies:
- `@shikijs/rehype` - for MDX integration with Shiki

Run: `cd leetcode-hot100-viz && pnpm add shiki next-mdx-remote @shikijs/rehype`
</action>

<acceptance_criteria>
- `package.json` contains `"shiki":` in dependencies
- `package.json` contains `"next-mdx-remote":` in dependencies
- `pnpm install` runs without errors
- `node_modules/shiki` directory exists
- `node_modules/next-mdx-remote` directory exists
</acceptance_criteria>

---

### Task 1.2: Add Tabs Component from shadcn/ui

<read_first>
- leetcode-hot100-viz/package.json
- leetcode-hot100-viz/src/components/ui/button.tsx
</read_first>

<action>
Add the Tabs component from shadcn/ui by running:
`cd leetcode-hot100-viz && pnpm dlx shadcn@latest add tabs`

This will create `src/components/ui/tabs.tsx` with the Tabs, TabsList, TabsTrigger, and TabsContent components.
</action>

<acceptance_criteria>
- `src/components/ui/tabs.tsx` file exists
- File exports `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` components
- Components use `@base-ui/react` or Radix UI primitives
- Components are styled with Tailwind CSS
</acceptance_criteria>

---

## Wave 2: Core Infrastructure

### Task 2.1: Create Shiki Highlighter Utility

<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts
- leetcode-hot100-viz/src/app/globals.css
</read_first>

<action>
Create `src/lib/shiki.ts` with the following exports:

1. `getHighlighter()` - Singleton pattern to create and cache Shiki highlighter
2. `highlightCode(code: string, language: string): Promise<string>` - Async function that returns HTML string with syntax highlighting
3. Configure with `github-dark` theme
4. Support languages: `go`, `python`, `java`

The highlighter should:
- Use `createHighlighter` from `shiki`
- Cache the highlighter instance globally
- Return HTML with inline styles for syntax colors
- Include CSS class `shiki` on the output `<pre>` element

Add CSS variables in globals.css for Shiki styling:
```css
.shiki {
  background-color: transparent !important;
  font-family: var(--font-mono), ui-monospace, monospace;
}
```
</action>

<acceptance_criteria>
- `src/lib/shiki.ts` file exists
- Exports `highlightCode` function with signature `(code: string, language: string) => Promise<string>`
- Exports `getHighlighter` function
- `highlightCode` returns HTML string starting with `<pre` and ending with `</pre>`
- Output includes `class="shiki"` on the pre element
- Supported languages: go, python, java
- `globals.css` contains `.shiki` class definition
</acceptance_criteria>

---

### Task 2.2: Create MDX Rendering Utility

<read_first>
- leetcode-hot100-viz/src/lib/shiki.ts
- leetcode-hot100-viz/src/lib/data/types.ts
</read_first>

<action>
Create `src/lib/mdx.ts` with the following exports:

1. `renderMarkdown(content: string): Promise<string>` - Async function that renders markdown to HTML
2. Configure with `remark-gfm` plugin for GitHub Flavored Markdown support
3. Configure with `@shikijs/rehype` plugin for code block syntax highlighting

The function should:
- Use `unified` pipeline with `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`
- Integrate with Shiki for code blocks (language specified in fence)
- Return sanitized HTML string
- Support tables, lists, links, code blocks, inline code

Note: Since this is a Next.js 15 project with RSC, we can use server-side rendering.

Install additional dependencies:
`cd leetcode-hot100-viz && pnpm add unified remark-parse remark-gfm remark-rehype rehype-stringify`
</action>

<acceptance_criteria>
- `src/lib/mdx.ts` file exists
- Exports `renderMarkdown` function with signature `(content: string) => Promise<string>`
- `package.json` contains `unified`, `remark-gfm`, `remark-parse`, `remark-rehype`, `rehype-stringify`
- Renders markdown tables correctly (contains `<table>` tags for table markdown)
- Renders code blocks with Shiki highlighting (contains `class="shiki"`)
- Renders links correctly (contains `<a` tags for markdown links)
</acceptance_criteria>

---

### Task 2.3: Create Language Preference Hook

<read_first>
- leetcode-hot100-viz/src/lib/data/types.ts
</read_first>

<action>
Create `src/hooks/useLanguagePreference.ts` with:

1. `useLanguagePreference()` hook that:
   - Returns current language preference (default: 'go')
   - Returns `setLanguage(lang: 'go' | 'python' | 'java')` function
   - Persists preference to localStorage with key `leetcode-viz-language`
   - Handles SSR (returns default during server render)

2. `Language` type: `'go' | 'python' | 'java'`

The hook should use `useState` with `useEffect` for hydration to avoid SSR mismatch.
</action>

<acceptance_criteria>
- `src/hooks/useLanguagePreference.ts` file exists
- Exports `useLanguagePreference` hook
- Hook returns `{ language, setLanguage }` where language is `'go' | 'python' | 'java'`
- Default language is `'go'`
- Hook handles SSR without hydration mismatch
- Setting language persists to localStorage key `leetcode-viz-language`
</acceptance_criteria>

---

## Wave 3: UI Components

### Task 3.1: Create Breadcrumb Component

<read_first>
- leetcode-hot100-viz/src/components/Header.tsx
- leetcode-hot100-viz/src/components/ui/button.tsx
- leetcode-hot100-viz/src/lib/data/loader.ts
</read_first>

<action>
Create `src/components/Breadcrumb.tsx`:

1. Accept props: `items: Array<{ label: string; href?: string }>`
2. Render as horizontal list with chevron separators (`ChevronRight` from lucide-react)
3. Clickable items should be styled as links using Next.js `Link` component
4. Last item should be non-clickable (current page)
5. Add `aria-label="breadcrumb"` for accessibility

Styling:
- Use `text-sm text-muted-foreground` for separators
- Use `text-sm font-medium` for current item
- Use `text-sm text-primary hover:underline` for clickable items
- Container uses `flex items-center gap-2`

Example usage:
```tsx
<Breadcrumb items={[
  { label: '首页', href: '/' },
  { label: '回溯', href: '/categories/backtracking' },
  { label: '全排列' }  // Current page, no href
]} />
```
</action>

<acceptance_criteria>
- `src/components/Breadcrumb.tsx` file exists
- Exports `Breadcrumb` component
- Accepts `items` prop with `{ label: string; href?: string }[]` type
- Renders `ChevronRight` icons between items
- Uses Next.js `Link` for items with `href`
- Last item (no `href`) renders as plain text with `font-medium`
- Has `aria-label="breadcrumb"` attribute
- Uses Tailwind classes: `flex`, `items-center`, `gap-2`
</acceptance_criteria>

---

### Task 3.2: Create Problem Header Component

<read_first>
- leetcode-hot100-viz/src/components/DifficultyBadge.tsx
- leetcode-hot100-viz/src/lib/data/types.ts
- leetcode-hot100-viz/src/lib/data/loader.ts
</read_first>

<action>
Create `src/components/ProblemHeader.tsx`:

1. Accept props:
   - `problem: Problem` (from types.ts)
   - `category: Category` (from types.ts)

2. Render:
   - Breadcrumb: 首页 > {category.name} > {problem.title}
   - Title: `h1` with problem title
   - LeetCode link: External link icon with text "LeetCode" linking to `https://leetcode.cn/problems/{problem.slug}/`
   - Difficulty badge: Use existing `DifficultyBadge` component
   - Tags: If problem has tags, display as small badges (optional enhancement)

3. Layout:
   - Breadcrumb at top, smaller text
   - Title in large font (`text-2xl font-bold`)
   - Metadata row with difficulty badge and LeetCode link (`flex items-center gap-4 mt-2`)

4. Use `ExternalLink` icon from lucide-react for the LeetCode link
</action>

<acceptance_criteria>
- `src/components/ProblemHeader.tsx` file exists
- Exports `ProblemHeader` component
- Accepts `problem` and `category` props
- Renders `Breadcrumb` with 3 items: 首页 > category.name > problem.title
- Renders `h1` with `text-2xl font-bold` class
- Uses `DifficultyBadge` component with `problem.difficulty`
- Renders LeetCode link with `ExternalLink` icon
- LeetCode link href follows pattern `https://leetcode.cn/problems/{slug}/`
- Metadata row uses `flex items-center gap-4` class
</acceptance_criteria>

---

### Task 3.3: Create Problem Description Component

<read_first>
- leetcode-hot100-viz/src/lib/mdx.ts
- leetcode-hot100-viz/src/lib/data/types.ts
</read_first>

<action>
Create `src/components/ProblemDescription.tsx`:

1. Accept props:
   - `description: string` - Markdown content
   - `lifeScenario?: string` - Optional life analogy section

2. Render:
   - Description section with rendered markdown
   - If `lifeScenario` exists, render as a separate section with heading "生活场景"

3. Use `renderMarkdown` from `src/lib/mdx.ts` to convert markdown to HTML
4. Render HTML using `dangerouslySetInnerHTML` (content is trusted, from our own files)
5. Wrap content in prose container for styling: `prose prose-sm dark:prose-invert max-w-none`

6. Add basic prose styles to globals.css if not using @tailwindcss/typography:
   ```css
   .prose p { margin-bottom: 1em; }
   .prose code { background: oklch(0.95 0 0); padding: 0.125em 0.25em; border-radius: 0.25em; font-size: 0.875em; }
   .prose pre { background: oklch(0.15 0 0); padding: 1em; border-radius: 0.5em; overflow-x: auto; }
   .prose ul, .prose ol { padding-left: 1.5em; margin-bottom: 1em; }
   .prose li { margin-bottom: 0.25em; }
   .prose table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
   .prose th, .prose td { border: 1px solid oklch(0.8 0 0); padding: 0.5em; }
   ```

Since this is a Server Component, make it async and await the markdown rendering.
</action>

<acceptance_criteria>
- `src/components/ProblemDescription.tsx` file exists
- Exports `ProblemDescription` component as async function
- Accepts `description` and optional `lifeScenario` props
- Uses `renderMarkdown` from `src/lib/mdx.ts`
- Renders description with `prose` class
- If `lifeScenario` provided, renders with "生活场景" heading
- `globals.css` contains `.prose` styles
</acceptance_criteria>

---

### Task 3.4: Create Language Selector Component

<read_first>
- leetcode-hot100-viz/src/hooks/useLanguagePreference.ts
- leetcode-hot100-viz/src/components/ui/button.tsx
</read_first>

<action>
Create `src/components/LanguageSelector.tsx`:

1. Accept props:
   - `availableLanguages: ('go' | 'python' | 'java')[]` - Languages that have code for current problem
   - `selectedLanguage: 'go' | 'python' | 'java'`
   - `onLanguageChange: (lang: 'go' | 'python' | 'java') => void`

2. Render as a segmented control / toggle group:
   - Three buttons: Go, Python, Java
   - Selected language has different styling (primary background)
   - Disabled languages show as grayed out with cursor-not-allowed
   - Disabled languages show tooltip "该语言暂无代码" on hover

3. Use `Button` component from shadcn/ui with `variant` prop:
   - Selected: `variant="default"`
   - Available: `variant="outline"`
   - Disabled: `variant="ghost"` with `disabled` attribute

4. Group buttons in a flex container with gap-1

5. Add title attribute for disabled buttons: `title="该语言暂无代码"`
</action>

<acceptance_criteria>
- `src/components/LanguageSelector.tsx` file exists
- Exports `LanguageSelector` component
- Accepts `availableLanguages`, `selectedLanguage`, `onLanguageChange` props
- Renders 3 buttons: Go, Python, Java
- Selected button uses `variant="default"` style
- Available (non-selected) buttons use `variant="outline"` style
- Disabled buttons have `disabled` attribute
- Disabled buttons have `title="该语言暂无代码"` attribute
- Container uses `flex gap-1` class
</acceptance_criteria>

---

### Task 3.5: Create Solution Tabs Component

<read_first>
- leetcode-hot100-viz/src/components/ui/tabs.tsx
- leetcode-hot100-viz/src/lib/data/types.ts
</read_first>

<action>
Create `src/components/SolutionTabs.tsx`:

1. Accept props:
   - `solutions: Solution[]` - Array of solutions from problem data
   - `selectedLanguage: 'go' | 'python' | 'java'`
   - `onLanguageChange: (lang: 'go' | 'python' | 'java') => void`

2. Render using shadcn/ui Tabs:
   - Each solution becomes a tab with `solution.title` as trigger text
   - Tab content includes: explanation text + code viewer

3. Tab structure:
   ```tsx
   <Tabs defaultValue={solutions[0].title}>
     <TabsList>
       {solutions.map(s => <TabsTrigger key={s.title} value={s.title}>{s.title}</TabsTrigger>)}
     </TabsList>
     {solutions.map(s => (
       <TabsContent key={s.title} value={s.title}>
         <div className="mb-4">{s.explanation}</div>
         <CodeViewer solution={s} language={selectedLanguage} onLanguageChange={onLanguageChange} />
       </TabsContent>
     ))}
   </Tabs>
   ```

4. Handle empty solutions: show "暂无题解" message
</action>

<acceptance_criteria>
- `src/components/SolutionTabs.tsx` file exists
- Exports `SolutionTabs` component
- Accepts `solutions`, `selectedLanguage`, `onLanguageChange` props
- Uses `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from shadcn/ui
- Renders one tab per solution
- Tab triggers display `solution.title`
- Tab content includes solution explanation
- Passes `solution`, `language`, `onLanguageChange` to CodeViewer
- Empty solutions shows "暂无题解" message
</acceptance_criteria>

---

### Task 3.6: Create Code Viewer Component

<read_first>
- leetcode-hot100-viz/src/lib/shiki.ts
- leetcode-hot100-viz/src/lib/data/types.ts
- leetcode-hot100-viz/src/components/LanguageSelector.tsx
- leetcode-hot100-viz/src/app/globals.css
</read_first>

<action>
Create `src/components/CodeViewer.tsx`:

1. Accept props:
   - `solution: Solution` - Contains codeBlocks array
   - `language: 'go' | 'python' | 'java'`
   - `onLanguageChange: (lang: 'go' | 'python' | 'java') => void`

2. Extract available languages from `solution.codeBlocks`
3. Find code block for selected language (or first available if selected not found)
4. Use `highlightCode` from `src/lib/shiki.ts` for syntax highlighting

5. Render structure:
   ```tsx
   <div className="rounded-lg border overflow-hidden">
     <div className="flex items-center justify-between px-4 py-2 bg-muted">
       <LanguageSelector ... />
       <CopyButton code={code} />
     </div>
     <div className="relative">
       <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 text-right pr-2 text-xs leading-6 select-none">
         {/* Line numbers */}
       </div>
       <div className="pl-14 overflow-x-auto" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
     </div>
   </div>
   ```

6. Copy Button:
   - Use `Copy` and `Check` icons from lucide-react
   - On click, copy code to clipboard
   - Show "已复制" feedback for 2 seconds
   - Position: top-right of code block

7. Line numbers:
   - Calculate from code.split('\n').length
   - Render numbers 1 to lineCount
   - Style: `text-muted-foreground font-mono text-xs`

Since this is a Server Component with async highlighting, make it async.

Add CopyButton as a separate client component in the same file or separate file.
</action>

<acceptance_criteria>
- `src/components/CodeViewer.tsx` file exists
- Exports `CodeViewer` component as async function
- Accepts `solution`, `language`, `onLanguageChange` props
- Extracts available languages from `solution.codeBlocks`
- Renders `LanguageSelector` with correct available/disabled states
- Uses `highlightCode` from `src/lib/shiki.ts`
- Renders highlighted code with `dangerouslySetInnerHTML`
- Displays line numbers on left side (1-indexed)
- Line numbers use `font-mono text-xs text-muted-foreground` classes
- Copy button renders in top-right corner
- Copy button shows "已复制" feedback for 2 seconds after click
- Container uses `rounded-lg border overflow-hidden` classes
- Code section uses `overflow-x-auto` for horizontal scrolling
</acceptance_criteria>

---

## Wave 4: Page Integration

### Task 4.1: Implement Problem Detail Page

<read_first>
- leetcode-hot100-viz/src/app/problems/[id]/page.tsx
- leetcode-hot100-viz/src/lib/data/loader.ts
- leetcode-hot100-viz/src/lib/data/types.ts
- leetcode-hot100-viz/src/components/ProblemHeader.tsx
- leetcode-hot100-viz/src/components/ProblemDescription.tsx
- leetcode-hot100-viz/src/components/SolutionTabs.tsx
- leetcode-hot100-viz/src/hooks/useLanguagePreference.ts
</read_first>

<action>
Rewrite `src/app/problems/[id]/page.tsx`:

1. Update `generateStaticParams` to return all problem IDs from `getProblems()`

2. Create the main page component as async Server Component

3. Page structure:
   ```tsx
   export default async function ProblemPage({ params }: ProblemPageProps) {
     const { id } = await params;
     const problem = getProblemById(id);
     
     if (!problem) {
       return <div>题目不存在</div>;
     }
     
     const category = getCategoryById(problem.categoryId);
     
     return (
       <div className="container py-6">
         <ProblemHeader problem={problem} category={category} />
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
           <div className="space-y-6">
             <ProblemDescription 
               description={problem.description} 
               lifeScenario={problem.lifeScenario} 
             />
           </div>
           
           <div>
             <SolutionTabsClient solutions={problem.solutions} />
           </div>
         </div>
       </div>
     );
   }
   ```

4. Create client wrapper `SolutionTabsClient` that wraps `SolutionTabs` with `useLanguagePreference` hook

5. Handle 404 case when problem not found

6. Add responsive layout: `grid-cols-1 lg:grid-cols-2` (stack on mobile, side-by-side on desktop)

7. Import styles and components properly
</action>

<acceptance_criteria>
- `src/app/problems/[id]/page.tsx` is rewritten
- `generateStaticParams` returns all problem IDs from data
- Page component is async Server Component
- Uses `getProblemById` and `getCategoryById` from loader
- Shows "题目不存在" when problem not found
- Renders `ProblemHeader` with problem and category props
- Renders two-column layout with `lg:grid-cols-2`
- Left column contains `ProblemDescription`
- Right column contains solution tabs with language switching
- Mobile-first responsive: stacks on small screens, side-by-side on large screens
- Client wrapper component uses `useLanguagePreference` hook
</acceptance_criteria>

---

## Verification

After all tasks are complete, verify:

1. **Build succeeds:**
   ```bash
   cd leetcode-hot100-viz && pnpm build
   ```

2. **Page renders correctly:**
   - Visit `/problems/0046` (first problem in data)
   - Breadcrumb shows: 首页 > 回溯 > 掌握这个模板...
   - Title, difficulty badge, LeetCode link display correctly
   - Description renders with markdown formatting
   - Code shows with syntax highlighting
   - Line numbers display correctly
   - Language selector shows 3 options (Go, Python, Java)
   - Go is enabled, others may be disabled depending on data
   - Copy button works and shows "已复制" feedback

3. **Language switching works:**
   - Click different languages (if available)
   - Code updates to show selected language
   - Selection persists after page refresh (localStorage)

4. **Responsive layout:**
   - Desktop (>1024px): Two columns side by side
   - Mobile (<1024px): Single column, stacked vertically

5. **Static generation:**
   - All problem pages are pre-generated
   - No hydration errors in console
