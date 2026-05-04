# Structure

**Last Updated:** 2026-05-04

## Directory Tree

```
leetcode-hot100-viz/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── problems/[id]/      # Problem detail routes
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── visualization/      # Algorithm visualizers
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAnimationPlayer.ts
│   │   ├── useAnimationSpeed.ts
│   │   ├── useBookmarks.ts
│   │   ├── useLanguagePreference.ts
│   │   ├── useProblemFilter.ts
│   │   ├── useProblemSearch.ts
│   │   └── useTheme.ts
│   │
│   └── lib/                    # Utilities and logic
│       ├── data/               # Data loading
│       │   ├── loader.ts
│       │   ├── richLoader.ts
│       │   └── types.ts
│       │
│       └── visualization/      # Algorithm logic
│           ├── executors/      # Algorithm implementations
│           ├── presets.ts      # Default inputs
│           └── types.ts        # Visualization types
│
├── data/                       # Static data
│   ├── problems.json           # 100 problems
│   ├── categories.json         # Category definitions
│   └── rich/                   # MDX content
│
├── scripts/                    # Build scripts
│   ├── parse-content.ts        # Content parser
│   └── category-mapping.ts     # Category mapping
│
├── public/                     # Static assets
│
├── out/                        # Build output (static)
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

## Source Code Structure

### Components (`src/components/`)

| File | Purpose |
|------|---------|
| `RichProblemView.tsx` | Main problem display (17.6KB) |
| `VisualizationSection.tsx` | Algorithm visualization container |
| `CodeViewer.tsx` | Syntax-highlighted code display |
| `FilterPanel.tsx` | Problem filtering UI |
| `Header.tsx` | Navigation header |
| `ThemeToggle.tsx` | Dark/light mode toggle |
| `SearchBar.tsx` | Problem search input |
| `BookmarkButton.tsx` | Bookmark toggle |
| `CategoryGrid.tsx` | Home page category cards |
| `ProblemList.tsx` | Problem list display |

### Visualization Components (`src/components/visualization/`)

| File | Purpose |
|------|---------|
| `AlgorithmPlayer.tsx` | Playback controls and container |
| `ArrayVisualizer.tsx` | Array algorithm visualization |
| `LinkedListVisualizer.tsx` | Linked list visualization |
| `ArrayElement.tsx` | Single array element |
| `ListNode.tsx` | Linked list node |
| `PointerArrow.tsx` | Pointer visualization |
| `PlaybackControls.tsx` | Play/pause/step buttons |
| `CustomInputPanel.tsx` | Custom test input |

### Algorithm Executors (`src/lib/visualization/executors/`)

| File | Algorithm | Category |
|------|-----------|----------|
| `twoSum.ts` | Two Sum | Hash |
| `moveZeroes.ts` | Move Zeroes | Two Pointers |
| `threeSum.ts` | Three Sum | Two Pointers |
| `containerWithWater.ts` | Container With Water | Two Pointers |
| `findMin.ts` | Find Minimum | Binary Search |
| `searchInsert.ts` | Search Insert Position | Binary Search |
| `maxSubArray.ts` | Maximum Subarray | Dynamic Programming |
| `hasCycle.ts` | Linked List Cycle | Linked List |
| `mergeTwoLists.ts` | Merge Two Lists | Linked List |
| `removeNthFromEnd.ts` | Remove Nth From End | Linked List |
| `reverseList.ts` | Reverse Linked List | Linked List |

### Hooks (`src/hooks/`)

| File | Lines | Purpose |
|------|-------|---------|
| `useAnimationPlayer.ts` | 107 | Animation playback state machine |
| `useProblemFilter.ts` | 95 | Filter state management |
| `useTheme.ts` | 75 | Theme toggle with persistence |
| `useBookmarks.ts` | 56 | Bookmark CRUD with LocalStorage |
| `useAnimationSpeed.ts` | 33 | Speed preference |
| `useLanguagePreference.ts` | 32 | Code language preference |
| `useProblemSearch.ts` | 33 | Search functionality |

## Key Files

### Entry Points

- `src/app/layout.tsx` - Root layout with providers
- `src/app/page.tsx` - Home page
- `src/app/problems/[id]/page.tsx` - Problem detail

### Data Loaders

- `src/lib/data/loader.ts` - JSON data loading
- `src/lib/data/richLoader.ts` - MDX content loading

### Configuration

- `next.config.ts` - Next.js config (static export)
- `tailwind.config.ts` - Tailwind config
- `tsconfig.json` - TypeScript config

## Naming Conventions

### Files

- **Components:** PascalCase (`RichProblemView.tsx`)
- **Hooks:** camelCase with `use` prefix (`useAnimationPlayer.ts`)
- **Utilities:** camelCase (`loader.ts`)
- **Types:** camelCase (`types.ts`)

### Code

- **Components:** PascalCase exports
- **Functions:** camelCase
- **Types:** PascalCase
- **Constants:** SCREAMING_SNAKE_CASE

## Import Patterns

```typescript
// UI components
import { Button } from '@/components/ui/button'

// Feature components
import { RichProblemView } from '@/components/RichProblemView'

// Hooks
import { useAnimationPlayer } from '@/hooks/useAnimationPlayer'

// Executors
import { twoSumExecutor } from '@/lib/visualization/executors/twoSum'

// Data
import { loadProblems } from '@/lib/data/loader'
```

## File Size Statistics

| Category | Files | Total Lines |
|----------|-------|-------------|
| Components | 22 | ~2,500 |
| Hooks | 7 | ~400 |
| Executors | 12 | ~1,200 |
| Data Lib | 4 | ~200 |

## Refactoring Recommendations

1. `RichProblemView.tsx` (17.6KB) - Consider splitting into smaller components
2. `useAnimationPlayer.ts` (107 lines) - Complex state machine, could extract logic
3. Executor files - Similar patterns, could use shared utilities
