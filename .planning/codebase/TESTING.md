# Testing

**Last Updated:** 2026-05-04

## Current Status

⚠️ **No test infrastructure exists**

- No test framework installed
- No test files found
- No CI/CD test step configured

## Recommended Setup

### Test Framework

**Vitest** - Fast, Vite-native, compatible with Next.js

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
```

### E2E Testing

**Playwright** - For critical user flows

```bash
npm install -D @playwright/test
```

## Test Structure

```
src/
├── __tests__/
│   ├── executors/           # Algorithm executor tests
│   │   ├── twoSum.test.ts
│   │   └── ...
│   └── hooks/               # Hook tests
│       ├── useAnimationPlayer.test.ts
│       └── ...
│
├── components/
│   └── __tests__/
│       └── RichProblemView.test.tsx
│
└── e2e/
    ├── navigation.spec.ts
    └── algorithm-visualization.spec.ts
```

## Test Categories

### 1. Unit Tests (High Priority)

**Algorithm Executors** - Pure functions, easy to test

```typescript
// twoSum.test.ts
describe('twoSumExecutor', () => {
  it('should find correct indices', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = [...twoSumExecutor(input)]
    
    const result = snapshots[snapshots.length - 1]
    expect(result.result).toEqual([0, 1])
  })

  it('should yield correct number of steps', () => {
    const input = { nums: [2, 7, 11, 15], target: 9 }
    const snapshots = [...twoSumExecutor(input)]
    
    expect(snapshots.length).toBeGreaterThan(1)
  })
})
```

**Hooks** - Test state logic

```typescript
// useAnimationPlayer.test.ts
describe('useAnimationPlayer', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAnimationPlayer(mockExecutor))
    
    expect(result.current.isPlaying).toBe(false)
    expect(result.current.currentStep).toBe(0)
  })

  it('should advance step on next()', () => {
    const { result } = renderHook(() => useAnimationPlayer(mockExecutor))
    
    act(() => result.current.next())
    
    expect(result.current.currentStep).toBe(1)
  })
})
```

### 2. Component Tests (Medium Priority)

```typescript
// RichProblemView.test.tsx
describe('RichProblemView', () => {
  it('should render problem title', () => {
    render(<RichProblemView problem={mockProblem} />)
    
    expect(screen.getByText(mockProblem.title)).toBeInTheDocument()
  })

  it('should toggle bookmark on click', async () => {
    render(<RichProblemView problem={mockProblem} />)
    
    const bookmarkBtn = screen.getByRole('button', { name: /bookmark/i })
    await userEvent.click(bookmarkBtn)
    
    expect(localStorage.getItem('leetcode-bookmarks')).toContain(mockProblem.id)
  })
})
```

### 3. E2E Tests (Medium Priority)

```typescript
// navigation.spec.ts
test('navigate to problem detail', async ({ page }) => {
  await page.goto('/')
  
  await page.click('[data-testid="category-card"]')
  await page.click('[data-testid="problem-item"]')
  
  await expect(page.locator('h1')).toBeVisible()
})

// algorithm-visualization.spec.ts
test('algorithm animation plays', async ({ page }) => {
  await page.goto('/problems/two-sum')
  
  await page.click('[data-testid="play-button"]')
  
  await expect(page.locator('[data-testid="step-indicator"]')).not.toContainText('0')
})
```

## Coverage Targets

| Category | Target | Rationale |
|----------|--------|-----------|
| Executors | 100% | Pure functions, critical logic |
| Hooks | 80% | State management |
| Components | 60% | Key interactions |
| E2E | Critical paths | User flows |

## Mocking Strategy

### Algorithm Executors

No mocking needed - they're pure functions.

### LocalStorage

```typescript
// __mocks__/localStorage.ts
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', { value: localStorageMock })
```

### Next.js Router

```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  useSearchParams: () => new URLSearchParams()
}))
```

## CI Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npx playwright test
```

## Test Commands

```json
// package.json scripts
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test"
}
```

## Priority Order

1. **Executor tests** - High value, easy to implement
2. **Hook tests** - State logic isolation
3. **E2E critical paths** - User flow validation
4. **Component tests** - UI behavior verification
