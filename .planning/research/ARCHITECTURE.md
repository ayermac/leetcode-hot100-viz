# Architecture Design

**Domain:** 算法可视化学习平台
**Date:** 2026-04-30

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Interface Layer                           │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│   Home      │  Category   │   Problem   │ Visualizer  │     Code Viewer     │
│   Page      │    Page     │    Page     │  Component  │     Component       │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴──────────┬──────────┘
       │             │             │             │                 │
       ▼             ▼             ▼             ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Application Layer                              │
├───────────────┬───────────────┬───────────────┬───────────────────────────┤
│   Router      │  Animation    │   Content     │      User Preferences     │
│   Context     │   Controller  │   Store       │         Store             │
│  (Next.js)    │               │               │    (localStorage)         │
└───────────────┴───────────────┴───────────────┴───────────────────────────┘
       │                 │                 │                     │
       ▼                 ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               Core Layer                                    │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│ Visualization   │   Algorithm     │   Data Models   │    Content Parser     │
│   Engine        │   Executors     │   (Types)       │    (Markdown)         │
├─────────────────┴─────────────────┴─────────────────┴───────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Array     │  │   Linked    │  │    Tree     │  │    Graph    │       │
│  │ Visualizer  │  │    List     │  │ Visualizer  │  │ Visualizer  │       │
│  │             │  │ Visualizer  │  │             │  │             │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Stack/    │  │   Dynamic   │  │   Hash      │  │   Binary    │       │
│  │   Queue     │  │ Programming │  │   Table     │  │   Search    │       │
│  │ Visualizer  │  │ Visualizer  │  │ Visualizer  │  │ Visualizer  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Data Layer                                     │
├───────────────────────┬───────────────────────────────────────────────────┤
│  Static Content       │              User Data                            │
│  (Build-time)         │              (Runtime)                            │
├───────────────────────┼───────────────────────────────────────────────────┤
│  • Problems JSON      │  • Bookmarks (localStorage)                       │
│  • Categories JSON    │  • Theme preference                               │
│  • Code samples       │  • Animation speed preference                     │
│  • Test cases         │  • Last visited problem                           │
└───────────────────────┴───────────────────────────────────────────────────┘
```

## Core Components

### 1. Content Parser & Store

- **Purpose:** Transform markdown files into structured data at build time
- **Responsibilities:**
  - Parse 17 category directories
  - Extract problem metadata (title, difficulty, tags)
  - Parse code blocks by language (Go, Python, Java, etc.)
  - Generate JSON data files for static serving
- **Interfaces:**
  - `parseAllContent(): ParsedContent`
  - `parseProblem(filePath: string): Problem`
  - `extractCodeBlocks(markdown: string): CodeBlock[]`
- **Dependencies:** File system access (build-time only)

### 2. Algorithm Executor

- **Purpose:** Execute algorithms step-by-step, emitting state snapshots
- **Responsibilities:**
  - Implement algorithm logic as generator functions
  - Emit state at each significant step
  - Support step-forward, step-backward, reset operations
  - Handle algorithm-specific state structures
- **Interfaces:**
  - `execute(algorithm: Algorithm, input: Input): StepGenerator`
  - `step(): StepResult`
  - `reset(): void`
  - `getState(): AlgorithmState`
- **Dependencies:** Visualization Engine (receives state updates)

### 3. Animation Controller

- **Purpose:** Manage animation playback state and timing
- **Responsibilities:**
  - Control playback (play, pause, step, reset)
  - Manage animation speed (0.25x - 4x)
  - Track current step and total steps
  - Provide animation state to UI components
- **Interfaces:**
  - `play(): void`
  - `pause(): void`
  - `stepForward(): void`
  - `stepBackward(): void`
  - `setSpeed(rate: number): void`
  - `seekTo(step: number): void`
- **Dependencies:** React state management (useState/useReducer or Zustand)

### 4. Visualization Engine

- **Purpose:** Render algorithm state as visual components
- **Responsibilities:**
  - Map algorithm state to visual representation
  - Handle smooth transitions between states
  - Support multiple visualization types (array, tree, graph, etc.)
  - Provide interactive elements (hover, click)
- **Interfaces:**
  - `render(state: AlgorithmState): ReactNode`
  - `animate(from: State, to: State, duration: number): Animation`
- **Dependencies:**
  - Algorithm Executor (state source)
  - Visualization Components (render targets)

### 5. Visualization Components

#### ArrayVisualizer
- **Purpose:** Render array-based algorithms
- **Props:** `data: number[]`, `highlights: IndexSet`, `annotations: Annotation[]`
- **Features:**
  - Element boxes with indices
  - Color states (comparing, swapping, sorted, pivot)
  - Pointer arrows
  - Subarray highlighting

#### LinkedListVisualizer
- **Purpose:** Render linked list operations
- **Props:** `nodes: ListNode[]`, `pointers: Pointer[]`, `highlights: NodeSet`
- **Features:**
  - Node boxes with values
  - Next pointers (arrows)
  - Slow/fast pointer visualization
  - Cycle detection

#### TreeVisualizer
- **Purpose:** Render binary tree traversals and operations
- **Props:** `root: TreeNode`, `highlights: NodeSet`, `path: Node[]`
- **Features:**
  - Hierarchical node layout
  - Parent-child connections
  - Traversal path highlighting
  - Value annotations

#### GraphVisualizer
- **Purpose:** Render graph algorithms (BFS, DFS, etc.)
- **Props:** `nodes: GraphNode[]`, `edges: Edge[]`, `highlights: NodeSet`
- **Features:**
  - Grid-based layout (for grid graphs)
  - Node states (visited, current, unvisited)
  - Edge traversal animation
  - Connected component coloring

#### DPTableVisualizer
- **Purpose:** Render dynamic programming tables
- **Props:** `table: number[][]`, `current: Position`, `dependencies: Position[]`
- **Features:**
  - 2D grid visualization
  - Current cell highlighting
  - Dependency arrows
  - Value annotations

### 6. Code Viewer

- **Purpose:** Display code with syntax highlighting and step highlighting
- **Responsibilities:**
  - Syntax highlighting for multiple languages
  - Highlight current executing line
  - Support language switching
  - Copy code functionality
- **Interfaces:**
  - `render(code: string, language: string, activeLine: number): ReactNode`
- **Dependencies:** Syntax highlighting library (e.g., Prism, Shiki)

### 7. Page Components

#### HomePage
- **Route:** `/`
- **Purpose:** Landing page with category overview
- **Components:** CategoryGrid, SearchBar, FeaturedProblems

#### CategoryPage
- **Route:** `/category/[slug]`
- **Purpose:** List problems within a category
- **Components:** ProblemList, CategoryHeader, FilterBar

#### ProblemPage
- **Route:** `/problem/[id]`
- **Purpose:** Individual problem detail with visualization
- **Components:** ProblemHeader, Visualizer, CodeViewer, TestCaseInput, AnimationControls

## Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          Build-Time Flow                                  │
└──────────────────────────────────────────────────────────────────────────┘

Markdown Files ──────► Content Parser ──────► JSON Data Files
    │                      │                        │
    │ • 17 categories      │ • Extract metadata     │ • problems.json
    │ • 100 problems       │ • Parse code blocks    │ • categories.json
    │ • Multi-lang code    │ • Build search index   │ • code-samples/
    │                      │                        │
    │                      ▼                        ▼
                    Static Site Generation (Next.js)
                              │
                              ▼
                       Static HTML/JSON

┌──────────────────────────────────────────────────────────────────────────┐
│                          Runtime Flow                                     │
└──────────────────────────────────────────────────────────────────────────┘

User Input ──────► Test Case Transformer ──────► Algorithm Executor
    │                       │                          │
    │ • Custom input        │ • Parse to format       │ • Step-by-step
    │ • Preset cases        │ • Validate input        │   execution
    │                       │                          │
    │                       ▼                          ▼
    │                  Input Validation          State Snapshots
    │                                                  │
    ▼                                                  ▼
Animation Controls ◄─────────────────────── Animation Controller
    │                                                  │
    │ • Play/Pause                                     │
    │ • Speed control                                  │
    │ • Step forward/back                              │
    │                                                  │
    ▼                                                  ▼
Animation State ◄────────────────────────── State Management
    │                                                  │
    │ • currentStep                                    │
    │ • totalSteps                                     │
    │ • isPlaying                                      │
    │ • speed                                          │
    │                                                  │
    ▼                                                  │
Visualization Engine ◄─────────────────────────────────┘
    │
    │ • Select visualizer type
    │ • Transform state to visual
    │ • Animate transitions
    │
    ▼
React Components (SVG/Canvas)
    │
    │ • ArrayVisualizer
    │ • TreeVisualizer
    │ • GraphVisualizer
    │ • etc.
    │
    ▼
DOM Rendering
```

