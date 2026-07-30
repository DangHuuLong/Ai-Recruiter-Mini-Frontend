# Dashboard UI Notes

## 1. Purpose

This document summarizes the dashboard UI changes introduced by PR #24: `feature/soft-futurism-rms-dashboard`.

The goal of this update is to move the frontend away from a plain HR/corporate dashboard style and establish a more memorable RMS interface direction: **Soft Futurism**.

This document is intentionally focused on the UI/layout layer. It does not redefine backend APIs, data contracts, or feature business logic.

---

## 2. Implemented Scope

Implemented in the latest dashboard UI update:

- Soft Futurism visual direction for the RMS dashboard
- Global design tokens in `globals.css`
- Immersive dashboard shell with dark aurora background
- Redesigned sidebar navigation system
- Redesigned top navigation experience
- Wider dashboard content canvas
- New dashboard overview page for recruitment operations
- KPI cards for high-level RMS metrics
- Priority job posting section
- Candidate pipeline / Kanban signal board preview

Not in scope yet:

- Real dashboard analytics API integration
- Drag-and-drop candidate pipeline behavior
- Full dashboard-wide component system extraction
- Light mode support
- Per-role dashboard personalization
- Persistent dashboard filters
- Responsive mobile navigation drawer polish beyond current layout behavior

---

## 3. Visual Direction

The selected direction is **Soft Futurism RMS**.

Core design characteristics:

- Deep dark background with aurora-style gradients
- Purple/cyan/emerald accent palette
- Glassmorphism surfaces using translucent cards and borders
- Rounded, immersive dashboard shell
- High-contrast white headings and muted secondary text
- Display typography for strong SaaS identity
- Recruitment-operation language instead of generic admin dashboard copy
- Hover/glow interactions to make cards feel active and responsive

The dashboard should feel like a modern talent operations command center, not a standard HR admin panel.

---

## 4. Main UI Areas

### Global Theme

Global styling is defined in `src/app/globals.css`.

Current theme responsibilities:

- Imports display/body fonts
- Defines Soft Futurism CSS variables
- Sets global dark background
- Adds aurora gradients and subtle grid texture
- Defines primary, accent, surface, border, and text color tokens
- Provides `.font-display` helper class

Important token groups:

| Token | Purpose |
| --- | --- |
| `--color-primary` | Main purple brand accent |
| `--color-accent` | Cyan/emerald highlight for active signals |
| `--color-surface` | Translucent card surface |
| `--color-surface-strong` | Stronger shell/card surface |
| `--color-border` | Soft glass border |
| `--color-text-primary` | Main text on dark background |
| `--color-text-secondary` | Supporting text |
| `--color-text-tertiary` | Muted metadata text |
| `--font-display` | Headline/display font |
| `--font-body` | Main body font |

### Dashboard Shell

The dashboard layout is handled by:

- `src/components/layout/app-shell.tsx`
- `src/app/(dashboard)/layout.tsx`

Current shell behavior:

1. Sidebar and page content are arranged inside an immersive dark shell.
2. The content area uses a wider canvas to support dashboard-heavy pages.
3. Background styling comes mostly from global CSS and shell surfaces.
4. Dashboard child pages inherit the shared navigation and content structure.

### Sidebar Navigation

Implemented in `src/components/layout/sidebar.tsx`.

Current sidebar behavior:

- Uses the Soft Futurism visual style
- Presents dashboard modules as a structured navigation system
- Uses stronger active/hover states
- Keeps navigation consistent for Candidates, Resumes, Job Descriptions, Applications, and Evaluations
- Acts as the main anchor for RMS modules

### Top Navigation

Implemented in `src/components/layout/header.tsx`.

Current top navigation behavior:

- Provides a more designed top bar experience
- Fits the dark immersive shell instead of the older plain header style
- Keeps space for user/session actions
- Supports the wider dashboard canvas

### Main Content Canvas

Implemented in `src/components/layout/main-content.tsx`.

Current content behavior:

- Gives dashboard pages more horizontal room
- Keeps spacing consistent inside the shell
- Avoids overly narrow enterprise-dashboard layouts
- Supports large visual dashboard cards and pipeline previews

### Dashboard Overview

Implemented in `src/app/(dashboard)/dashboard/page.tsx`.

Current overview sections:

- Hero section with Soft Futurism RMS positioning
- KPI grid for Total Applicants, Active Jobs, Interviews This Week, and Offer Acceptance
- Priority job postings list
- Candidate Pipeline / Kanban signal board preview

The dashboard data is currently static UI/demo data. It is meant to validate the visual direction and layout before connecting real analytics or recruitment metrics.

---

## 5. Important Files

| File | Purpose |
| --- | --- |
| `src/app/globals.css` | Global Soft Futurism theme tokens, fonts, background, and base styles |
| `src/app/(dashboard)/dashboard/page.tsx` | RMS dashboard overview UI with KPIs, priority jobs, and candidate pipeline preview |
| `src/app/(dashboard)/layout.tsx` | Dashboard route layout wrapper |
| `src/components/layout/app-shell.tsx` | Immersive dashboard shell structure |
| `src/components/layout/sidebar.tsx` | Redesigned sidebar navigation system |
| `src/components/layout/header.tsx` | Redesigned top navigation experience |
| `src/components/layout/main-content.tsx` | Wider dashboard content canvas and shared content spacing |
| `src/config/navigation.config.ts` | Central source of dashboard navigation items |
| `src/config/routes.config.ts` | Central source of route constants |

---

## 6. Design Rules for Future UI Work

When adding new dashboard pages, keep the following rules:

1. Use the existing dashboard shell instead of creating page-specific wrappers.
2. Prefer theme variables from `globals.css` for color consistency.
3. Keep cards translucent with soft borders when they sit on the dark aurora background.
4. Use `font-display` for strong page titles, section titles, and large metric values.
5. Keep dense data areas readable by pairing high-contrast titles with muted metadata text.
6. Avoid introducing a separate corporate/light visual style inside dashboard pages.
7. Extract reusable UI patterns only after they appear in multiple dashboard pages.
8. Treat static dashboard arrays as temporary demo data until API integration is implemented.

---

## 7. Manual Check List

- [ ] Dashboard renders correctly at `/dashboard`.
- [ ] Global background uses the Soft Futurism dark aurora style.
- [ ] Sidebar navigation displays all RMS modules.
- [ ] Sidebar active and hover states are visible.
- [ ] Top navigation fits the redesigned dark shell.
- [ ] Main content canvas is wider than the previous layout.
- [ ] KPI cards render correctly and remain readable.
- [ ] Priority jobs section renders without layout overflow.
- [ ] Candidate pipeline columns render correctly on desktop.
- [ ] Dashboard remains usable on smaller screens.
- [ ] No old light/corporate dashboard styling leaks into the new shell.
- [ ] `npm run lint` passes after UI changes.
- [ ] `npm run build` passes before merging.

---

## 8. Follow-up Recommendations

Recommended next steps:

- Connect KPI cards to real backend metrics when analytics endpoints are available.
- Replace static job and pipeline data with API-driven RMS data.
- Add responsive mobile navigation behavior if recruiters need mobile dashboard access.
- Extract repeated glass card styles into shared components after more pages adopt the same style.
- Define a small dashboard design guideline if the Soft Futurism direction is reused across Candidates, Applications, and Evaluations pages.
