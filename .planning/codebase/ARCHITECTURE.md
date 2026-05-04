# Architecture

**Last Updated:** 2026-05-04

## Overall Pattern

**Static Site Generation (SSG) with Client-Side Algorithm Visualization**

- Build-time: Content pre-rendered to static HTML
- Runtime: Client-side algorithm animations with generator-based executors

## Core Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Routing Layer                            │
│              Next.js App Router (Static)                     │
├─────────────────────────────────────────────────────────────┤
│                   Component Layer                            │
│    Page Components → Feature Components → UI Components      │
├─────────────────────────────────────────────────────────────┤
│                  Visualization Layer                         │
│    AlgorithmPlayer → Visualizers → Algorithm Executors       │
├─────────────────────────────────────────────────────────────┤
│                     Hooks Layer                              │
│    State Management, Animation Control, User Preferences     │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│         JSON Files → Loaders → TypeScript Types              │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Data Layer

**Files:** `src/lib/data/`, `data/`

```
data/
├── problems.json       # 100 problems with solutions
├── categories.json     # Category definitions
└── rich/               # Rich MDX content

src/lib/data/
├── loader.ts           # JSON data loader
├── richLoader.ts       # MDX content loader
├── types.ts            # Data type definitions
└── richContentTypes.ts # MDX type definitions
```

**Key Types:**
- `Problem` - Problem metadata, difficulty, tags
- `Category` - Category name, icon, problem IDs
- `AnimationSnapshot` - Algorithm state at each step

### 2. Hooks Layer

**Files:** `src/hooks/`

| Hook | Purpose |
|------|---------|
| `useAnimationPlayer` | Animation playback control |
| `useAnimationSpeed` | Speed preference |
| `useBookmarks` | Bookmark management |
| `useTheme` | Theme toggle |
| `useLanguagePreference` | Code language selection |
| `useProblemFilter` | Filter state management |
| `useProblemSearch` | Search functionality |

### 3. Visualization Layer

**Files:** `src/lib/visualization/`, `src/components/visualization/`

**Core Abstraction: Algorithm Executor**

```typescript
// Generator-based algorithm visualization
type AlgorithmExecutor = (
  input: AlgorithmInput
) => Generator<AnimationSnapshot, void, unknown>
```

**Key Concepts:**
- **AnimationSnapshot** - Immutable state at each step
- **AlgorithmExecutor** - Generator function yielding snapshots
- **AnimationPlayer** - Hook controlling playback

**Executors (12 algorithms):**
- `twoSum.ts` - Hash map visualization
- `moveZeroes.ts` - Two pointers
- `threeSum.ts` - Two pointers with sorting
- `containerWithWater.ts` - Two pointers
- `findMin.ts` - Binary search
- `searchInsert.ts` - Binary search
- `maxSubArray.ts` - Dynamic programming
- `hasCycle.ts` - Linked list cycle
- `mergeTwoLists.ts` - Linked list merge
- `removeNthFromEnd.ts` - Linked list traversal
- `reverseList.ts` - Linked list reversal

### 4. Component Layer

**Structure:**
```
src/components/
├── ui/              # shadcn/ui primitives
├── visualization/   # Algorithm visualizers
└── *.tsx            # Feature components
```

**Key Components:**
- `RichProblemView` - Main problem display
- `AlgorithmPlayer` - Animation container
- `ArrayVisualizer` - Array algorithm visualization
- `LinkedListVisualizer` - Linked list visualization
- `CodeViewer` - Syntax-highlighted code
- `FilterPanel` - Problem filtering

### 5. Routing Layer

**Files:** `src/app/`

```
src/app/
├── layout.tsx       # Root layout
├── page.tsx         # Home page (category grid)
└── problems/
    └── [id]/
        └── page.tsx # Problem detail page
```

## Data Flow

### Build-Time Flow

```
JSON Files → Static Props → Pre-rendered HTML
MDX Files → Compiled → Static HTML
```

### Runtime Flow

```
User Input → Executor Generator → AnimationSnapshots
                                        ↓
                              AnimationPlayer Hook
                                        ↓
                              Visualizer Component
```

## State Management

**No global state library.** State managed via:

1. **URL State** - Shareable filters, navigation
2. **LocalStorage** - Preferences, bookmarks
3. **React State** - Component-local state
4. **Custom Hooks** - Encapsulated state logic

## Animation Architecture

```
┌──────────────────┐
│ AlgorithmExecutor│ (Generator)
└────────┬─────────┘
         │ yields
         ▼
┌──────────────────┐
│ AnimationSnapshot│ (Immutable State)
└────────┬─────────┘
         │ consumed by
         ▼
┌──────────────────┐
│ useAnimationPlayer│ (Playback Control)
└────────┬─────────┘
         │ renders
         ▼
┌──────────────────┐
│   Visualizer     │ (React Component)
└──────────────────┘
```

## Performance Considerations

- **Static Export:** No server runtime, instant page loads
- **Code Splitting:** Automatic via Next.js
- **Animation Efficiency:** Generator-based (lazy evaluation)
- **Bundle Size:** Motion is largest dependency (~30kb gzip)

## Security Considerations

- **No server:** No server-side vulnerabilities
- **No auth:** No authentication/authorization concerns
- **XSS Prevention:** MDX sanitized at build time
- **Content Security:** Static files only

## Testing Architecture

**Current Status:** No tests

**Recommended Strategy:**
1. Unit tests for executors (pure functions)
2. Component tests for visualizers
3. E2E tests for critical paths