## Content Structure

### Category Schema

```typescript
interface Category {
  id: string;           // "hash", "two-pointers", "linked-list", etc.
  slug: string;         // URL-friendly: "2-哈希" -> "hash"
  name: string;         // Display name: "哈希"
  order: number;        // Display order: 2
  description: string;  // Brief description
  problemCount: number; // Number of problems
  icon: string;         // Icon identifier
}
```

### Problem Schema

```typescript
interface Problem {
  id: string;              // LeetCode problem number: "0001"
  title: string;           // "两数之和"
  slug: string;            // URL-friendly: "two-sum"
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];          // ["哈希", "数组"]
  categoryId: string;      // Parent category

  // Content
  description: string;     // HTML from markdown
  lifeExample: string;     // Life analogy section

  // Code samples
  code: {
    go: string;
    python: string;
    java: string;
    javascript?: string;
    cpp?: string;
  };

  // Visualization metadata
  visualizationType: 'array' | 'linked-list' | 'tree' | 'graph' | 'dp-table' | 'stack' | 'custom';
  defaultInput: any;       // Default test input
  testCases: TestCase[];   // Preset test cases

  // Metadata
  leetcodeUrl: string;     // Link to original problem
  order: number;           // Order within category
}

interface TestCase {
  name: string;
  input: any;
  expectedOutput: any;
}
```

