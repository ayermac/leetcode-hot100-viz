# Integrations

**Last Updated:** 2026-05-04

## Overview

This is a **fully static site** with no external API integrations, databases, or authentication. All data is loaded at build time from JSON files.

## Build-Time Integrations

### Content Pipeline

```
MDX Files → next-mdx-remote → Shiki Highlighting → Static HTML
JSON Data → TypeScript Loader → Static Props
```

| Integration | Stage | Purpose |
|-------------|-------|---------|
| next-mdx-remote | Build | Compile MDX to React components |
| Shiki | Build | Syntax highlighting for code blocks |
| remark-gfm | Build | GitHub-flavored markdown |
| rehype-stringify | Build | HTML serialization |

### Data Loading

```
data/problems.json → src/lib/data/loader.ts → Static Props
data/categories.json → src/lib/data/loader.ts → Static Props
data/rich/ → src/lib/data/richLoader.ts → MDX Content
```

## Runtime Integrations

### Next.js Static Export

```typescript
// next.config.ts
output: 'export'
```

- No server-side rendering
- All pages pre-generated at build time
- Client-side navigation

### Tailwind CSS 4

- PostCSS integration via `@tailwindcss/postcss`
- Utility classes for styling
- Custom animations via `tw-animate-css`

### shadcn/ui

- Copy-paste components in `src/components/ui/`
- Radix-based primitives via `@base-ui/react`
- Variant system via `class-variance-authority`

### Motion (Framer Motion)

- Animation orchestrations
- Scroll-triggered animations
- Layout animations

### Shiki

- Runtime syntax highlighting
- Theme-aware colors
- Multi-language support

## Data Integrations

### LocalStorage

| Key | Type | Purpose |
|-----|------|---------|
| `leetcode-bookmarks` | string[] | Bookmarked problem IDs |
| `leetcode-theme` | 'light' \| 'dark' | Theme preference |
| `leetcode-language` | string | Preferred code language |
| `leetcode-speed` | number | Animation playback speed |

### URL State

- Search params for shareable filters
- Problem navigation via dynamic routes

## Module System

### Path Aliases

```typescript
// tsconfig.json
"paths": {
  "@/*": ["./src/*"]
}
```

### Import Patterns

```typescript
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/useBookmarks'
import { twoSumExecutor } from '@/lib/visualization/executors/twoSum'
```

## Testing

**Current Status:** No test framework configured.

**Recommended Setup:**
- Vitest for unit tests
- Playwright for E2E tests
- @testing-library/react for component tests
