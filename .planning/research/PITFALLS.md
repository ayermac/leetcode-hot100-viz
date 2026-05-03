# Pitfalls & Warnings

**Domain:** 算法可视化学习平台
**Date:** 2026-04-30

---

## Animation Pitfalls

### P-ANIM-01: Animation Speed Too Fast
- **Problem:** Users cannot follow rapid state changes; cognitive processing lags behind visual updates.
- **Warning Signs:**
  - User feedback "too fast to understand"
  - Users pausing/rewinding frequently
  - Animation completes before user reads annotations
- **Prevention:**
  - Default to slower speed (recommend 0.5x or 1x as baseline)
  - Provide granular speed controls (0.25x, 0.5x, 1x, 2x)
  - Allow frame-by-frame stepping for complex operations
  - Add pause points at key decision moments
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-ANIM-02: Missing State Context
- **Problem:** Each animation frame shows current state but users lose track of what changed and why.
- **Warning Signs:**
  - Users asking "why did that move?"
  - Need to replay animations multiple times
  - Confusion about algorithm decisions
- **Prevention:**
  - Highlight what changed between frames (color, border, glow)
  - Show operation labels ("swap", "compare", "insert")
  - Display current step explanation alongside animation
  - Keep previous N states visible in a mini-history
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-ANIM-03: Automatic Layout Breaking Mental Model
- **Problem:** Auto-reorganizing data structures (e.g., linked list relayout) obscures algorithm behavior.
- **Warning Signs:**
  - Visual rearrangement unrelated to algorithm logic
  - Users losing track of node positions
  - Misleading about operation complexity
- **Prevention:**
  - Preserve spatial positions during operations (VisuAlgo lesson: linked lists should NOT auto-relayout)
  - Only reposition when algorithm explicitly moves elements
  - Let spatial relationships reflect data structure properties
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-ANIM-04: Canvas Performance Degradation
- **Problem:** Complex visualizations (large arrays, dense graphs) cause frame drops and jank.
- **Warning Signs:**
  - Animation stutters with large datasets
  - Browser tab becomes unresponsive
  - Memory usage grows unbounded
- **Prevention:**
  - Use requestAnimationFrame properly
  - Implement virtualization (only render visible elements)
  - Consider SVG for smaller datasets, Canvas for larger
  - Set maximum element limits with graceful degradation
  - Clean up animation frames and event listeners
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-ANIM-05: Animation State Desynchronization
- **Problem:** Animation state gets out of sync with code execution, leading to misleading visuals.
- **Warning Signs:**
  - User actions (speed change, pause) cause jumps
  - Stepping backward shows wrong states
  - Resume after pause shows incorrect frame
- **Prevention:**
  - Store complete execution trace as immutable states
  - Never derive state; always replay from recorded steps
  - Use single source of truth for animation timeline
  - Test all control combinations (pause + step + speed change)
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

---

## UX Pitfalls

### P-UX-01: Mobile Touch Limitations
- **Problem:** Complex visualizations require precise interaction impossible on touch screens.
- **Warning Signs:**
  - Touch targets too small for fingers
  - Hover states inaccessible
  - Drag operations conflict with scroll
- **Prevention:**
  - VisuAlgo recommends minimum 1366x768; acknowledge mobile limitations
  - Create "lite" mobile version with simplified interactions
  - Use tap zones instead of precise targeting
  - Provide alternative controls (buttons instead of drag)
  - Test on actual devices, not just responsive preview
- **Phase to Address:** Phase 1 (MVP - UX)

### P-UX-02: Hidden Navigation Depth
- **Problem:** Users get lost in deep navigation hierarchies (17 categories → 100 problems → solutions).
- **Warning Signs:**
  - Users asking "where am I?"
  - Excessive back-button usage
  - Session recordings show navigation loops
- **Prevention:**
  - Implement persistent breadcrumbs
  - Show context in sidebar (current category, related problems)
  - Provide "recently viewed" quick access
  - Allow direct URL routing to any problem
  - Consider flat navigation for frequently accessed items
- **Phase to Address:** Phase 1 (MVP - Basic Structure)

