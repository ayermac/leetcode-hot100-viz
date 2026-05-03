---
phase: "04"
plan: "05-code-sync"
type: execute
wave: 4
depends_on: ["01-core-types", "04-custom-input"]
files_modified:
  - src/components/CodeViewer.tsx
  - src/app/problems/[id]/ProblemPageClient.tsx
  - src/components/visualization/AlgorithmPlayer.tsx
  - src/components/VisualizationSection.tsx
files_created:
  - src/components/visualization/CodeSyncViewer.tsx
autonomous: true
requirements: [VIZ-05]
---

# Plan 05: Code Synchronization and Final Integration

## Objective

Implement code line highlighting synchronized with animation steps, and finalize the layout with code above and animation below. Add step description display below the animation.

## Tasks

### Task 1: Create CodeSyncViewer component with line highlighting

<read_first>
- `leetcode-hot100-viz/src/components/CodeViewer.tsx` — Current CodeViewer implementation (check highlightCode usage, LineNumbers component, CopyButton)
- `leetcode-hot100-viz/src/lib/shiki.ts` — For highlightCode function signature
</read_first>

<action>
Create file `leetcode-hot100-viz/src/components/visualization/CodeSyncViewer.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { highlightCode } from '@/lib/shiki';
import { Language } from '@/hooks/useLanguagePreference';
import { cn } from '@/lib/utils';

interface CodeSyncViewerProps {
  code: string;
  language: Language;
  highlightLine: number;  // 1-indexed, 0 means no highlight
  className?: string;
}

function LineNumbers({ count, highlightLine }: { count: number; highlightLine: number }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 text-right pr-2 text-xs leading-6 select-none font-mono text-muted-foreground overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i + 1}
          className={cn(
            'px-2',
            highlightLine === i + 1 && 'bg-yellow-200 dark:bg-yellow-800 text-foreground font-bold'
          )}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export async function CodeSyncViewer({ code, language, highlightLine, className }: CodeSyncViewerProps) {
  const lineCount = code.split('\n').length;
  const highlightedCode = await highlightCode(code, language);
  const codeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to highlighted line per D-05
  useEffect(() => {
    if (highlightLine > 0 && codeRef.current) {
      const lineElements = codeRef.current.querySelectorAll('.line');
      const targetLine = lineElements[highlightLine - 1];
      if (targetLine) {
        targetLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightLine]);

  return (
    <div className={cn('rounded-lg border overflow-hidden', className)} ref={codeRef}>
      <div className="relative">
        <LineNumbers count={lineCount} highlightLine={highlightLine} />
        <div
          className={cn(
            'pl-14 overflow-x-auto py-1',
            '[&_.line]:px-1',
            highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:bg-yellow-100`,
            highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:dark:bg-yellow-900`
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
```
</action>

<acceptance_criteria>
- File `leetcode-hot100-viz/src/components/visualization/CodeSyncViewer.tsx` exists
- Component accepts props: `code: string`, `language: Language`, `highlightLine: number`, `className?: string`
- `LineNumbers` component highlights the current line with yellow background per D-05 (`bg-yellow-200 dark:bg-yellow-800`)
- `useEffect` with `highlightLine` dependency auto-scrolls to highlighted line per D-05
- TypeScript compilation passes
</acceptance_criteria>

### Task 2: Update CodeViewer to support highlightLine prop

<read_first>
- `leetcode-hot100-viz/src/components/CodeViewer.tsx` — Current implementation (check interface `CodeViewerProps`, `LineNumbers` function signature)
</read_first>

<action>
Modify `CodeViewer.tsx` to accept optional `highlightLine` prop:

1. Update `CodeViewerProps` interface (around line 11-14):
```typescript
interface CodeViewerProps {
  solution: Solution;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  highlightLine?: number;  // NEW: optional, defaults to 0
}
```

2. Update the component function signature (around line 55):
```typescript
export async function CodeViewer({ 
  solution, 
  language, 
  onLanguageChange, 
  highlightLine = 0 
}: CodeViewerProps) {
```

3. Modify `LineNumbers` component (around line 45-53) to accept `highlightLine`:
```typescript
function LineNumbers({ count, highlightLine }: { count: number; highlightLine: number }) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 text-right pr-2 text-xs leading-6 select-none font-mono text-muted-foreground">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i + 1}
          className={cn(
            'px-2',
            highlightLine === i + 1 && 'bg-yellow-200 dark:bg-yellow-800 text-foreground font-bold'
          )}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
```

4. Update `LineNumbers` call (around line 86):
```typescript
<LineNumbers count={lineCount} highlightLine={highlightLine} />
```

5. Update the code container div (around line 87-91) to add line highlighting:
```typescript
<div
  className={cn(
    'pl-14 overflow-x-auto py-1',
    '[&_.line]:px-1',
    highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:bg-yellow-100`,
    highlightLine > 0 && `[&_.line:nth-child(${highlightLine})]:dark:bg-yellow-900`
  )}
  dangerouslySetInnerHTML={{ __html: highlightedCode }}
