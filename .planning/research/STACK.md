# Stack Recommendations

**Domain:** 算法可视化学习平台 (Algorithm Visualization Learning Platform)
**Date:** 2026-04-30
**Confidence:** High

---

## Overview

This document provides prescriptive technology recommendations for building an interactive algorithm visualization learning platform with Next.js. The platform needs to support:

- **17 algorithm categories** (hash, two pointers, sliding window, linked lists, trees, graphs, etc.)
- **100 classic LeetCode problems** with visualizations
- **Multi-language code display** (Go, Python, Java)
- **Interactive animations** for arrays, linked lists, trees, and graphs
- **Static deployment** (no server required)

---

## Animation & Visualization

### Primary: Framer Motion v12.x

**Why:** Framer Motion is the best choice for algorithm animations because:

1. **Declarative API** - Define animations as props, perfect for step-by-step algorithm visualization
2. **Layout Animations** - Automatic layout transitions when data structures change (array swaps, tree rotations)
3. **Orchestration** - Built-in sequencing with `staggerChildren` for array element animations
4. **Performance** - Uses CSS transforms and opacity by default (compositor-friendly)
5. **React Integration** - First-class React hooks (`useAnimation`, `useMotionValue`)
6. **Active Development** - v12.37.0 as of April 2026, well-maintained

**Use Cases:**
- Array element highlighting, swapping, and comparisons
- Step-by-step algorithm playback with play/pause/step controls
- Smooth transitions between algorithm states
- UI animations (modals, tabs, navigation)

```tsx
// Example: Array element animation
<motion.div
  layout
  animate={{ scale: isActive ? 1.1 : 1, backgroundColor: isActive ? '#4CAF50' : '#2196F3' }}
  transition={{ duration: 0.3 }}
/>
```

### Secondary: React Flow v12.x for Graph/Tree Visualization

**Why:** For complex data structures like trees and graphs:

1. **Purpose-Built** - Designed specifically for node-based editors and interactive diagrams
2. **Built-in Interactions** - Drag, zoom, pan, select nodes out of the box
3. **Custom Nodes** - Create custom node components for tree nodes, graph vertices
4. **Layout Algorithms** - Integrates with Dagre, Elkjs for automatic tree/graph layout
5. **Performance** - Handles 100+ nodes efficiently with virtualization

**Use Cases:**
- Binary tree visualizations (BST operations, tree traversals)
- Graph algorithms (BFS, DFS, Dijkstra)
- Linked list node connections

```tsx
// Example: Custom tree node
const TreeNode = ({ data }) => (
  <motion.div
    animate={{ scale: data.highlighted ? 1.2 : 1 }}
    className="tree-node"
  >
    {data.value}
  </motion.div>
);
```

### Not Recommended: D3.js

**Why NOT to use:**

| Issue | Impact |
|-------|--------|
| Steep learning curve | Requires significant time investment for team members unfamiliar with D3 |
| Imperative API | Conflicts with React's declarative paradigm; requires careful integration |
| Overkill for this use case | Designed for complex data visualizations, not algorithm step animations |
| Bundle size | Heavy library (~100KB) for what we need |

**When to reconsider:** Only if you need complex statistical visualizations (charts, heatmaps) that Framer Motion can't handle.

---

## UI Component Library

### Primary: shadcn/ui (Latest)

**Why:** shadcn/ui is ideal for this project:

1. **Copy-Paste Components** - You own the code; no vendor lock-in; easy to customize
2. **Built on Radix UI** - Accessible by default (WAI-ARIA compliant)
3. **Tailwind CSS** - Uses Tailwind for styling (already recommended)
4. **Next.js Native** - Designed for Next.js App Router
5. **AI-Ready** - Components are easy for LLMs to understand and modify
6. **Beautiful Defaults** - Production-ready styling out of the box

**Key Components Needed:**
- `Tabs` - For switching between problem description, visualization, and code
- `Select` - For language selection (Go, Python, Java)
- `Slider` - For animation speed control
- `Button` - Play, pause, step controls
- `Dialog` - For help modals and settings
- `Card` - For problem cards and category cards
- `Badge` - For difficulty labels (Easy, Medium, Hard)
- `Command` - For search functionality (Cmd+K)