### P-UX-03: No Way to Experiment
- **Problem:** Fixed demo inputs limit understanding; users can't test edge cases.
- **Warning Signs:**
  - Users asking "what if I change this?"
  - Requests for more examples
  - Copy-paste to external tools
- **Prevention:**
  - Allow custom input data entry
  - Provide input validation with helpful errors
  - Include edge case presets (empty, single element, duplicates)
  - Show input format expectations clearly
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-UX-04: Theme Affecting Visualization Clarity
- **Problem:** Dark/light mode changes color meanings; highlights become invisible.
- **Warning Signs:**
  - Colors wash out in light mode
  - Contrast insufficient in dark mode
  - Color meanings inconsistent across themes
- **Prevention:**
  - Define separate color palettes per theme
  - Test all visualizations in both themes
  - Use semantic color names (accent, highlight, danger) not specific values
  - Ensure WCAG AA contrast for all states
- **Phase to Address:** Phase 1 (MVP - UX)

### P-UX-05: Search Returns Nothing
- **Problem:** Search is too strict; users can't find problems by partial names or alternate terms.
- **Warning Signs:**
  - Zero-result searches
  - Users browsing instead of searching
  - Support requests for problem location
- **Prevention:**
  - Implement fuzzy matching
  - Include tags and aliases in search index
  - Show suggestions as user types
  - Handle common misspellings
  - Index both Chinese and English terms
- **Phase to Address:** Phase 1 (MVP - UX)

---

## Technical Pitfalls

### P-TECH-01: Next.js Static Export Runtime Errors
- **Problem:** Code using Next.js runtime features (middleware, rewrites, ISR) breaks in static export.
- **Warning Signs:**
  - Build succeeds but pages error at runtime
  - `useRouter` returns undefined paths
  - API routes not found
- **Prevention:**
  - Audit all imports for server-side dependencies
  - Use `next.config.js` with `output: 'export'` from the start
  - Test build output locally before deploying
  - Replace `next/router` with `next/link` navigation
  - Pre-generate all possible routes at build time
- **Phase to Address:** Phase 0 (Architecture)

### P-TECH-02: Markdown Frontmatter Inconsistency
- **Problem:** Existing markdown files have inconsistent frontmatter formats; parsing fails silently.
- **Warning Signs:**
  - Some problems missing metadata
  - Build errors on specific files
  - Default values applied incorrectly
- **Prevention:**
  - Create validation script for existing markdown
  - Define strict schema with required fields
  - Use gray-matter with error handling
  - Provide migration script to normalize frontmatter
  - Add CI check for frontmatter validity
- **Phase to Address:** Phase 0 (Architecture)

### P-TECH-03: Code Block Language Detection Failure
- **Problem:** Syntax highlighter fails for unknown languages or missing language tags.
- **Warning Signs:**
  - Code renders as plain text
  - Wrong language highlighting applied
  - Console errors about unknown languages
- **Prevention:**
  - Default to generic highlighting for unknown languages
  - Validate language tags against supported list
  - Use Shiki for broader language support
  - Include fallback styling for edge cases
  - Test with all target languages (Go, Python, Java, TypeScript)
- **Phase to Address:** Phase 1 (MVP - Basic Structure)

### P-TECH-04: Animation Library Bundle Size
- **Problem:** Including full GSAP or Framer Motion significantly increases initial load.
- **Warning Signs:**
  - Lighthouse performance score drops
  - First contentful paint delayed
  - Large JS bundles reported
- **Prevention:**
  - Tree-shake unused animation features
  - Consider lighter alternatives (Motion One, CSS animations)
  - Lazy-load animation libraries only when visualization is active
  - Evaluate bundle size after each library addition
  - Set budget limits (150KB JS for landing per performance rules)
- **Phase to Address:** Phase 0 (Architecture)

### P-TECH-05: Client-Side Storage Limits
- **Problem:** LocalStorage has 5-10MB limit; storing user data (favorites, history) hits ceiling.
- **Warning Signs:**
  - Storage quota exceeded errors
  - Data silently lost
  - Performance degrades with stored data size
- **Prevention:**
  - Limit stored history entries
  - Use IndexedDB for larger datasets
  - Implement data expiration/cleanup
  - Handle quota errors gracefully
  - Test with maximum expected data volume
