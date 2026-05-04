# Concerns

**Last Updated:** 2026-05-04

## Critical Priority

### 1. XSS Vulnerability in MDX Rendering

**Location:** `src/lib/mdx.ts`, MDX content rendering

**Issue:** User-controllable MDX content could execute arbitrary JavaScript if not properly sanitized.

**Impact:** Security vulnerability allowing script injection.

**Recommendation:**
- Sanitize MDX content before rendering
- Use `rehype-sanitize` plugin
- Audit MDX pipeline for injection points

---

## High Priority

### 2. No Test Coverage

**Location:** Entire codebase

**Issue:** Zero test files found. No unit, integration, or E2E tests.

**Impact:**
- Refactoring is risky
- Bugs may go undetected
- No regression protection

**Recommendation:**
- Set up Vitest for unit tests
- Add executor tests first (pure functions)
- Add E2E tests for critical paths

### 3. Hardcoded LeetCode Problem IDs

**Location:** Algorithm executors, visualization components

**Issue:** Problem IDs are hardcoded strings like `'two-sum'`, `'three-sum'` without central registry.

**Impact:**
- Maintenance burden
- Risk of typos
- No type safety

**Recommendation:**
- Create `ProblemId` type
- Centralize ID registry
- Use constants instead of string literals

### 4. Missing Input Validation

**Location:** `src/lib/visualization/executors/*.ts`

**Issue:** Executors don't validate input data before processing.

**Impact:**
- Runtime errors on invalid input
- Poor user experience
- Debugging difficulty

**Recommendation:**
- Add input validation schemas
- Return meaningful error messages
- Handle edge cases gracefully

---

## Medium Priority

### 5. Large Component File

**Location:** `src/components/RichProblemView.tsx` (17.6KB)

**Issue:** Single file contains too much logic.

**Impact:**
- Hard to maintain
- Difficult to test
- Code navigation issues

**Recommendation:**
- Extract sub-components
- Separate concerns
- Consider composition pattern

### 6. Code Duplication in Executors

**Location:** `src/lib/visualization/executors/`

**Issue:** Similar patterns repeated across executor files.

**Impact:**
- Maintenance overhead
- Inconsistent behavior risk
- Harder to add new executors

**Recommendation:**
- Extract common utilities
- Create shared snapshot helpers
- Standardize executor structure

### 7. No Error Boundaries

**Location:** `src/app/`

**Issue:** No `error.tsx` files for graceful error handling.

**Impact:**
- White screen on errors
- Poor user experience
- No error recovery

**Recommendation:**
- Add `error.tsx` to each route
- Implement error boundary components
- Add error logging

### 8. LocalStorage Without Fallback

**Location:** `src/hooks/*.ts`

**Issue:** Hooks access localStorage without checking availability.

**Impact:**
- Fails in private browsing
- SSR warnings
- Runtime errors

**Recommendation:**
- Check `typeof window !== 'undefined'`
- Provide fallback values
- Handle SSR gracefully

### 9. Missing Loading States

**Location:** Problem pages, data loading

**Issue:** No loading states for async operations.

**Impact:**
- Poor perceived performance
- UI jumps
- Confusing UX

**Recommendation:**
- Add `loading.tsx` files
- Show skeletons during load
- Smooth transitions

### 10. Data Quality Unknown

**Location:** `data/problems.json`

**Issue:** No validation of JSON data structure.

**Impact:**
- Type mismatches at runtime
- Missing data issues
- Hard to debug

**Recommendation:**
- Add JSON schema validation
- Validate at build time
- Create type guards

### 11. No Accessibility Audit

**Location:** All components

**Issue:** No systematic accessibility review.

**Impact:**
- WCAG compliance unknown
- Screen reader compatibility unknown
- Keyboard navigation gaps

**Recommendation:**
- Run axe-core audit
- Add ARIA labels where needed
- Test keyboard navigation

### 12. Theme Flash on Load

**Location:** `src/hooks/useTheme.ts`

**Issue:** Theme is loaded after initial render, causing flash.

**Impact:**
- Poor user experience
- Accessibility issue
- Visual glitch

**Recommendation:**
- Inline theme script in `<head>`
- Use CSS variables
- Block render until theme resolved

---

## Low Priority

### 13. Missing Documentation

**Location:** Algorithm executors

**Issue:** No JSDoc or inline documentation explaining algorithms.

**Impact:**
- Harder for contributors
- Learning curve
- Maintenance difficulty

**Recommendation:**
- Add JSDoc to each executor
- Document algorithm complexity
- Add inline comments for complex logic

### 14. No Performance Monitoring

**Location:** Entire application

**Issue:** No performance metrics collection.

**Impact:**
- Unknown performance issues
- No baseline for optimization
- Can't measure improvements

**Recommendation:**
- Add Web Vitals tracking
- Set up error monitoring
- Create performance budget

### 15. Console Logs in Production

**Location:** Various files

**Issue:** Console.log statements may exist in production code.

**Impact:**
- Performance overhead
- Information leakage
- Cluttered console

**Recommendation:**
- Audit and remove console logs
- Use ESLint rule to catch
- Add build-time removal

### 16. No SEO Optimization

**Location:** `src/app/`

**Issue:** Limited meta tags, no sitemap, no structured data.

**Impact:**
- Poor search visibility
- Missing social sharing previews
- Lower discoverability

**Recommendation:**
- Add comprehensive metadata
- Generate sitemap
- Add JSON-LD structured data

### 17. Hardcoded Animation Speeds

**Location:** Animation components

**Issue:** Animation speeds are magic numbers.

**Impact:**
- Hard to tune globally
- Inconsistent feel
- Maintenance burden

**Recommendation:**
- Centralize animation constants
- Use CSS variables
- Allow user customization

### 18. No Internationalization

**Location:** All UI strings

**Issue:** All text is hardcoded in English.

**Impact:**
- Not accessible to non-English users
- Hard to translate later
- Global reach limited

**Recommendation:**
- Consider i18n library
- Extract strings to JSON
- Plan for translations

### 19. Missing 404 Page

**Location:** `src/app/`

**Issue:** No custom 404 page defined.

**Impact:**
- Poor user experience
- Lost users
- No navigation help

**Recommendation:**
- Add `not-found.tsx`
- Provide helpful navigation
- Match site styling

### 20. No Analytics

**Location:** Entire application

**Issue:** No analytics integration.

**Impact:**
- No usage insights
- Can't track features
- No user behavior data

**Recommendation:**
- Add privacy-respecting analytics
- Track key interactions
- Set up dashboards

---

## Summary

| Priority | Count | Action |
|----------|-------|--------|
| Critical | 1 | Address immediately |
| High | 3 | Plan for next sprint |
| Medium | 8 | Backlog for upcoming work |
| Low | 8 | Address opportunistically |

## Top 5 Action Items

1. **Fix XSS vulnerability** - Security critical
2. **Add test infrastructure** - Risk mitigation
3. **Refactor RichProblemView** - Maintainability
4. **Add input validation** - Robustness
5. **Implement error boundaries** - User experience
