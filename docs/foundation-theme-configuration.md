# Foundation Theme Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard
**Stack:** Next.js App Router · TypeScript · Tailwind CSS
**Scope:** UI foundation decisions for MVP. Dark mode deferred.

---

## Overview

The design direction is **Refined Utilitarian** — clean, information-dense, and professional, consistent with B2B internal tooling. The palette is built on a cold neutral base (Slate) paired with a clear Blue primary. Decorative elements are minimal; hierarchy is communicated through typography, spacing, and subtle borders rather than color noise or heavy shadows.

---

## Tailwind Config Mapping

The Tailwind theme maps semantic token names to CSS variables.

Example:

```ts
primary: 'var(--color-primary)'
```

---

## Color System

### Primary

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| `primary` | `--color-primary` | `#2563EB` | Buttons, active nav, links, focus rings |
| `primary-hover` | `--color-primary-hover` | `#1D4ED8` | Hover state on primary actions |
| `primary-foreground` | `--color-primary-foreground` | `#FFFFFF` | Text rendered on primary background |

### Status Colors

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| `success` | `--color-success` | `#16A34A` | Passed, hired, active status |
| `warning` | `--color-warning` | `#D97706` | Pending, in-review status |
| `error` | `--color-error` | `#DC2626` | Rejected, failed, form errors |
| `info` | `--color-info` | `#0891B2` | Informational badges, notes |

### Backgrounds

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| `bg-base` | `--color-bg-base` | `#F8FAFC` | Overall page background |
| `bg-card` | `--color-bg-card` | `#FFFFFF` | Cards, panels, table containers |
| `bg-sidebar` | `--color-bg-sidebar` | `#0F172A` | Sidebar (dark) |
| `bg-header` | `--color-bg-header` | `#FFFFFF` | Top header bar |
| `bg-muted` | `--color-bg-muted` | `#F1F5F9` | Disabled inputs, subtle row striping |

> **Rationale:** The dark sidebar (`Slate 900`) provides a clear visual anchor and separates navigation from content without requiring full dark mode. The `bg-base` off-white (`Slate 50`) reduces eye strain on data-heavy screens.

### Borders

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| `border-default` | `--color-border-default` | `#E2E8F0` | Cards, inputs, tables |
| `border-hover` | `--color-border-hover` | `#94A3B8` | Input hover state |
| `border-focus` | `--color-border-focus` | `#2563EB` | Input/select focus ring |
| `divider` | `--color-divider` | `#F1F5F9` | Section dividers, table row separators |

### Text

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| `text-primary` | `--color-text-primary` | `#0F172A` | Headings, main body content |
| `text-secondary` | `--color-text-secondary` | `#475569` | Labels, metadata, descriptions |
| `text-muted` | `--color-text-muted` | `#94A3B8` | Placeholders, captions, hints |
| `text-disabled` | `--color-text-disabled` | `#CBD5E1` | Disabled inputs, inactive actions |
| `text-on-primary` | `--color-text-on-primary` | `#FFFFFF` | Text rendered on primary-colored backgrounds |

---

## Typography

### Font Family

**Primary font: Geist Sans** — loaded via `next/font/google` using Next.js font optimization.

```
font-sans → ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif']
```

Geist Sans was chosen for its performance on small sizes, clean numerals (important in data tables), and natural fit in Next.js projects. It is neutral without being generic.

### Font Weight Rules

| Context | Tailwind Class | Weight |
|---|---|---|
| Page title | `font-semibold` | 600 |
| Section title | `font-semibold` | 600 |
| Card title | `font-medium` | 500 |
| Table header | `font-medium` | 500 |
| Form label | `font-medium` | 500 |
| Body text | `font-normal` | 400 |
| Button text | `font-medium` | 500 |
| Badge / Caption | `font-medium` | 500 |

> `font-bold` (700) is reserved for large stat numbers on the Dashboard overview. It should not appear in standard body or label contexts.

### Typography Scale

| Role | Tailwind Classes | Size / Line Height |
|---|---|---|
| Page title | `text-2xl font-semibold` | 24px / 32px |
| Section title | `text-lg font-semibold` | 18px / 28px |
| Card title | `text-base font-medium` | 16px / 24px |
| Body text | `text-sm` | 14px / 20px |
| Small / caption | `text-xs` | 12px / 16px |
| Form label | `text-sm font-medium` | 14px / 20px |
| Table cell | `text-sm` | 14px / 20px |
| Table header | `text-xs font-medium uppercase tracking-wide` | 12px / 16px |

