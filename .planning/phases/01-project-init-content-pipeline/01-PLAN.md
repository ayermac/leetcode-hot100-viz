# PLAN: P1-01 项目初始化

---
id: 01
wave: 1
depends_on: []
files_modified:
  - leetcode-hot100-viz/package.json
  - leetcode-hot100-viz/next.config.ts
  - leetcode-hot100-viz/tsconfig.json
  - leetcode-hot100-viz/tailwind.config.ts
  - leetcode-hot100-viz/src/app/layout.tsx
  - leetcode-hot100-viz/src/app/page.tsx
  - leetcode-hot100-viz/src/app/globals.css
autonomous: true
requirements: [STRUCT-01]
must_haves:
  goal: "Create Next.js 15 project with static export configuration, Tailwind CSS 4, and shadcn/ui foundation"
  truths:
    - "Project root is leetcode-hot100-viz/ subdirectory (not root of repo)"
    - "Static export via output: 'export' in next.config.ts"
    - "Tailwind CSS 4 with zero-config setup"
    - "shadcn/ui components initialized"
---

<objective>
Initialize Next.js 15 project with App Router, configure static export, set up Tailwind CSS 4 styling, and install shadcn/ui base components. This establishes the foundation for all subsequent development.
</objective>

<verification>
- [ ] `pnpm dev` starts development server on localhost:3000
- [ ] `pnpm build` succeeds and outputs to `out/` directory
- [ ] Tailwind utility classes work in components
- [ ] shadcn/ui Button component renders correctly
- [ ] Static export works (no server-side features used)
</verification>

<tasks>
<task id="1">
<name>Create Next.js project directory</name>
<read_first>
- .planning/phases/01-project-init-content-pipeline/01-CONTEXT.md (for D-01 decision on project location)
</read_first>
<action>
Create directory `leetcode-hot100-viz/` at repository root. This is an independent Next.js project subdirectory, NOT the repo root itself. The parent repo contains markdown content that will be parsed as data source.
</action>
<acceptance_criteria>
- Directory `leetcode-hot100-viz/` exists at repo root level
- Directory is empty before Next.js initialization
- Command `ls -la leetcode-hot100-viz/` shows the new directory
</acceptance_criteria>
</task>

<task id="2">
<name>Initialize Next.js 15 with TypeScript and Tailwind</name>
<read_first>
- .planning/research/STACK.md (for Next.js 15 and Tailwind CSS 4 recommendations)
</read_first>
<action>
Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm` inside `leetcode-hot100-viz/` directory. This creates Next.js 15 project with:
- TypeScript enabled
- Tailwind CSS enabled
- ESLint enabled
- App Router (src/app/)
- src/ directory structure
- Import alias "@/*"
- pnpm as package manager
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/package.json` exists with "next": "15.x.x" dependency
- File `leetcode-hot100-viz/src/app/layout.tsx` exists
- File `leetcode-hot100-viz/src/app/page.tsx` exists
- File `leetcode-hot100-viz/tailwind.config.ts` exists
- Command `cd leetcode-hot100-viz && pnpm dev` starts server without errors
</acceptance_criteria>
</task>

<task id="3">
<name>Configure static export in next.config.ts</name>
<read_first>
- leetcode-hot100-viz/next.config.ts (current config to modify)
- .planning/research/STACK.md (for static export configuration pattern)
</read_first>
<action>
Modify `leetcode-hot100-viz/next.config.ts` to add:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```
This enables static HTML export for deployment to any static host.
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/next.config.ts` contains `output: 'export'`
- File `leetcode-hot100-viz/next.config.ts` contains `images: { unoptimized: true }`
- File `leetcode-hot100-viz/next.config.ts` contains `trailingSlash: true`
- Command `cd leetcode-hot100-viz && pnpm build` succeeds and creates `out/` directory
</acceptance_criteria>
</task>

