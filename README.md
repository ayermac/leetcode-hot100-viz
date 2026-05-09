# LeetCode Hot 100 Viz

**Interactive Algorithm Visualization Learning Platform**

English | [中文](README.zh-CN.md)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-2-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Shiki](https://img.shields.io/badge/Shiki-3-1E1E1E?logo=visual-studio-code&logoColor=white)](https://shiki.style/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Visualize and interact with classic algorithms from LeetCode Hot 100. Step through execution, watch data structures transform in real time, and build intuition for core patterns.

[Features](#features) | [Quick Start](#quick-start) | [Architecture](#architecture) | [Supported Algorithms](#supported-algorithms) | [Deployment](#deployment)

---

## Features

- **100 Classic Problems** — Curated from LeetCode Hot 100 across 17 algorithm categories (hash, two pointers, sliding window, linked list, tree, graph, and more)
- **Algorithm Visualization** — Array, linked list, binary tree, stack, and matrix renderers with real-time state animation
- **Code Sync Highlighting** — Current code line highlights in sync with animation playback
- **Multi-Language Examples** — Solutions in Go, Python, and Java with Shiki syntax highlighting
- **Custom Input** — Modify test inputs and observe how the algorithm adapts
- **Playback Controls** — Play, pause, step-through, and speed adjustment
- **Search & Filter** — Real-time search by name or number, multi-dimensional filter by difficulty, category, and favorites
- **URL State Sync** — Shareable filter and selection state via URL parameters
- **Favorites** — Bookmark problems with localStorage persistence
- **Dark / Light Theme** — System-aware with manual toggle
- **Responsive Design** — Full support from mobile (320px) to desktop

## Architecture

```
                          ┌───────────────────────────┐
                          │      Next.js App Router    │
                          │     (Static Export / SPA)  │
                          └─────┬──────────────┬──────┘
                                │              │
                   ┌────────────┘              └────────────┐
                   ▼                                        ▼
          ┌─────────────────┐                    ┌───────────────────┐
          │   Pages & Layout │                   │  Visualization    │
          │  - Home / Browse │                   │  - Array Renderer │
          │  - Problem Detail│                   │  - Linked List    │
          │  - Categories    │                   │  - Binary Tree    │
          │  - Bookmarks     │                   │  - Stack / Matrix │
          └────────┬────────┘                   └──────┬────────────┘
                   │                                    │
                   ▼                                    ▼
          ┌─────────────────┐                   ┌───────────────────┐
          │  shadcn/ui +     │                   │  Executor Engine   │
          │  Tailwind CSS    │                   │  (Algorithm Steps) │
          └─────────────────┘                   └───────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | Static export, file-based routing |
| UI | React 19 | Component architecture |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Components | shadcn/ui | Accessible component primitives |
| Animation | Framer Motion (Motion) | Data structure state transitions |
| Highlight | Shiki | Syntax highlighting for code viewer |
| Language | TypeScript 5 | End-to-end type safety |

## Quick Start

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

### Installation

```bash
# Clone the repository
git clone git@github.com:your-username/leetcode-hot100-viz.git
cd leetcode-hot100-viz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
```

Static output is generated in the `out/` directory — deploy to any static file host.

### Lint

```bash
npm run lint
```

## Supported Algorithms

### Array

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Two Sum | #1 | Element state + index highlighting |
| Move Zeroes | #283 | Element swap animation |
| Container With Most Water | #11 | Pointer convergence |
| 3Sum | #15 | Triple pointer movement |

### Binary Search

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Find Minimum in Rotated Sorted Array | #153 | Search range narrowing |
| Search Insert Position | #35 | Binary search steps |

### Dynamic Programming

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Maximum Subarray | #53 | Kadane's algorithm state |

### Linked List

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Reverse Linked List | #206 | Pointer reversal animation |
| Linked List Cycle | #141 | Fast/slow pointer detection |
| Merge Two Sorted Lists | #21 | Node merge animation |
| Remove Nth Node From End | #19 | Two-pointer gap traversal |

### Binary Tree

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Binary Tree Inorder Traversal | #94 | Tree traversal highlighting |

### Sliding Window

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Longest Substring Without Repeating Characters | #3 | Window expansion/shrink |
| Minimum Window Substring | #76 | Window sliding + match check |

### Stack

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Valid Parentheses | #20 | Push/pop animation |
| Daily Temperatures | #739 | Monotonic stack build |

### Backtracking

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Permutations | #46 | Decision tree exploration |
| Subsets | #78 | Include/exclude branching |
| Letter Combinations of a Phone Number | #17 | Multi-branch tree |

### Graph

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Number of Islands | #200 | BFS/DFS flood fill |
| Rotting Oranges | #994 | Multi-source BFS spread |

### Heap

| Problem | LeetCode # | Visualization |
|---------|-----------|---------------|
| Kth Largest Element in an Array | #215 | Heap construction |
| Top K Frequent Elements | #347 | Frequency bucket sort |

## Project Structure

```
leetcode-hot100-viz/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Home — problem browser
│   │   ├── categories/               # Category listing
│   │   ├── problems/[id]/            # Problem detail + visualization
│   │   └── bookmarks/                # Saved problems
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── visualization/            # Data structure renderers
│   │   ├── CodeViewer.tsx            # Shiki-powered code display
│   │   ├── FilterPanel.tsx           # Search + filter controls
│   │   └── ...
│   ├── hooks/                        # Custom React hooks
│   └── lib/
│       ├── visualization/
│       │   ├── types.ts              # Visualization type definitions
│       │   ├── presets.ts            # Per-problem animation presets
│       │   └── executors/            # Algorithm step executors
│       └── data/                     # Data loading utilities
├── data/
│   ├── categories.json               # 17 algorithm categories
│   └── problems.json                 # 100 problem definitions
├── scripts/                          # Data parsing scripts
└── ...
```

## Deployment

The project is configured for static export (`output: 'export'`). Build output in `out/` works with any static host.

| Platform | Method |
|----------|--------|
| Vercel | One-click import from GitHub |
| Netlify | Drag & drop the `out/` directory |
| GitHub Pages | Use `gh-pages` or GitHub Actions |
| Any static server | Copy `out/` to your web root |

## Content Source

Problem descriptions and solutions are adapted from LeetCode Hot 100 for educational reference.

## License

[MIT](LICENSE)

---

**Built with Next.js + React + Tailwind CSS**