### Directory Structure (Generated)

```
data/
├── categories.json          # All 17 categories
├── problems/
│   ├── index.json          # Problem list with metadata
│   ├── 0001-two-sum.json   # Full problem data
│   ├── 0011-container-with-most-water.json
│   └── ...
├── code/
│   ├── 0001/
│   │   ├── solution.go
│   │   ├── solution.py
│   │   └── solution.java
│   └── ...
└── search-index.json        # Pre-built search index
```

## Routing Structure

### Next.js App Router

```
app/
├── layout.tsx              # Root layout (theme, navigation)
├── page.tsx                # Home page
├── globals.css             # Global styles
│
├── category/
│   └── [slug]/
│       └── page.tsx        # Category listing page
│
├── problem/
│   └── [id]/
│       └── page.tsx        # Problem detail page
│
├── search/
│   └── page.tsx            # Search results page
│
└── api/                    # API routes (if needed for future features)
    └── ...
```

### URL Patterns

| Route | Description | Example |
|-------|-------------|---------|
| `/` | Home page with all categories | - |
| `/category/hash` | Hash problems list | 3 problems |
| `/category/linked-list` | Linked list problems | 14 problems |
| `/problem/0001` | Two Sum problem | Full visualization |
| `/problem/0200` | Number of Islands | Graph visualization |
| `/search?q=tree` | Search results | All tree problems |

## Visualization Engine Design

### State-Based Animation Model

```typescript
// Core abstraction: Each algorithm produces a sequence of states
interface AlgorithmState {
  step: number;
  description: string;      // Human-readable step description
  codeLine: number;         // Current line in code
  data: any;               // Algorithm-specific data
  highlights: Highlights;   // What to highlight
  annotations: Annotation[]; // Notes/arrows/etc.
}

// Example: Two Sum state
interface TwoSumState extends AlgorithmState {
  data: {
    array: number[];
    target: number;
    hashTable: Map<number, number>;
    current: { index: number; value: number };
    complement: number;
  };
  highlights: {
    currentIndex: number;
    foundIndex: number | null;
    hashKeys: number[];
  };
}
```

### Animation Controller Hook

```typescript
function useAnimationController(steps: AlgorithmState[]) {
  const [state, dispatch] = useReducer(animationReducer, {
    currentStep: 0,
    isPlaying: false,
    speed: 1,
    steps: steps,
  });

  // Playback controls
  const play = () => dispatch({ type: 'PLAY' });
  const pause = () => dispatch({ type: 'PAUSE' });
  const stepForward = () => dispatch({ type: 'STEP_FORWARD' });
  const stepBackward = () => dispatch({ type: 'STEP_BACKWARD' });
  const setSpeed = (speed: number) => dispatch({ type: 'SET_SPEED', payload: speed });
  const seekTo = (step: number) => dispatch({ type: 'SEEK', payload: step });

  // Auto-play with speed
  useEffect(() => {
    if (state.isPlaying) {
      const interval = setInterval(() => {
        dispatch({ type: 'STEP_FORWARD' });
      }, 1000 / state.speed);
      return () => clearInterval(interval);
    }
  }, [state.isPlaying, state.speed]);

  return { state, play, pause, stepForward, stepBackward, setSpeed, seekTo };
}
```

### Visualizer Selection Logic

```typescript
function selectVisualizer(type: VisualizationType) {
  switch (type) {
    case 'array':
      return ArrayVisualizer;
    case 'linked-list':
      return LinkedListVisualizer;
    case 'tree':
      return TreeVisualizer;
    case 'graph':
      return GraphVisualizer;
    case 'dp-table':
      return DPTableVisualizer;
    case 'stack':
      return StackVisualizer;
    default:
      return DefaultVisualizer;
  }
}
```

## Suggested Build Order

### Phase 1: Foundation (Week 1-2)

**1. Content Parsing Pipeline**
- Build markdown parser to extract problem data
- Generate JSON files from markdown
- Create type definitions for all data models
- **Why first:** All subsequent work depends on structured content

**2. Page Structure & Routing**
- Set up Next.js project with App Router
- Implement layout components (header, navigation, footer)
- Create category listing page
- Create problem stub page (without visualization)
- **Why second:** Provides the skeleton for feature integration