### Styling: Tailwind CSS v4.x

**Why:** Tailwind v4 (released January 2025) is a significant upgrade:

1. **5x Faster Builds** - Full builds in ~100ms, incremental in microseconds
2. **Zero Configuration** - Single line setup: `@import "tailwindcss"`
3. **CSS-First Configuration** - Customize in CSS with `@theme` directive
4. **Native Container Queries** - Built-in responsive containers
5. **Modern CSS Features** - Cascade layers, registered custom properties, `color-mix()`
6. **Automatic Content Detection** - Respects `.gitignore`, no config needed

```css
@import "tailwindcss";

@theme {
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --color-algo-active: oklch(0.7 0.2 150);
  --color-algo-comparing: oklch(0.7 0.2 50);
  --color-algo-sorted: oklch(0.7 0.2 250);
}
```

### Not Recommended: Chakra UI

**Why NOT to use:**

| Issue | Impact |
|-------|--------|
| Higher bundle size | Adds more JavaScript than needed |
| Different styling approach | Emotion-based, conflicts with Tailwind |
| Less control | Harder to customize for algorithm-specific UI |
| Overkill | Full design system when we need focused components |

---

## Markdown & Content Processing

### Primary: next-mdx-remote v6.x

**Why:** The best choice for parsing existing markdown 题解:

1. **Load from Anywhere** - Can read markdown files from the file system at build time
2. **RSC Support** - Works with React Server Components via `next-mdx-remote/rsc`
3. **Security Defaults** - v6 blocks JavaScript expressions in MDX by default
4. **Frontmatter Parsing** - Built-in support for YAML frontmatter
5. **Custom Components** - Map markdown elements to custom React components

**Usage Pattern:**

```tsx
// app/problems/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import { readFileSync } from 'fs';

const components = {
  pre: CodeBlock,
  code: InlineCode,
  // Custom algorithm visualization component
  AlgoViz: AlgorithmVisualization,
};

export default function ProblemPage({ params }) {
  const source = readFileSync(`./content/problems/${params.slug}.md`, 'utf-8');
  return <MDXRemote source={source} components={components} />;
}
```

### Supporting: remark + rehype

**Why:** For advanced markdown processing:

1. **remark** - Markdown processor for custom transformations
2. **rehype** - HTML processor for sanitization
3. **remark-gfm** - GitHub Flavored Markdown support (tables, task lists)
4. **remark-math** + **rehype-katex** - If you need math formulas (not needed for MVP)

**Plugins to include:**

```typescript
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};
```

### Not Recommended: @next/mdx

**Why NOT to use:**

| Issue | Impact |
|-------|--------|
| Requires special file structure | Forces `.mdx` files in specific directories |
| Less flexible | Can't easily load from arbitrary paths |
| Build-time only | Less control over when/how content is processed |

---

## Code Syntax Highlighting

### Primary: Shiki v4.x

**Why:** The best syntax highlighting solution:

1. **TextMate Grammar** - Same engine as VS Code; accurate highlighting
2. **Zero JavaScript** - Runs at build time; no client-side overhead
3. **Wide Language Support** - All 180+ VS Code languages including Go, Python, Java
4. **HAST-Based** - Works with rehype/remark ecosystem
5. **Customizable** - Themes, transforms, and addons

**Integration with MDX:**

```typescript
import { codeToHtml } from 'shiki';

// In MDX component
async function CodeBlock({ children, lang }) {
  const html = await codeToHtml(children, {
    lang: lang || 'text',
    theme: 'github-dark',
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**Alternative: rehype-shiki**

For direct MDX integration:

```typescript
import rehypeShiki from '@shikijs/rehype';

