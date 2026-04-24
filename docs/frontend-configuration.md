# Frontend Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** Shared frontend configuration for routes and navigation.

---

## 1. Routes and Navigation Configuration

### Purpose

This section defines the shared configuration for route paths and dashboard navigation.

The goal is to avoid hardcoded route strings inside layout components and keep navigation data outside the `Sidebar` component.

---

### Files

```
src/config/routes.config.ts
src/config/navigation.config.ts
src/lib/types/navigation.ts
```

| File | Purpose |
|---|---|
| `src/config/routes.config.ts` | Stores shared route constants |
| `src/config/navigation.config.ts` | Stores dashboard navigation items |
| `src/lib/types/navigation.ts` | Stores navigation-related types |

---

## 2. Main Dashboard Layout

### Purpose

This section defines the shared dashboard layout used by all main application pages.

The layout provides a consistent structure with:

- Sidebar navigation
- Top header
- Main content area

This layout applies to routes inside the dashboard route group, such as `/dashboard`, `/candidates`, `/resumes`, `/job-descriptions`, `/applications`, and `/evaluations`.

---

### Files

| File | Purpose |
| --- | --- |
| `src/app/(dashboard)/layout.tsx` | Connects dashboard routes to the shared layout |
| `src/components/layout/app-shell.tsx` | Defines the main dashboard shell |
| `src/components/layout/sidebar.tsx` | Renders sidebar navigation |
| `src/components/layout/header.tsx` | Renders the top header |
| `src/components/layout/main-content.tsx` | Wraps page content with shared spacing and width |
| `src/lib/utils/navigation.ts` | Stores navigation active-state logic |

---

### Layout Structure

```txt
DashboardLayout
  AppShell
    Sidebar
    Content Area
      Header
      MainContent
        Page Content
```

`DashboardLayout` is responsible for applying the shared layout to every route inside `src/app/(dashboard)`.

`AppShell` is responsible for the overall structure.

`Sidebar`, `Header`, and `MainContent` are separated into their own files so each component has one clear responsibility.

---

### Key Decisions

- `Sidebar` must not hardcode navigation items.
- Navigation data must come from `src/config/navigation.config.ts`.
- Route paths must come from `src/config/routes.config.ts`.
- Active navigation logic must be placed in `src/lib/utils/navigation.ts`.
- `Sidebar` must be a Client Component because it uses `usePathname()`.
- Layout components should use Tailwind theme tokens such as `bg-bg-base`, `bg-bg-sidebar`, `h-header`, `w-sidebar`, and `max-w-content`.
- Conditional class names should use the shared `cn()` helper instead of `.join(' ')`.

---

### Active Navigation Rule

Dashboard uses exact matching:

```txt
/dashboard
```

Module routes support nested paths.

For example, all of these routes should activate `Candidates`:

```txt
/candidates
/candidates/new
/candidates/[id]
```

This logic should stay outside the `Sidebar` component.