**3. Basic Problem Display**
- Problem description component
- Code viewer with syntax highlighting
- Language switching
- **Why third:** Validates content pipeline and provides base UX

### Phase 2: Core Visualization (Week 3-4)

**4. Animation State Machine**
- Implement useAnimationController hook
- Build animation controls UI (play/pause/step/speed)
- Create state snapshot data structure
- **Why first in Phase 2:** Foundation for all visualizations

**5. Array Visualizer**
- Implement array rendering (boxes, indices)
- Add color states (comparing, sorted, etc.)
- Create pointer/arrow annotations
- Implement smooth transitions
- **Why second:** Covers ~40% of problems (hash, two-pointers, sliding window, arrays)

**6. Algorithm Executors (Array-based)**
- Two Sum (hash table visualization)
- Move Zeroes (two pointers)
- Container With Most Water (two pointers)
- Maximum Subarray (Kadane's algorithm)
- **Why third:** Validates array visualizer with real algorithms

### Phase 3: Extended Visualization (Week 5-6)

**7. Linked List Visualizer**
- Node rendering with arrows
- Pointer visualization (slow/fast, prev/curr/next)
- Cycle detection display

**8. Tree Visualizer**
- Hierarchical layout algorithm
- Traversal path highlighting
- Node annotation system

**9. Graph Visualizer**
- Grid-based layout for matrix graphs
- BFS/DFS animation
- Connected component visualization

**10. Algorithm Executors (Data Structure)**
- Linked list: reverse, cycle detection, merge
- Tree: traversals, depth, LCA
- Graph: islands, BFS, DFS

### Phase 4: Advanced Features (Week 7-8)

**11. DP Table Visualizer**
- 2D grid rendering
- Dependency arrows
- Current cell highlighting

**12. Stack/Queue Visualizer**
- Vertical stack rendering
- Push/pop animation
- Queue operations

**13. Interactive Features**
- Custom test case input
- Input validation
- Preset test case selection

### Phase 5: UX Enhancement (Week 9-10)

**14. Search & Filter**
- Full-text search across problems
- Filter by difficulty, category, tags
- Search results page

**15. User Preferences**
- Theme toggle (dark/light)
- Animation speed preference
- Bookmarks (localStorage)
- Last visited problem

**16. Polish & Performance**
- Loading states
- Error boundaries
- Mobile responsiveness
- Accessibility (keyboard navigation, ARIA)

## Component Dependencies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Dependency Graph                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Content Parser
      │
      ▼
Problem Data (JSON)
      │
      ├──────────────────────────────────────────────┐
      │                                              │
      ▼                                              ▼
Category Page                              Problem Page
      │                                              │
      │                                              ├──────────────────┐
      │                                              │                  │
      │                                              ▼                  ▼
      │                                      Code Viewer         Visualizer
      │                                              │                  │
      │                                              │         ┌────────┴────────┐
      │                                              │         │                 │
      │                                              │         ▼                 ▼
      │                                              │   Animation         Algorithm
      │                                              │   Controller        Executor
      │                                              │         │                 │
      │                                              │         └────────┬────────┘
      │                                              │                  │
      │                                              ▼                  ▼
      │                                         Animation State ◄── Step Snapshots
      │                                              │
      └──────────────────────────────────────────────┴───────────────────────
                                                               │
                                                               ▼
                                                        User Preferences
                                                        (localStorage)
```

## Technology Stack Recommendations

### Core Framework
- **Next.js 14+** with App Router (static export)
- **TypeScript** for type safety
- **React 18+** with hooks

### Styling
- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming
- **Framer Motion** for animations (optional, can use CSS)

### Visualization
- **SVG** for array, linked list, tree visualizations (DOM-based, easier interactivity)
- **Canvas** for large graphs (performance)
- Consider **React Flow** for graph visualization

### Code Display
- **Shiki** or **Prism** for syntax highlighting (works at build time)

### State Management
- **Zustand** for animation controller (simple, performant)
- **React Context** for user preferences
- **URL state** for shareable visualization states

### Content Processing
- **unified/remark** for markdown processing
- **gray-matter** for frontmatter extraction
- Custom AST transformers for code extraction

## Quality Considerations

### Performance
- Pre-generate all static content at build time
- Lazy load visualizers (code splitting)
- Use CSS transforms for animations (GPU accelerated)
- Debounce user input for real-time updates

### Accessibility
- Keyboard navigation for animation controls
- ARIA labels for visualization elements
- High contrast mode support
- Screen reader announcements for step descriptions

### Maintainability
- One visualizer per algorithm type
- Algorithm executors as pure functions
- Clear separation between data and presentation
- Comprehensive type definitions

---

*Architecture design informed by analysis of existing markdown content structure and standard algorithm visualization patterns.*
