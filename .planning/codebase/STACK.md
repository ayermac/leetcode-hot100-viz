# Technology Stack

**Last Updated:** 2026-05-04

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.4 | React framework with static export |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Node.js | 20.x | Runtime environment |

## Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| tw-animate-css | 1.4.0 | Animation utilities |
| class-variance-authority | 0.7.1 | Component variants |
| clsx + tailwind-merge | 2.1.1 + 3.5.0 | Class name utilities |

## UI Components

| Library | Version | Purpose |
|---------|---------|---------|
| shadcn/ui | 4.6.0 | Component library |
| @base-ui/react | 1.4.1 | Unstyled UI primitives |
| lucide-react | 1.14.0 | Icon library |

## Animation

| Library | Version | Purpose |
|---------|---------|---------|
| Motion | 12.38.0 | Animation library (Framer Motion) |

## Content Processing

| Library | Version | Purpose |
|---------|---------|---------|
| next-mdx-remote | 6.0.0 | MDX processing |
| Shiki | 4.0.2 | Syntax highlighting |
| @shikijs/rehype | 4.0.2 | Rehype integration |
| unified + remark + rehype | 11.x | Markdown pipeline |

## Build Tools

| Tool | Purpose |
|------|---------|
| ESLint | Linting |
| ts-node | TypeScript script execution |
| PostCSS | CSS processing |

## Deployment

- **Target:** Static site generation (SSG)
- **Output:** `out/` directory
- **Platforms:** Vercel, Netlify, GitHub Pages compatible

## Data Storage

- **Format:** JSON files (`data/problems.json`, `data/categories.json`)
- **No database:** Fully static, no server-side data

## Browser APIs Used

- LocalStorage (bookmarks, theme, preferences)
- URL search params (state persistence)
- IntersectionObserver (scroll animations)