- **Phase to Address:** Phase 1 (MVP - UX)

### P-TECH-06: Markdown Rendering XSS Vulnerability
- **Problem:** User-visible content from markdown could contain malicious HTML/scripts.
- **Warning Signs:**
  - Raw HTML rendering in markdown
  - Script tags appearing in output
  - Security audit warnings
- **Prevention:**
  - Use sanitized markdown parser (remark with rehype-sanitize)
  - Never use dangerouslySetInnerHTML without sanitization
  - Implement CSP headers even for static sites
  - Audit all user-controllable content paths
  - Test with malicious markdown payloads
- **Phase to Address:** Phase 0 (Architecture)

---

## Content Pitfalls

### P-CONTENT-01: Algorithm Type Incompatibility
- **Problem:** Visualization designed for sorting doesn't work for graph traversal; one-size-fits-all fails.
- **Warning Signs:**
  - Force-fitting visualization to wrong structure
  - Complex workarounds in animation logic
  - User confusion about what's being visualized
- **Prevention:**
  - Categorize algorithms by visualization type early:
    - Array-based: sorting, searching, two pointers
    - Linked structures: linked lists, trees
    - Graph-based: DFS, BFS, shortest path
    - DP/Backtracking: state space trees
  - Create distinct visualization components per type
  - Don't force single visualization for all algorithms
- **Phase to Address:** Phase 0 (Architecture)

### P-CONTENT-02: Multi-Language Code Synchronization
- **Problem:** Code examples in different languages have subtle differences; switching shows inconsistent logic.
- **Warning Signs:**
  - Comments don't match across languages
  - Variable names differ in meaning
  - Algorithm variations between implementations
- **Prevention:**
  - Establish code review process for consistency
  - Use identical variable naming conventions
  - Document intentional language differences
  - Consider pseudocode as canonical reference
  - Test visualizations against each language version
- **Phase to Address:** Phase 1 (MVP - Basic Structure)

### P-CONTENT-03: Edge Case Visualization Missing
- **Problem:** Algorithms are only demonstrated on "happy path" inputs; edge cases confuse users.
- **Warning Signs:**
  - Users asking "what happens with empty input?"
  - Confusion when LeetCode test cases differ
  - Visualization breaks on boundary conditions
- **Prevention:**
  - Include edge case presets: empty array, single element, all duplicates, already sorted
  - Test visualization handles all edge cases
  - Document how edge cases are handled in algorithm
  - Show algorithm behavior clearly for unusual inputs
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-CONTENT-04: Difficulty Level Mismatch
- **Problem:** Easy problems have complex visualizations; Hard problems have simple ones—misleading users.
- **Warning Signs:**
  - User complaints about difficulty perception
  - Time spent doesn't correlate with difficulty
  - Visualization complexity varies arbitrarily
- **Prevention:**
  - Standardize visualization complexity guidelines
  - Use LeetCode difficulty as baseline
  - Add time estimates for understanding
  - Consider separate "quick overview" vs "deep dive" modes
- **Phase to Address:** Phase 1 (MVP - Basic Structure)

---

## Learning Effectiveness Pitfalls

### P-LEARN-01: Passive Watching Without Engagement
- **Problem:** Users watch animations passively without building mental models.
- **Warning Signs:**
  - Low retention after viewing
  - Users can't solve variations
  - Replay counts high without comprehension improvement
- **Prevention:**
  - Add prediction prompts: "What will happen next?"
  - Include quiz questions at key steps (VisuAlgo model)
  - Require user interaction before proceeding
  - Provide "predict then verify" exercises
  - Show common mistakes and their consequences
- **Phase to Address:** Phase 2 (Enhancement)

### P-LEARN-02: Information Overload
- **Problem:** Too many visual elements, annotations, and controls overwhelm learners.
- **Warning Signs:**
  - Users don't know where to focus
  - Session recordings show random clicking
  - Users skip animations entirely
- **Prevention:**
  - Progressive disclosure: show essentials first
  - Highlight current focus area
  - Allow toggling detail layers
  - Use clear visual hierarchy
  - Provide "guided mode" with annotations, "explorer mode" without
