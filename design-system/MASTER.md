# LeetCode Hot 100 Viz - Design System

> Modern Dark (Cinema Mobile) Design System
> Version: 1.0
> Date: 2026-05-05

---

## Color Palette

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-deep` | `#020203` | Deepest background (OLED optimized) |
| `--bg-base` | `#050506` | Base background |
| `--bg-elevated` | `#0a0a0c` | Elevated surfaces (cards, modals) |
| `--surface` | `rgba(255, 255, 255, 0.05)` | Subtle surface overlay |
| `--foreground` | `#EDEDEF` | Primary text |
| `--foreground-muted` | `#8A8F98` | Secondary/muted text |
| `--accent` | `#5E6AD2` | Primary accent (indigo) |
| `--accent-glow` | `rgba(94, 106, 210, 0.2)` | Accent glow effect |
| `--accent-secondary` | `#22C55E` | Success/green accent |
| `--accent-tertiary` | `#F59E0B` | Warning/amber accent |
| `--border` | `rgba(255, 255, 255, 0.08)` | Subtle borders |
| `--border-strong` | `rgba(255, 255, 255, 0.15)` | Stronger borders |

---

## Typography

- **Primary**: Inter (weights: 300, 400, 500, 600, 700)
- **Monospace**: JetBrains Mono (for code blocks)

### Type Scale

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| H1 | 32px | 600 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 20px | 600 | 1.4 |
| Body | 14px | 400 | 1.6 |
| Code | 13px | 400 | 1.5 |

---

## Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |

---

## Border Radius

| Token | Value |
|-------|-------|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-full` | 9999px |

---

## Animation

- `--duration-fast`: 150ms
- `--duration-normal`: 200ms
- `--duration-slow`: 300ms
- `--ease-out-expo`: cubic-bezier(0.16, 1, 0.3, 1)
- `--ease-spring`: cubic-bezier(0.34, 1.56, 0.64, 1)