<task id="4">
<name>Install Lucide Icons for category icons</name>
<read_first>
- leetcode-hot100-viz/package.json (current dependencies)
- .planning/phases/01-project-init-content-pipeline/01-CONTEXT.md (for D-09 decision on Lucide Icons)
</read_first>
<action>
Run `pnpm add lucide-react` inside `leetcode-hot100-viz/`. Lucide React provides the icon library for category icons (Hash, GitBranch, Link2, etc. per D-10 mapping).
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/package.json` contains "lucide-react" in dependencies
- Command `cd leetcode-hot100-viz && pnpm list lucide-react` shows installed package
</acceptance_criteria>
</task>

<task id="5">
<name>Initialize shadcn/ui</name>
<read_first>
- leetcode-hot100-viz/package.json (current dependencies)
- leetcode-hot100-viz/src/app/globals.css (for CSS variables setup)
- .planning/research/STACK.md (for shadcn/ui recommendations)
</read_first>
<action>
Run `pnpm dlx shadcn@latest init` inside `leetcode-hot100-viz/` with options:
- Style: Default
- Base color: Slate
- CSS variables: Yes

This sets up shadcn/ui with:
- components.json configuration
- CSS variables in globals.css
- Utils for cn() helper
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/components.json` exists
- File `leetcode-hot100-viz/src/lib/utils.ts` exists with cn() function
- File `leetcode-hot100-viz/src/app/globals.css` contains CSS variables (--background, --foreground, etc.)
</acceptance_criteria>
</task>

<task id="6">
<name>Add shadcn/ui base components</name>
<read_first>
- leetcode-hot100-viz/components.json (shadcn configuration)
- leetcode-hot100-viz/src/lib/utils.ts (required for components)
</read_first>
<action>
Run `pnpm dlx shadcn@latest add button card badge` inside `leetcode-hot100-viz/`. These components are needed for:
- Button: Navigation and actions
- Card: Category and problem cards
- Badge: Difficulty labels (Easy/Medium/Hard)
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/ui/button.tsx` exists
- File `leetcode-hot100-viz/src/components/ui/card.tsx` exists
- File `leetcode-hot100-viz/src/components/ui/badge.tsx` exists
- Each component exports correct TypeScript types
</acceptance_criteria>
</task>

<task id="7">
<name>Create project directory structure</name>
<read_first>
- leetcode-hot100-viz/src/app/ (current app structure)
- .planning/research/ARCHITECTURE.md (for directory structure design)
</read_first>
<action>
Create the following directories under `leetcode-hot100-viz/`:
- `src/app/categories/page.tsx` - Categories list page
- `src/app/categories/[slug]/page.tsx` - Category detail page (problems list)
- `src/app/problems/[id]/page.tsx` - Problem detail page (stub for Phase 2)
- `src/lib/data/` - Data loading utilities
- `scripts/` - Content parsing scripts
- `data/` - Generated JSON data (gitignored)

Create placeholder page.tsx files with basic "Coming Soon" content.
</action>
<acceptance_criteria>
- Directory `leetcode-hot100-viz/src/app/categories/` exists
- Directory `leetcode-hot100-viz/src/app/problems/` exists
- Directory `leetcode-hot100-viz/src/lib/data/` exists
- Directory `leetcode-hot100-viz/scripts/` exists
- Directory `leetcode-hot100-viz/data/` exists
- File `leetcode-hot100-viz/src/app/categories/page.tsx` exists with valid React component
</acceptance_criteria>
</task>

<task id="8">
<name>Configure data directory in gitignore</name>
<read_first>
- leetcode-hot100-viz/.gitignore (current gitignore)
</read_first>
<action>
Add the following to `leetcode-hot100-viz/.gitignore`:
```
# Generated data (parsed from markdown)
data/
```
The data/ directory contains generated JSON that can be regenerated from source markdown, so it should not be committed.
</action>
<acceptance_criteria>
- File `leetcode-hot100-viz/.gitignore` contains "data/" entry
- Command `cd leetcode-hot100-viz && git status --ignored 2>/dev/null | grep -q "data/" || echo "gitignore configured"` succeeds
</acceptance_criteria>
</task>

<task id="9">
<name>Verify build and development workflow</name>
<read_first>
- leetcode-hot100-viz/package.json (for scripts)
- leetcode-hot100-viz/next.config.ts (for static export config)
</read_first>
<action>
Run verification commands:
1. `pnpm build` - Should succeed and create `out/` directory with static HTML
2. Verify `out/index.html` exists
3. Verify no dynamic server features are used (check for no "use server" directives)
</action>
<acceptance_criteria>
- Command `cd leetcode-hot100-viz && pnpm build` exits with code 0
- Directory `leetcode-hot100-viz/out/` exists after build
- File `leetcode-hot100-viz/out/index.html` exists
- File `leetcode-hot100-viz/out/_next/static/` exists (static assets)
</acceptance_criteria>
</task>
</tasks>