/>
```
</action>

<acceptance_criteria>
- `CodeViewerProps` interface includes `highlightLine?: number`
- Component function signature includes `highlightLine = 0` default parameter
- `LineNumbers` component accepts and uses `highlightLine` prop with yellow highlighting
- Code container has CSS classes for highlighting the specified line
- TypeScript compilation passes
</acceptance_criteria>

### Task 3: Update VisualizationSection to emit codeLine changes

<read_first>
- `leetcode-hot100-viz/src/components/VisualizationSection.tsx` — Current implementation
- `leetcode-hot100-viz/src/hooks/useAnimationPlayer.ts` — Returns `currentSnapshot` which contains `codeLine`
</read_first>

<action>
Modify `VisualizationSection.tsx`:

1. Add `onCodeLineChange` prop to interface:
```typescript
interface VisualizationSectionProps {
  problemId: string;
  onCodeLineChange?: (line: number) => void;  // NEW
}
```

2. Update component signature:
```typescript
export function VisualizationSection({ problemId, onCodeLineChange }: VisualizationSectionProps) {
```

3. Use `useAnimationPlayer` directly instead of `AlgorithmPlayer` to access `currentSnapshot`:
```typescript
const { currentSnapshot, ...playerState } = useAnimationPlayer();

// Load snapshots
useEffect(() => {
  const snapshots = getSnapshotsForProblem(problemId, customInput);
  playerState.loadSnapshots(snapshots);
}, [problemId, customInput]);
```

4. Add `useEffect` to emit codeLine changes:
```typescript
useEffect(() => {
  if (currentSnapshot?.codeLine && onCodeLineChange) {
    onCodeLineChange(currentSnapshot.codeLine);
  }
}, [currentSnapshot?.codeLine, onCodeLineChange]);
```

5. Render components separately (ArrayVisualizer or LinkedListVisualizer + PlaybackControls + step description)
</action>

<acceptance_criteria>
- `VisualizationSectionProps` includes `onCodeLineChange?: (line: number) => void`
- Component uses `useAnimationPlayer` hook directly to access `currentSnapshot`
- `useEffect` calls `onCodeLineChange(currentSnapshot.codeLine)` when codeLine changes
- TypeScript compilation passes
</acceptance_criteria>

### Task 4: Add step description display below animation

<read_first>
- `leetcode-hot100-viz/src/components/visualization/AlgorithmPlayer.tsx` — Check current JSX structure
- `leetcode-hot100-viz/src/components/VisualizationSection.tsx` — Where description will be rendered
</read_first>

<action>
Modify `VisualizationSection.tsx` to show step description per D-07:

Add description display after the visualizer:
```tsx
{/* Step description per D-07 */}
{currentSnapshot && (
  <div className="mt-4 p-3 bg-muted rounded-lg">
    <p className="text-sm text-center text-foreground">
      {currentSnapshot.description}
    </p>
  </div>
)}
```

This should be placed after the visualizer (ArrayVisualizer or LinkedListVisualizer) but before or after PlaybackControls.
</action>

<acceptance_criteria>
- `VisualizationSection` displays `currentSnapshot.description` below the animation area per D-07
- Description container uses `bg-muted rounded-lg` styling
- Text is centered with `text-sm` size
- Description updates when animation step changes
</acceptance_criteria>

### Task 5: Update ProblemPageClient for code+animation layout

<read_first>
- `leetcode-hot100-viz/src/app/problems/[id]/ProblemPageClient.tsx` — Current page structure with Tabs
- `leetcode-hot100-viz/src/components/CodeViewer.tsx` — For usage reference
</read_first>

<action>
Modify `ProblemPageClient.tsx` to implement code-above-animation-below layout per D-06:

1. Add state for current code line:
```typescript
const [currentCodeLine, setCurrentCodeLine] = useState(0);
```

2. Replace the Tabs layout with vertical stack for visualization problems:
```tsx
{hasVisualization ? (
  // Code above, animation below per D-06
  <div className="space-y-6 mt-6">
    {/* Code section */}
    <div className="rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted">
        <LanguageSelector
          availableLanguages={availableLanguages}
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>
      <CodeViewer
        solution={solution}
        language={language}
        onLanguageChange={setLanguage}
        highlightLine={currentCodeLine}
      />
    </div>

    {/* Animation section */}
    <div className="rounded-lg border overflow-hidden">
      <div className="px-4 py-2 bg-muted">
        <h3 className="font-semibold">动画演示</h3>
      </div>
      <VisualizationSection
        problemId={problem.id}
        onCodeLineChange={setCurrentCodeLine}
      />
    </div>
  </div>
) : (
  // Non-visualization layout (existing)
  <SolutionTabs ... />
)}
```
</action>

<acceptance_criteria>
- `ProblemPageClient` has `currentCodeLine` state with `useState(0)`
- Visualization problems render code above animation below per D-06
- `CodeViewer` receives `highlightLine={currentCodeLine}` prop
- `VisualizationSection` receives `onCodeLineChange={setCurrentCodeLine}` callback
- Non-visualization problems continue to use existing layout
- TypeScript compilation passes
</acceptance_criteria>

### Task 6: Update exports

<read_first>
- `leetcode-hot100-viz/src/components/visualization/index.ts` — Current exports
</read_first>

<action>
Add export:
```typescript
export { CodeSyncViewer } from './CodeSyncViewer';
```
</action>

<acceptance_criteria>
- `index.ts` contains `export { CodeSyncViewer } from './CodeSyncViewer';`
</acceptance_criteria>

## Verification

1. Run `pnpm tsc --noEmit` to verify TypeScript compilation
2. Navigate to `/problems/0206` (reverse list)
3. Verify code appears above animation area per D-06
4. Play animation and verify:
   - Current code line highlights with yellow background per D-05
   - Page auto-scrolls to highlighted line
   - Step description shows below animation per D-07
5. Test all 4 linked list algorithms (0206, 0141, 0021, 0019)
6. Run `pnpm build` to verify static export works

## Must Haves

- [ ] Code line highlighting with yellow background per D-05
- [ ] Auto-scroll to highlighted line per D-05
- [ ] Code above, animation below layout per D-06
- [ ] Step description below animation per D-07
- [ ] `AnimationSnapshot.codeLine` field used for synchronization
- [ ] All 4 linked list algorithms display correctly with code sync
