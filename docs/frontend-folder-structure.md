# Frontend Folder Structure

The `Ai-Recruiter-Mini-Frontend` project uses Next.js App Router, TypeScript, and Tailwind CSS. The folder structure is organized following a hybrid approach that combines Next.js's route-based structure with a feature-based structure for business logic.

## 1. Overview of Structure

```txt
src/
  app/
    (dashboard)/
      dashboard/
      candidates/
      resumes/
      job-descriptions/
      applications/
      evaluations/

  components/
    ui/
    common/
    layout/
    feedback/
    forms/

  features/
    files/
    candidates/
    resumes/
    job-descriptions/
    applications/
    evaluations/

  lib/
    api/
    constants/
    types/
    utils/
    validations/

  hooks/
  providers/
  config/
```

## 2. src/app

The `src/app` directory contains the main routes of the application using Next.js's App Router mechanism.

```txt
src/app/
  (dashboard)/
    dashboard/
    candidates/
    resumes/
    job-descriptions/
    applications/
    evaluations/
```

The `(dashboard)` route group is used to organize the main screens of the recruiter dashboard system. The name `(dashboard)` does not appear in the URL.

Example:

```
src/app/(dashboard)/candidates
```

corresponds to the URL:

```
/candidates
```

The main routes in the MVP include:

- `/dashboard`
- `/candidates`
- `/candidates/new`
- `/candidates/[id]`
- `/resumes`
- `/resumes/[id]`
- `/job-descriptions`
- `/job-descriptions/new`
- `/job-descriptions/[id]`
- `/applications`
- `/applications/new`
- `/applications/[id]`
- `/evaluations`
- `/evaluations/[id]`

## 3. src/components

The `src/components` directory contains components used throughout the entire frontend.

```txt
components/
  ui/
  common/
  layout/
  feedback/
  forms/
```

### components/ui

Contains UI primitives or components from UI libraries such as Button, Input, Card, Dialog, Table, and Badge.

### components/common

Contains reusable components across multiple screens such as PageHeader, DataTable, EmptyState, and ConfirmDialog.

### components/layout

Contains main layout components such as AppShell, Sidebar, Header, and MainContent.

### components/feedback

Contains status display components such as LoadingState, ErrorState, Skeleton, and Toast.

### components/forms

Contains shared form components such as FormField, TextInput, TextAreaInput, SelectInput, and FileUploadInput.

## 4. src/features

The `src/features` directory contains code organized by product business domains.

```txt
features/
  files/
  candidates/
  resumes/
  job-descriptions/
  applications/
  evaluations/
```

Each feature has the following sub-structure:

```txt
api/
components/
hooks/
types/
```

### api

Contains functions that call APIs for that specific feature.

Example:

```
features/candidates/api
```

will contain logic for creating a candidate, fetching a list of candidates, and fetching candidate details.

### components

Contains components used exclusively for that feature.

Examples:

- `CandidateForm`
- `CandidateTable`
- `CandidateDetailCard`

### hooks

Contains custom hooks for data fetching or mutations for that feature.

Examples:

- `useCandidates`
- `useCandidateDetail`
- `useCreateCandidate`

### types

Contains TypeScript types specific to that feature.

Examples:

- `Candidate`
- `CreateCandidatePayload`
- `UpdateCandidatePayload`

## 5. src/lib

The `src/lib` directory contains core utilities shared across the entire application.

```txt
lib/
  api/
  constants/
  types/
  utils/
  validations/
```

### lib/api

Contains the API client, response types, error handling, and endpoint constants.

### lib/constants

Contains shared constants such as route paths, status labels, file types, and file size limits.

### lib/types

Contains types shared across multiple features, for example ApiResponse, PaginationMeta, and ApiError.

### lib/utils

Contains helper functions such as formatDate, formatFileSize, and buildQueryParams.

### lib/validations

Contains shared validation schemas, typically used with Zod.

## 6. src/hooks

Contains custom hooks shared across the entire application that are not specific to any single feature.

Examples:

- `useDebounce`
- `usePagination`
- `useDisclosure`

## 7. src/providers

Contains providers at the app level.

Examples:

- `QueryProvider`
- `ThemeProvider`
- `ToastProvider`

## 8. src/config

Contains frontend configuration such as app configuration, navigation configuration, and environment configuration.

Examples:

- `app.config.ts`
- `navigation.config.ts`
- `env.config.ts`

## 9. Routing Structure

The frontend uses Next.js App Router, so each route is defined by a folder in `src/app` and a `page.tsx` file.

Current route structure:

```txt
src/app/
  page.tsx
  (dashboard)/
    layout.tsx
    dashboard/
      page.tsx
    candidates/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    resumes/
      page.tsx
      [id]/
        page.tsx
    job-descriptions/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    applications/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    evaluations/
      page.tsx
      [id]/
        page.tsx
```

### 9.1. Root Route

File:

```
src/app/page.tsx
```

is used to handle the root route:

```
/
```

This route redirects users to:

```
/dashboard
```

This ensures that when users access the main domain, they are taken directly to the dashboard screen instead of seeing an empty page or a temporary landing page.

### 9.2. Dashboard Route Group

The directory:

```
src/app/(dashboard)
```

is a route group in Next.js.

The name `(dashboard)` does not appear in the URL. It is only used to organize routes that belong to the dashboard area.

Example:

```
src/app/(dashboard)/candidates/page.tsx
```

corresponds to the URL:

```
/candidates
```

not:

```
/dashboard/candidates
```

### 9.3. Dashboard Layout

The file:

```
src/app/(dashboard)/layout.tsx
```

serves as a common layout for all screens within the dashboard group.

Screens that use this layout include:

- `/dashboard`
- `/candidates`
- `/resumes`
- `/job-descriptions`
- `/applications`
- `/evaluations`

At the current stage, the layout may only render `children`. In the future, this layout will be the place to add the sidebar, topbar, main content container, and shared navigation components.

### 9.4. Static Routes

Static routes are fixed routes that do not require dynamic parameters.

Current static routes:

- `/dashboard`
- `/candidates`
- `/candidates/new`
- `/resumes`
- `/job-descriptions`
- `/job-descriptions/new`
- `/applications`
- `/applications/new`
- `/evaluations`

These routes serve list screens, create new screens, or dashboard overview screens.

### 9.5. Dynamic Routes

Dynamic routes use folders in the format:

```
[id]
```

Current dynamic routes:

- `/candidates/[id]`
- `/resumes/[id]`
- `/job-descriptions/[id]`
- `/applications/[id]`
- `/evaluations/[id]`

When a user accesses a URL like:

```
/candidates/cand_123
```

Next.js will pass the value `cand_123` to the `params.id` of the corresponding page.

Dynamic routes are used for detail screens such as candidate detail, resume detail, job description detail, application detail, and evaluation detail.

### 9.6. Route File Naming Convention

Each route must have a file:

```
page.tsx
```

for Next.js to recognize it as a valid page.

Each route group or nested route can have a file:

```
layout.tsx
```

to share layout with child pages.

Current naming convention:

```
page.tsx    used for the main content of a route
layout.tsx  used for the layout wrapping a group of routes
```

---

## 10. Resume Parse UI Structure

Recent updates added UI support for triggering resume parsing and displaying structured parsed resume data inside the frontend.

### 10.1. Related Feature Area

Resume parsing UI belongs to the `resumes` feature module:

```txt
src/features/resumes/
  api/
  components/
  hooks/
  types/
```

Expected responsibilities:

| Area | Responsibility |
| --- | --- |
| `features/resumes/api` | Calls backend resume parse endpoints through the shared API client |
| `features/resumes/hooks` | Coordinates parse actions and loading/error state |
| `features/resumes/types` | Stores parsed resume response types aligned with backend API shape |
| `features/resumes/components` | Renders parse action UI and parsed resume sections |

### 10.2. Parsed Resume Display

The parsed resume UI should render structured sections rather than raw JSON.

Supported sections include:

- Personal information
- Summary
- Skills
- Education
- Experience
- Projects
- Certifications
- Achievements
- Languages

The UI must support parsed skill objects, not only string arrays. Skill evidence is currently hidden in the main profile UI to keep the display clean, while normalized names and categories remain available in data.

### 10.3. API Shape Alignment

Frontend parsed resume types must stay aligned with the Backend/AI Service response shape:

- `skills` is an array of objects with fields such as `name`, `normalized_name`, `category`, and `evidence`.
- `education` should render the full parsed fields when present, including institution, degree, field of study, year range, and description.
- `projects` should display project names, URLs, technologies, and descriptions.
- Optional fields may be `null` and list fields may be empty arrays.

### 10.4. Implementation Rules

- Do not call the AI service directly from the frontend.
- Resume parse actions must go through the Backend API.
- API calls must stay in feature API files and use the shared `apiClient`.
- UI components should use feature hooks for parse actions instead of embedding request logic directly.
- Parsed data presentation should remain feature-specific under `features/resumes/components` unless a UI block becomes reusable across other modules.