---

## Border Radius

| Element | Token | Value | Rationale |
|---|---|---|---|
| Button | `rounded-button` | `6px` | Professional, not overly rounded |
| Input | `rounded-input` | `6px` | Consistent with button |
| Card | `rounded-card` | `8px` | Slightly softer than interactive elements |
| Dialog / Modal | `rounded-modal` | `12px` | Creates a floating feel |
| Badge / Tag | `rounded-full` | — | Visually distinguishes from buttons |

> **Rule:** Avoid `rounded-2xl` or larger on data-containing elements. Aggressive rounding reads as consumer/marketing UI, not an internal tool.

---

## Shadows

The shadow strategy is minimal. Use borders for structural separation; reserve shadows for floating/overlay elements only.

| Element | Token | Value | When to use |
|---|---|---|---|
| Card | `shadow-card` | `0 1px 2px 0 rgb(15 23 42 / 0.05)` | Card on `bg-base` background only |
| Card on white | — | `border border-border-default` | Use border instead of shadow |
| Dropdown / Popover | `shadow-dropdown` | `0 4px 6px -1px ... / 0 2px 4px -2px ...` | Always — these elements float |
| Modal | `shadow-modal` | `0 20px 25px -5px ... / 0 8px 10px -6px ...` | Always — separates from overlay |
| Button | — | None | Flat buttons suit dashboard tools |

> **Decision rule:** If an element sits in page flow → use border. If it floats above the page (dropdown, modal, tooltip) → use shadow.

---

## Spacing

| Context | Tailwind | Value |
|---|---|---|
| Page horizontal padding | `px-6` | 24px |
| Page top padding | `pt-6` | 24px |
| Gap between page sections | `gap-6` / `mb-6` | 24px |
| Card padding (default) | `p-6` | 24px |
| Card padding (compact) | `p-4` | 16px |
| Gap between form fields | `gap-4` | 16px |
| Gap between buttons | `gap-2` | 8px |
| Table cell padding | `py-3 px-4` | 12px / 16px |
| Table header padding | `py-2 px-4` | 8px / 16px |

---

## Layout

### Content Width

- **Max width token:** `content` → `1280px`. Tailwind usage: `max-w-content`. This is equivalent to Tailwind's default `max-w-7xl`.
- **List / table pages:** Do not constrain max-width. Allow tables to use full width, with `overflow-x-auto` for horizontal scroll.
- **Detail pages:** Two-column layout using CSS Grid — `grid-cols-3`. Main content panel takes `col-span-2`; metadata/action sidebar takes `col-span-1`.

### Sidebar

| Property | Value | Notes |
|---|---|---|
| Desktop width | `sidebar` → `240px` | Sufficient for full label text |
| Collapsed sidebar | Not in MVP | Add if user demand emerges post-launch |
| Mobile sidebar | Deferred | Implement via Sheet/Drawer (shadcn/ui) after MVP |

### Header

| Property | Value | Notes |
|---|---|---|
| Height | `header` → `56px` | Standard for internal tools |
| Position | `sticky top-0 z-40` | Always visible while scrolling |
| Bottom border | `border-b border-border-default` | Separates from content |
| MVP contents | App name (left) · Breadcrumb (center-left) · User avatar (right) | |

---

## Tailwind Strategy

**Decision: CSS Variables in `globals.css` + `theme.extend` in `tailwind.config.ts`.**

### How it works

1. Declare all color tokens as CSS custom properties in `:root` inside `globals.css`.
2. Map each variable to a Tailwind color name in `tailwind.config.ts` under `theme.extend.colors`.
3. Use semantic Tailwind classes throughout components: `bg-primary`, `text-text-secondary`, `border-border-default`.

### Why this approach

- Single source of truth for all tokens — change one variable, everything updates.
- Works with Tailwind's utility generation without requiring additional plugins.
- Prepares the project for dark mode (just add `[data-theme="dark"]` overrides to CSS variables).
- Keeps component code readable — class names describe intent, not raw values.

### Rule

Never use arbitrary hex values directly in component markup (`bg-[#2563EB]`). Always reference a token. If a value isn't in the token system, it doesn't belong in a component.

---

## Out of Scope

This document does not define:

- Dashboard navigation items
- Route constants
- AppShell, Sidebar, Header, or MainContent implementation
- shadcn/ui component setup
- Feature page implementation