const options = {
  mdxOptions: {
    rehypePlugins: [[rehypeShiki, { theme: 'github-dark' }]],
  },
};
```

### Not Recommended: Prism / highlight.js

**Why NOT to use:**

| Issue | Impact |
|-------|--------|
| Client-side JavaScript | Adds bundle weight; slower initial render |
| Less accurate | Uses regex-based highlighting; can miss edge cases |
| Outdated themes | Themes don't match modern editors |

---

## Static Deployment

### Primary: Vercel

**Why:** The best choice for Next.js static deployment:

1. **Native Next.js Platform** - Zero configuration for Next.js
2. **Free Tier** - Generous free tier for static sites
3. **Global CDN** - Automatic worldwide distribution
4. **Preview Deployments** - Every PR gets a preview URL
5. **Analytics** - Built-in Web Analytics and Speed Insights
6. **Edge Functions** - If you need dynamic features later

**Static Export Configuration:**

```typescript
// next.config.ts
const config = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Ensures clean URLs
};

export default config;
```

**Build Command:**

```bash
pnpm build  # Outputs to ./out directory
```

### Alternative: GitHub Pages

**Why consider:**

1. **Free Forever** - No limits, no pricing changes
2. **Simple** - Just push to `gh-pages` branch
3. **No Account Needed** - Already using GitHub for code

**Caveats:**

| Issue | Mitigation |
|-------|------------|
| No preview URLs | Use GitHub Actions for PR previews |
| Manual configuration | More setup work than Vercel |
| Slower global delivery | Not as fast as Vercel's CDN |

### Not Recommended: Netlify

**Why NOT to use:**

| Issue | Impact |
|-------|--------|
| Redundant | Vercel is better integrated with Next.js |
| Extra configuration | More work to match Vercel features |
| No real advantage | Doesn't offer anything Vercel lacks for this use case |

---

## Complete Stack Summary

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | Next.js | 15.x | App Router, RSC, static export support |
| Animation | Framer Motion | 12.x | Declarative, layout animations, React-native |
| Graph/Tree Viz | React Flow | 12.x | Node-based diagrams, built-in interactions |
| UI Components | shadcn/ui | Latest | Accessible, Tailwind-based, own the code |
| Styling | Tailwind CSS | 4.x | Zero-config, fast builds, modern CSS |
| Markdown | next-mdx-remote | 6.x | Flexible, RSC support, security defaults |
| Syntax Highlighting | Shiki | 4.x | VS Code accuracy, zero JS, wide language support |
| Deployment | Vercel | - | Native Next.js, free tier, global CDN |

---

## What NOT to Use

| Technology | Reason | Alternative |
|------------|--------|-------------|
| D3.js | Overkill, steep learning curve, conflicts with React | Framer Motion + React Flow |
| Chakra UI | Bundle size, different styling approach | shadcn/ui + Tailwind |
| @next/mdx | Inflexible file structure | next-mdx-remote |
| Prism/highlight.js | Client-side JS, less accurate | Shiki |
| Netlify | No advantage over Vercel for Next.js | Vercel |
| React Spring | Less active development, steeper API | Framer Motion |
| vis.js | Older library, less React-friendly | React Flow |

---

## Implementation Notes

### Phase 1: Core Infrastructure

1. Initialize Next.js 15 with App Router
2. Set up Tailwind CSS v4 with `@import "tailwindcss"`
3. Install shadcn/ui components (Tabs, Button, Card, etc.)
4. Configure next-mdx-remote for content loading
5. Set up Shiki for code highlighting

### Phase 2: Visualization Components

1. Create base Array visualization with Framer Motion
2. Implement playback controls (play, pause, step, speed)
3. Add React Flow for tree/graph structures
4. Create shared animation utilities

### Phase 3: Content Integration

1. Parse existing markdown files
2. Extract frontmatter metadata
3. Create problem listing pages
4. Build category navigation

---

## Sources

- [Framer Motion Documentation](https://motion.dev/docs)
- [React Flow Documentation](https://reactflow.dev/)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [next-mdx-remote GitHub](https://github.com/hashicorp/next-mdx-remote)
- [Shiki Documentation](https://shiki.style/)
- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

*Last updated: 2026-04-30*