- **Phase to Address:** Phase 1 (MVP - Core Visualization)

### P-LEARN-03: No Comparison Capability
- **Problem:** Users can't see how different algorithms handle same input.
- **Warning Signs:**
  - Requests for algorithm comparison
  - Users opening multiple tabs
  - Questions about "which is better"
- **Prevention:**
  - Allow side-by-side visualization (VisuAlgo: "juxtapose 2 windows")
  - Normalize input across algorithms
  - Show performance metrics alongside (steps, comparisons, swaps)
  - Highlight algorithmic differences
- **Phase to Address:** Phase 2 (Enhancement)

### P-LEARN-04: Missing Complexity Intuition
- **Problem:** Users see steps but don't understand time/space complexity.
- **Warning Signs:**
  - Users can't predict behavior at scale
  - Confusion about "why this is O(n log n)"
  - Disconnect between animation and complexity notation
- **Prevention:**
  - Show operation count alongside animation
  - Visualize growth rate (e.g., step counter graph)
  - Compare input size vs. operations performed
  - Link animation behavior to complexity analysis
- **Phase to Address:** Phase 2 (Enhancement)

### P-LEARN-05: No Mental Model Building Path
- **Problem:** Visualization jumps to final result without building understanding.
- **Warning Signs:**
  - Users memorize animation rather than understanding
  - Can't apply to new problems
  - Rote learning patterns
- **Prevention:**
  - Start with simplest case, progressively add complexity
  - Explain WHY each step occurs
  - Show the invariant being maintained
  - Connect to problem-solving patterns
  - Provide "try it yourself" guided exercises
- **Phase to Address:** Phase 2 (Enhancement)

---

## Summary Checklist

### Animation
- [ ] P-ANIM-01: Animation speed appropriate for cognitive processing
- [ ] P-ANIM-02: State changes clearly highlighted with context
- [ ] P-ANIM-03: Layout changes only when algorithm dictates
- [ ] P-ANIM-04: Performance tested with large datasets
- [ ] P-ANIM-05: Animation state properly synchronized

### UX
- [ ] P-UX-01: Mobile limitations acknowledged and addressed
- [ ] P-UX-02: Navigation depth managed with breadcrumbs
- [ ] P-UX-03: Custom input experimentation supported
- [ ] P-UX-04: Both themes tested for visualization clarity
- [ ] P-UX-05: Search handles fuzzy matching and aliases

### Technical
- [ ] P-TECH-01: Static export compatibility verified
- [ ] P-TECH-02: Markdown frontmatter validated
- [ ] P-TECH-03: Code highlighting robust for all languages
- [ ] P-TECH-04: Animation library bundle size within budget
- [ ] P-TECH-05: Storage limits handled gracefully
- [ ] P-TECH-06: XSS prevention in markdown rendering

### Content
- [ ] P-CONTENT-01: Algorithm types have appropriate visualizations
- [ ] P-CONTENT-02: Multi-language code synchronized
- [ ] P-CONTENT-03: Edge cases included in presets
- [ ] P-CONTENT-04: Difficulty matches visualization complexity

### Learning Effectiveness
- [ ] P-LEARN-01: Engagement prompts integrated
- [ ] P-LEARN-02: Information density controlled
- [ ] P-LEARN-03: Comparison capability available
- [ ] P-LEARN-04: Complexity intuition built
- [ ] P-LEARN-05: Mental model building path provided

---

## Sources

- [VisuAlgo](https://visualgo.net/en) - Key design decisions including mobile limitations (1366x768 minimum), automatic layout issues with linked lists, comparison through juxtaposition
- [Algorithm Visualizer GitHub](https://github.com/algorithm-visualizer/algorithm-visualizer) - Architecture patterns: React frontend, tracer libraries for multi-language support, command-based visualization
- [USFCA Algorithm Visualization](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html) - Multiple format support (Java, Flash) indicating extensibility patterns
- [p5.js](https://github.com/processing/p5.js) - Animation loop patterns via `draw()`, iterative approach for creative visualization

---

*Last updated: 2026-04-30*
