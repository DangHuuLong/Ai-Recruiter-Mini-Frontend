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