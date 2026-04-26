# Foundation Theme Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** UI foundation decisions for MVP. Dark mode deferred.

---

## Overview

The design direction is **Business SaaS Dashboard** — clean, readable, professional, and suitable for an internal recruitment workflow.

The UI avoids strong gradients, low-contrast text, decorative color noise, and overly playful styling. The visual system focuses on:

- Clear reading contrast
- Simple layout hierarchy
- Neutral backgrounds
- Consistent spacing
- Lightweight borders
- Practical interaction states
- Blue as the primary action color

This direction fits a B2B hiring tool where recruiters need to scan candidates, resumes, job descriptions, applications, and AI evaluations efficiently.

---

## Current Design Decision

The project now uses **Tailwind utility classes directly** for the MVP foundation instead of relying heavily on custom CSS color tokens.

Preferred palette:

| Purpose | Tailwind Class | Usage |
| --- | --- | --- |
| App background | `bg-slate-50` | Main dashboard background |
| Surface / card | `bg-white` | Sidebar, header, cards, forms |
| Primary action | `bg-blue-600` | Main buttons, active nav indicator |
| Primary hover | `hover:bg-blue-700` | Button hover state |
| Active background | `bg-blue-50` | Active sidebar item, subtle selected state |
| Main text | `text-slate-950` | Page title, section title, strong labels |
| Body text | `text-slate-600` | Descriptions and supporting text |
| Muted text | `text-slate-500` | Helper text, captions, metadata |
| Border | `border-slate-200` | Layout borders, cards, dividers |
| Input border | `border-slate-300` | Form inputs and upload zones |

This approach is intentionally simple for MVP. It keeps the UI predictable and prevents theme-token mismatch issues such as broken `w-sidebar`, `h-header`, `bg-bg-sidebar`, or unreadable custom color combinations.

---

## Color System

### Primary Color

| Token / Class | Value | Usage |
| --- | --- | --- |
| `blue-600` | `#2563EB` | Primary buttons, active nav text, links |
| `blue-700` | `#1D4ED8` | Primary button hover |
| `blue-50` | `#EFF6FF` | Active nav background, soft selected state |
| `blue-100` | `#DBEAFE` | Focus ring background |

### Neutral Colors

| Token / Class | Usage |
| --- | --- |
| `slate-50` | Page background |
| `white` | Sidebar, header, cards, form panels |
| `slate-100` | Subtle hover backgrounds |
| `slate-200` | Standard borders and dividers |
| `slate-300` | Input and dashed upload borders |
| `slate-500` | Muted text |
| `slate-600` | Body text and descriptions |
| `slate-800` | Form labels |
| `slate-900` / `slate-950` | Strong text and avatar background |

### Status Colors

Use Tailwind status colors directly until the design system grows.

| Status | Class | Usage |
| --- | --- | --- |
| Success | `green-600` | Successful upload, completed status |
| Warning | `amber-600` | Pending, review, warning state |
| Error | `red-600` | Upload failure, validation errors |
| Info | `cyan-600` or `blue-600` | Informational messages |

---

## Typography

### Font Family

The project uses **Geist Sans** through `next/font/google`.

Current setup in `src/app/layout.tsx`:

```tsx
import { Geist } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

The body applies:

<body className={geistSans.variable} suppressHydrationWarning>
```

### Typography Rules

| Context | Tailwind Classes |
| --- | --- |
| Page title | `text-3xl font-semibold tracking-tight text-slate-950` |
| Section title | `text-lg font-semibold text-slate-950` |
| Card title | `text-base font-semibold text-slate-950` |
| Body text | `text-sm text-slate-600` |
| Helper text | `text-xs text-slate-500` |
| Form label | `text-sm font-medium text-slate-800` |
| Button text | `text-sm font-semibold` |
| Sidebar item | `text-sm font-medium` |

### Typography Guidelines

- Use `font-semibold` for page titles, section titles, buttons, and important labels.
- Use `font-medium` for navigation and form labels.
- Use `text-slate-950` only for important text.
- Use `text-slate-600` for readable secondary descriptions.
- Avoid very light text such as `text-slate-300` on white backgrounds.
- Avoid excessive uppercase text in business screens.

---

## Border Radius

The UI uses soft but still professional rounding.

| Element | Tailwind Class | Notes |
| --- | --- | --- |
| Sidebar logo | `rounded-xl` | Compact brand block |
| Sidebar item | `rounded-xl` | Comfortable click target |
| Input | `rounded-xl` | Modern form control |
| Button | `rounded-xl` | Consistent with inputs |
| Card / Panel | `rounded-2xl` | Soft dashboard panels |
| Upload zone | `rounded-2xl` | Larger interactive drop area |
| Avatar | `rounded-full` | Standard user identity pattern |

### Rule

Use `rounded-xl` for interactive controls and `rounded-2xl` for containers. Avoid uncontrolled large rounding on dense data tables.

---

## Shadows

The design uses minimal shadows. Borders provide most structural separation.

Current Tailwind extension:

```javascript
boxShadow: {
  card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
  panel: '0 16px 40px rgba(15, 23, 42, 0.08)',
}
```

| Element | Recommended Class |
| --- | --- |
| Standard card | `shadow-card` |
| Floating panel / modal | `shadow-panel` |
| Button | `shadow-sm` |
| Header | no heavy shadow, use border |
| Sidebar | no shadow, use border-right |

### Rule

- If an element is part of page layout, prefer `border border-slate-200`.
- If an element floats or needs emphasis, use a light shadow.

---

## Layout Foundation

### App Shell

The dashboard layout uses a two-column flex shell:

```tsx
<div className="flex min-h-screen bg-slate-50">
  <Sidebar />

  <div className="flex min-w-0 flex-1 flex-col">
    <Header />
    <MainContent>{children}</MainContent>
  </div>
</div>
```

This prevents the sidebar from expanding incorrectly and keeps the content area flexible.

### Sidebar

The sidebar uses a white business-dashboard style.

| Property | Value |
| --- | --- |
| Width | `w-72` |
| Background | `bg-white` |
| Border | `border-r border-slate-200` |
| Desktop display | `hidden lg:flex lg:flex-col` |
| Logo area height | `h-16` |
| Active item | `bg-blue-50 text-blue-700` |
| Inactive item | `text-slate-600 hover:bg-slate-100 hover:text-slate-950` |

#### Sidebar Rules

- Do not use dark sidebar in MVP.
- Do not use low-contrast text.
- Do not use `w-sidebar` unless the token is explicitly defined in `tailwind.config.ts`.
- Prefer `w-72` directly for stability.
- Keep active state subtle and readable.

### Header

The header is sticky and simple.

| Property | Value |
| --- | --- |
| Height | `h-16` |
| Position | `sticky top-0 z-30` |
| Background | `bg-white/90 backdrop-blur` |
| Border | `border-b border-slate-200` |
| Horizontal padding | `px-8` |

The header contains:

- App section title
- Short workspace description
- Admin user identity
- Avatar

Avoid heavy backgrounds, strong gradients, or large decorative elements inside the header.

### Main Content

Main content uses consistent spacing:

```tsx
<main className="flex-1 px-8 py-8">{children}</main>
```

Page content should generally use:

```tsx
<div className="mx-auto max-w-6xl space-y-6">
  {/* Page Structure Pattern */}
</div>
```

### Page Structure Pattern

```tsx
<div className="mx-auto max-w-6xl space-y-6">
  <div>
    <p className="text-sm font-medium text-blue-600">Section Label</p>

    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
      Page Title
    </h1>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
      Page description.
    </p>
  </div>

  <FeatureComponent />
</div>
```

---

## Forms

Form UI should avoid native browser-looking controls.

### Input Style

```tsx
className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
```

### Label Style

```tsx
className="block text-sm font-medium text-slate-800"
```

### Helper Text Style

```tsx
className="text-xs leading-5 text-slate-500"
```

### File Upload UI

Native file input should be visually hidden and replaced with a styled upload zone.

#### Upload Zone Pattern

```tsx
<label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
  <input type="file" className="sr-only" />
  ...
</label>
```

### File Validation

File upload components should not hardcode file rules. Use the shared constants and utilities.

Current shared constants:

```
src/lib/constants/file.constants.ts
```

Current shared utilities:

```
src/lib/utils/format-file-size.ts
src/lib/utils/resume-file.util.ts
```

Expected validation rules:

- Only PDF and DOCX files are accepted.
- Max file size comes from `DEFAULT_MAX_FILE_SIZE`.
- File size display uses `formatFileSize`.
- Resume-specific validation should live in `resume-file.util.ts`, not inside the component.

---

## Toast Feedback

The project uses sonner through a shared toast helper.

Provider location:

```
src/app/layout.tsx
<ToastProvider />
```

Toast helper:

```
src/components/feedback/toast.tsx
```

Use toast feedback for user interactions such as:

- File selected
- Missing Candidate ID
- Missing CV file
- Invalid file format
- File too large
- Upload success
- Upload failure

### Example

```tsx
showToast.success('CV uploaded successfully', {
  description: 'The resume has been linked to the selected candidate.',
});
```

### Rule

Do not call toast directly in feature components. Use `showToast` from the shared feedback layer.

---

## Tailwind Config

Current `tailwind.config.ts` should remain minimal.

### Recommended structure

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.04)',
        panel: '0 16px 40px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Removed / Avoided Tokens

Avoid relying on these unless they are explicitly defined again:

- `w-sidebar`
- `h-header`
- `bg-bg-sidebar`
- `bg-bg-card`
- `text-text-primary`
- `border-border-default`
- `rounded-button`
- `rounded-card`
- `rounded-input`

These tokens caused confusion during the UI update because the implementation shifted toward direct Tailwind utility classes.

---

## Component Styling Rules

### Do

- Use slate for neutral surfaces and text.
- Use blue for primary actions and active states.
- Keep backgrounds light and readable.
- Use `border-slate-200` for layout separation.
- Use `rounded-xl` and `rounded-2xl` consistently.
- Use shared constants and utilities for file upload validation.
- Use `showToast` for UI feedback.

### Do Not

- Do not use dark sidebar in MVP.
- Do not use low-contrast sidebar text.
- Do not use strong gradients as the main visual system.
- Do not use raw native file input styling.
- Do not hardcode accepted file types inside components.
- Do not hardcode max file size inside components.
- Do not use arbitrary hex values in component classes.
- Do not introduce large refactors outside the current project structure.

---

## Current MVP UI Direction

The `/resumes` page currently follows this layout:

```
AppShell
  Sidebar
  Main area
    Header
    MainContent
      Resume page heading
      ResumeUploadForm
```

The page should feel like:

- Clean internal SaaS tool
- Readable recruitment workspace
- Simple business dashboard
- No visual noise
- No low-contrast text
- No over-designed gradients

---

## Out of Scope

This document does not define:

- API integration details
- Resume upload endpoint behavior
- Candidate detail upload flow
- Mobile sidebar drawer
- Dark mode
- shadcn/ui setup
- Full accessibility audit
- Feature-specific business rules beyond UI-level validation