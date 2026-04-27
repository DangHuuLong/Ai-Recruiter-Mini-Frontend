# Frontend Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** Shared frontend configuration for routes, navigation, layout, API communication, feedback, and reusable UI foundations.

---

## 1. Routes and Navigation Configuration

### Purpose

This section defines the shared configuration for route paths and dashboard navigation.

The goal is to avoid hardcoded route strings inside layout components and keep navigation data outside the `Sidebar` component.

---

### Files

```txt
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

### Key Decisions

- Route paths must come from `src/config/routes.config.ts`.
- Dashboard navigation items must come from `src/config/navigation.config.ts`.
- Navigation-related types should stay in `src/lib/types/navigation.ts`.
- Layout components must not hardcode route strings.
- `Sidebar` should only render navigation data; it should not own navigation configuration.

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
| `src/components/layout/main-content.tsx` | Wraps page content with shared spacing |
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

### Current AppShell Implementation Rule

The dashboard shell uses a flex-based two-column layout:

```tsx
<div className="flex min-h-screen bg-slate-50">
  <Sidebar />

  <div className="flex min-w-0 flex-1 flex-col">
    <Header />
    <MainContent>{children}</MainContent>
  </div>
</div>
```

This prevents the sidebar from expanding unexpectedly and keeps the main content area responsive.

---

### Key Decisions

- `Sidebar` must not hardcode navigation items.
- Navigation data must come from `src/config/navigation.config.ts`.
- Route paths must come from `src/config/routes.config.ts`.
- Active navigation logic must be placed in `src/lib/utils/navigation.ts`.
- `Sidebar` must be a Client Component because it uses `usePathname()`.
- Conditional class names should use the shared `cn()` helper instead of `.join(' ')`.
- Layout components should use stable Tailwind utility classes directly for MVP, such as `bg-slate-50`, `bg-white`, `border-slate-200`, `w-72`, and `h-16`.
- Avoid using custom layout tokens such as `w-sidebar` and `h-header` unless they are explicitly defined in `tailwind.config.ts`.

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

---

### Sidebar Current Rule

The sidebar currently uses a white business-dashboard style:

```tsx
<aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
```

Expected sidebar styling:

| Property | Value |
|---|---|
| Width | `w-72` |
| Background | `bg-white` |
| Border | `border-r border-slate-200` |
| Desktop display | `hidden lg:flex lg:flex-col` |
| Logo area height | `h-16` |
| Active item | `bg-blue-50 text-blue-700` |
| Inactive item | `text-slate-600 hover:bg-slate-100 hover:text-slate-950` |

Do not use `w-sidebar` unless the token is defined in `tailwind.config.ts`.

---

### Header Current Rule

The header currently uses:

```tsx
<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
  <div className="flex h-16 items-center justify-between px-8">
    ...
  </div>
</header>
```

Expected header styling:

| Property | Value |
|---|---|
| Height | `h-16` |
| Position | `sticky top-0 z-30` |
| Background | `bg-white/90 backdrop-blur` |
| Border | `border-b border-slate-200` |
| Horizontal padding | `px-8` |

Do not use `h-header` unless the token is defined in `tailwind.config.ts`.

---

### Main Content Current Rule

Main content should use consistent page spacing:

```tsx
<main className="flex-1 px-8 py-8">{children}</main>
```

Page content should generally use:

```tsx
<div className="mx-auto max-w-6xl space-y-6">
  ...
</div>
```

---

## 3. API Client Configuration

### Purpose

This section defines the shared API client configuration used by the frontend to communicate with the backend.

The goal is to keep API calls consistent across all features and avoid calling `fetch` directly inside pages or components.

The API client is responsible for:

- Using the shared backend base URL
- Building request URLs
- Handling query parameters
- Sending JSON requests
- Supporting file upload requests
- Parsing API responses
- Normalizing API errors
- Reusing shared API response types

---

### Files

```txt
src/config/env.config.ts
src/lib/api/api-client.ts
src/lib/api/api-error.ts
src/lib/api/api-endpoints.ts
src/lib/api/api-types.ts
src/lib/api/index.ts
```

| File | Purpose |
|---|---|
| `src/config/env.config.ts` | Stores frontend environment configuration |
| `src/lib/api/api-client.ts` | Provides the shared API client for HTTP requests |
| `src/lib/api/api-error.ts` | Defines the shared API error object |
| `src/lib/api/api-endpoints.ts` | Stores backend endpoint constants |
| `src/lib/api/api-types.ts` | Stores shared API response and request types |
| `src/lib/api/index.ts` | Re-exports API utilities for cleaner imports |

---

### Environment Configuration

The frontend API base URL is configured through environment variables.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

The backend uses the global API prefix:

```txt
/api
```

Therefore, endpoint constants should not repeat `/api`.

#### Correct

```txt
/candidates
/files/upload
/job-descriptions
```

#### Incorrect

```txt
/api/candidates
/api/files/upload
/api/job-descriptions
```

---

### API Client Structure

```txt
API Feature Function
  ↓
apiClient
  ├── apiEndpoints
  ├── envConfig
  └── Backend API
```

Feature-level API files should call the shared `apiClient` instead of using `fetch` directly.

Example feature API locations:

```txt
src/features/candidates/api
src/features/resumes/api
src/features/job-descriptions/api
src/features/applications/api
src/features/evaluations/api
```

---

### API Response Rules

The frontend API types must follow the backend API contract.

#### Successful Response

A successful response contains:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

#### Paginated Response

A paginated response also contains:

```json
{
  "success": true,
  "message": "...",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

> **Note:** The `meta` field only exists for paginated endpoints. Frontend code should not assume that every list response has pagination metadata.

#### Error Response

An error response contains:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "...",
  "errors": [],
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/..."
}
```

> **Note:** The `errors` field is always an array.

---

### File Upload Rule

File upload requests must use `multipart/form-data`.

The shared API client should support `FormData` so upload features do not need a separate request implementation.

The upload endpoint should be configured under the file resource:

```txt
/files/upload
```

---

### Key Decisions

- Pages and components should not call `fetch` directly.
- Feature API files should use the shared `apiClient`.
- Backend endpoint paths should be stored in `src/lib/api/api-endpoints.ts`.
- API response and error types should be stored in `src/lib/api/api-types.ts`.
- API errors should be normalized through `src/lib/api/api-error.ts`.
- The API base URL should come from `src/config/env.config.ts`.
- Endpoint constants should not include the `/api` prefix.
- Upload requests should be handled by the shared API client.
- API response types should stay aligned with the backend API contract.

---

## 4. Shared Loading State Configuration

### Purpose

This section defines shared loading UI components used across the frontend.

The goal is to keep loading states consistent across all pages and features instead of creating separate loading UI in each module.

Shared loading states are used when:

- A page is loading data
- A table is waiting for API results
- A detail screen is fetching information
- A card or section is temporarily unavailable while data is being loaded

---

### Files

```txt
src/components/feedback/loading-state.tsx
src/components/feedback/skeleton.tsx
src/components/feedback/index.ts
```

| File | Purpose |
|---|---|
| `src/components/feedback/loading-state.tsx` | Provides a general loading state component |
| `src/components/feedback/skeleton.tsx` | Provides skeleton placeholders for common UI layouts |
| `src/components/feedback/index.ts` | Re-exports feedback components for cleaner imports |

---

### Loading Components

The shared loading configuration includes:

```txt
LoadingState
Skeleton
TableSkeleton
CardSkeleton
DetailSkeleton
```

`LoadingState` is used for general loading sections or pages.

`Skeleton` components are used when the UI layout should remain visible while data is loading.

---

### Key Decisions

- Loading UI should be placed in `src/components/feedback`.
- Pages and feature components should reuse shared loading components.
- Loading UI should not be recreated separately in every feature.
- API client should not manage loading state directly.
- Loading state should be handled by pages, feature hooks, or the future data-fetching layer.
- Skeleton components should be used for tables, cards, and detail pages when layout stability is useful.

---

## 5. Form Validation Configuration

### Purpose

This section defines the shared form validation setup used across the frontend.

The goal is to keep validation rules consistent and avoid writing validation logic directly inside pages or components.

Form validation is used for screens such as:

- Create candidate
- Upload resume
- Create job description
- Create application
- Update application status

---

### Packages

The frontend uses the following packages for form validation:

```txt
react-hook-form
zod
@hookform/resolvers
```

| Package | Purpose |
|---|---|
| `react-hook-form` | Manages form state and submission |
| `zod` | Defines validation schemas |
| `@hookform/resolvers` | Connects Zod schemas with React Hook Form |

---

### Files

```txt
src/lib/validations/common.validation.ts
src/lib/validations/index.ts
```

| File | Purpose |
|---|---|
| `src/lib/validations/common.validation.ts` | Stores shared validation rules |
| `src/lib/validations/index.ts` | Re-exports validation utilities for cleaner imports |

---

### Validation Structure

Shared validation rules are placed in:

```txt
src/lib/validations
```

Feature-specific validation schemas should be placed inside each feature.

Example:

```txt
src/features/candidates/validations/candidate.validation.ts
src/features/job-descriptions/validations/job-description.validation.ts
src/features/applications/validations/application.validation.ts
```

This keeps common validation reusable while keeping business-specific rules close to the feature that owns them.

---

### Shared Validation Rules

The shared validation configuration includes common rules such as:

```txt
requiredString
optionalString
emailSchema
optionalEmailSchema
positiveNumberSchema
```

These rules are intended for common form fields such as:

- Required text fields
- Optional text fields
- Email fields
- Positive number fields

---

### Key Decisions

- Validation logic should not be written directly inside page components.
- Common validation rules should be placed in `src/lib/validations`.
- Feature-specific schemas should stay inside their own feature folder.
- Form types should be inferred from Zod schemas when possible.
- Frontend validation should match backend expectations, but backend remains the source of truth.
- Validation messages should be clear and consistent across forms.
- HTML form values may need coercion, especially for number inputs.

---

## 6. File Upload Component Configuration

### Purpose

This section defines the shared file upload component used across the frontend.

The goal is to provide a consistent upload UI for features that need file selection, especially resume/CV upload.

The upload component is responsible for:

- Displaying a reusable file upload input
- Supporting click-to-upload
- Supporting drag and drop
- Validating accepted file types
- Validating maximum file size
- Showing selected file information
- Showing basic upload input errors

The component only handles file selection and basic frontend validation. It does not call the upload API directly.

---

### Files

```txt
src/components/forms/file-upload-input.tsx
src/components/forms/index.ts
src/lib/constants/file.constants.ts
src/lib/utils/format-file-size.ts
src/lib/utils/resume-file.util.ts
```

| File | Purpose |
|---|---|
| `src/components/forms/file-upload-input.tsx` | Provides the shared file upload input component |
| `src/components/forms/index.ts` | Re-exports form components for cleaner imports |
| `src/lib/constants/file.constants.ts` | Stores shared file upload constants |
| `src/lib/utils/format-file-size.ts` | Formats file size into a readable display value |
| `src/lib/utils/resume-file.util.ts` | Stores resume-specific file validation helpers |

---

### Upload Rules

The default upload configuration supports resume/CV files.

Accepted file formats:

```txt
PDF
DOCX
```

Default maximum file size:

```txt
5 MB
```

These rules are stored outside the component so they can be reused by upload forms, frontend validation, and future file-related features.

---

### Resume File Validation Utilities

Resume file validation should not be hardcoded inside feature components.

The following logic should be placed in:

```txt
src/lib/utils/resume-file.util.ts
```

Expected helpers:

```ts
isAcceptedResumeFile(file)
isValidResumeFileSize(file)
getAcceptedResumeFileInputValue()
```

These helpers should use constants from:

```txt
src/lib/constants/file.constants.ts
```

This keeps resume upload validation consistent across shared upload inputs, feature forms, and future upload flows.

---

### Component Responsibility

`FileUploadInput` is responsible for the upload UI only.

#### Should handle

- File selection from the input
- File selection from drag and drop
- Basic file type validation
- Basic file size validation
- Displaying the selected file
- Removing the selected file

#### Should not handle

- Calling the upload API
- Creating resume records
- Linking files to candidates
- Handling backend upload response
- Managing feature-specific business logic

Those responsibilities should stay inside feature-level API functions, hooks, or forms.

---

### Usage Location

The shared file upload component should be placed in:

```txt
src/components/forms
```

Feature-specific upload logic should be placed in the relevant feature folder.

Example:

```txt
src/features/resumes/api
src/features/resumes/components
src/features/files/api
```

---

### Key Decisions

- File upload UI should be reusable across features.
- Upload constants should be stored in `src/lib/constants`.
- File size formatting should be stored in `src/lib/utils`.
- Resume-specific file validation should be stored in `src/lib/utils/resume-file.util.ts`.
- The upload component should not call APIs directly.
- File upload requests should use the shared API client.
- The backend upload endpoint should remain configured in `api-endpoints.ts`.
- Resume upload should follow the backend file upload contract using `multipart/form-data`.

---

## 7. Shared Table/List Component Configuration

### Purpose

This section defines the shared table component used across list-based screens in the frontend.

The goal is to keep list presentation consistent across dashboard modules and avoid rewriting table markup in each feature.

Shared table components are used for screens such as:

- Candidates list
- Resumes list
- Job descriptions list
- Applications list
- Evaluations list

---

### Files

```txt
src/components/common/data-table.tsx
src/components/common/index.ts
```

| File | Purpose |
|---|---|
| `src/components/common/data-table.tsx` | Provides a reusable table component for displaying list data |
| `src/components/common/index.ts` | Re-exports common components for cleaner imports |

---

### Component Responsibility

`DataTable` is responsible for rendering list data in a consistent table layout.

#### Handles

- Table container
- Table header
- Table rows
- Table cells
- Empty state message when there is no data
- Basic horizontal overflow for wide tables

The table receives data and column definitions from the feature that uses it.

---

### Usage Pattern

Feature components should define their own columns and pass data into the shared table.

Example feature locations:

```txt
src/features/candidates/components
src/features/resumes/components
src/features/job-descriptions/components
src/features/applications/components
src/features/evaluations/components
```

The shared table should not know business-specific fields such as candidate name, application status, or evaluation score. Those details should stay inside the feature component.

---

### Key Decisions

- Table UI should be placed in `src/components/common`.
- Feature modules should reuse `DataTable` instead of creating separate table markup.
- Column definitions should be owned by each feature.
- `DataTable` should not call APIs directly.
- `DataTable` should not contain business logic.
- Pagination, filtering, sorting, and row actions should be handled by feature-level components or added as separate shared components later.
- Empty list display should be consistent across list screens.

---

## 8. Shared Detail Page Layout Configuration

### Purpose

This section defines the shared layout used by detail pages in the dashboard.

The goal is to keep detail screens consistent across all main modules and avoid rewriting the same page structure multiple times.

Shared detail layouts are used for routes such as:

- `/candidates/[id]`
- `/resumes/[id]`
- `/job-descriptions/[id]`
- `/applications/[id]`
- `/evaluations/[id]`

---

### Files

```txt
src/components/common/detail-page-layout.tsx
src/components/common/detail-section.tsx
src/components/common/index.ts
```

| File | Purpose |
|---|---|
| `src/components/common/detail-page-layout.tsx` | Provides the shared wrapper for detail pages |
| `src/components/common/detail-section.tsx` | Provides reusable sections inside detail pages |
| `src/components/common/index.ts` | Re-exports common components for cleaner imports |

---

### Layout Structure

```txt
DetailPageLayout
  Page Header
    Back Link
    Title
    Description
    Actions
  Detail Content
    DetailSection
    DetailSection
    DetailSection
```

`DetailPageLayout` defines the overall structure of a detail page.

`DetailSection` defines reusable content blocks inside the detail page.

---

### Component Responsibility

`DetailPageLayout` is responsible for the common page-level layout, including:

- Back navigation
- Page title
- Page description
- Page actions
- Main content wrapper

`DetailSection` is responsible for grouping related detail content into clear sections.

---

### Key Decisions

- Detail page layout should be placed in `src/components/common`.
- Detail pages should reuse `DetailPageLayout` and `DetailSection`.
- Detail layout components should not contain business logic.
- Detail layout components should not call APIs directly.
- Feature-specific data rendering should stay inside each feature module.
- Loading, error, and empty states should be handled separately by shared feedback components or feature-level logic.

---

## 9. Toast and Notification Configuration

### Purpose

This section defines the shared toast and notification setup used across the frontend.

The goal is to provide a consistent way to show short user feedback after actions such as create, update, delete, upload, or failed API requests.

Toast notifications are used for quick feedback messages such as:

- Candidate created successfully
- Resume uploaded successfully
- Job description saved successfully
- Application status updated successfully
- Request failed

---

### Package

The frontend uses `sonner` for toast notifications.

```txt
sonner
```

---

### Files

```txt
src/components/feedback/toast.tsx
src/providers/toast-provider.tsx
src/components/feedback/index.ts
src/app/layout.tsx
```

| File | Purpose |
|---|---|
| `src/components/feedback/toast.tsx` | Provides shared toast helper functions |
| `src/providers/toast-provider.tsx` | Registers the toast renderer for the app |
| `src/components/feedback/index.ts` | Re-exports toast utilities for cleaner imports |
| `src/app/layout.tsx` | Mounts the toast provider at the root layout |

---

### Toast Provider

The toast provider is mounted once in the root layout.

```txt
RootLayout
  body
    children
    ToastProvider
```

This allows toast notifications to be triggered from any page or component in the application.

---

### Toast Types

The shared toast configuration supports common notification types:

```txt
success
error
info
warning
```

These types should be used based on the result of user actions or API requests.

---

### Usage Rule

Toast notifications should be used for short feedback messages.

#### Good use cases

- Successful create/update/delete actions
- Successful file upload
- Failed API requests
- Short system feedback after user actions
- Simple action-blocking validation in compact forms, such as missing upload inputs or invalid file type

#### Avoid using toast for

- Complex or multi-field form validation errors
- Long error explanations
- Loading states
- Page-level error states

For complex form validation, errors should be displayed near the relevant form fields. For page-level failures, use a dedicated error state component.

---

### Resume Upload Toast Flow

The resume upload form should show toast feedback for:

- File selected
- Missing Candidate ID
- Missing CV file
- Invalid file format
- File too large
- Upload success
- Upload failure

Feature components should import the shared helper:

```ts
import { showToast } from '@/components/feedback/toast';
```

Do not import `toast` from `sonner` directly inside feature components.

---

### Key Decisions

- Toast UI should be handled through a shared provider.
- Toast helpers should be placed in `src/components/feedback`.
- The toast provider should be mounted in `src/app/layout.tsx`.
- Toast should be used for short, temporary feedback.
- Simple upload validation may use toast feedback in MVP.
- Complex form validation errors should be displayed near the relevant form fields.
- Page-level errors should use shared error state components instead of toast only.

---

## 10. Empty State Configuration

### Purpose

This section defines the shared empty state component used across the frontend.

The goal is to keep empty data displays consistent across pages, tables, detail sections, and search results.

Empty states are used when:

- A list has no records
- A table has no rows
- A detail section has no related data
- A search or filter returns no result
- A feature has no data created yet

---

### Files

```txt
src/components/feedback/empty-state.tsx
src/components/feedback/index.ts
```

| File | Purpose |
|---|---|
| `src/components/feedback/empty-state.tsx` | Provides the shared empty state component |
| `src/components/feedback/index.ts` | Re-exports feedback components for cleaner imports |

---

### Component Responsibility

`EmptyState` is responsible for displaying a consistent UI when there is no data to show.

It supports:

- Empty state title
- Optional description
- Optional action area

The action area can be used for buttons such as:

- Create candidate
- Upload resume
- Add job description
- Clear filters

---

### Usage Locations

The shared empty state can be used in:

```txt
src/app/(dashboard)/*
src/features/*/components
src/components/common/data-table.tsx
src/components/common/detail-section.tsx
```

`DataTable` should use `EmptyState` when the provided data array is empty.

---

### Key Decisions

- Empty state UI should be placed in `src/components/feedback`.
- Empty state should be reused instead of writing custom empty messages in each feature.
- Empty state should not call APIs directly.
- Empty state should not contain business logic.
- Feature-specific actions should be passed into the component from the page or feature component.
- Empty state should be separate from loading and error states.

---

## 11. Confirm Dialog Configuration

### Purpose

This section defines the shared confirm dialog used for actions that may change or remove important data.

The goal is to provide a consistent confirmation UI before users perform risky actions such as delete, deactivate, reject, or remove.

Confirm dialogs are used for actions such as:

- Delete candidate
- Delete resume
- Delete job description
- Delete application
- Delete evaluation
- Deactivate job description
- Reject application

---

### Files

```txt
src/components/common/confirm-dialog.tsx
src/components/common/index.ts
```

| File | Purpose |
|---|---|
| `src/components/common/confirm-dialog.tsx` | Provides the shared confirmation dialog component |
| `src/components/common/index.ts` | Re-exports common components for cleaner imports |

---

### Component Responsibility

`ConfirmDialog` is responsible for displaying a confirmation modal before executing a risky action.

It supports:

- Dialog title
- Dialog description
- Confirm button
- Cancel button
- Loading state while the action is processing
- Danger or warning visual variants
- Optional custom content inside the dialog

---

### Usage Rule

Confirm dialogs should be used only for actions that require user confirmation.

#### Good use cases

- Delete a resource
- Deactivate a resource
- Reject an application
- Remove an uploaded file
- Trigger an action that cannot be easily undone

#### Avoid using confirm dialogs for

- Navigation
- Search
- Filtering
- Opening detail pages
- Simple UI interactions

---

### Key Decisions

- Confirm dialog should be placed in `src/components/common`.
- The dialog should not call APIs directly.
- The dialog should not contain feature-specific business logic.
- Feature components are responsible for opening the dialog and handling confirm actions.
- Destructive actions should use the danger variant.
- State-changing but non-delete actions can use the warning variant.
- Loading state should be supported while the confirm action is being processed.

---

## 12. Feature Module Folder Structure

### Purpose

This section defines the folder structure for frontend feature modules.

The goal is to organize business logic by domain so each module can grow independently while keeping the project structure predictable.

Feature modules are placed under:

```txt
src/features
```

---

### Modules

The frontend contains the following feature modules:

```txt
src/features/
  files/
  candidates/
  resumes/
  job-descriptions/
  applications/
  evaluations/
```

| Module | Purpose |
|---|---|
| `files` | Handles shared file-related logic such as upload metadata and file API calls |
| `candidates` | Handles candidate-related UI, API calls, hooks, types, and validation |
| `resumes` | Handles resume/CV-related UI, API calls, hooks, types, and validation |
| `job-descriptions` | Handles job description-related UI, API calls, hooks, types, and validation |
| `applications` | Handles application-related UI, API calls, hooks, types, and validation |
| `evaluations` | Handles evaluation-related UI, API calls, hooks, and types |

---

### Standard Module Structure

Each feature module should follow this structure:

```txt
module-name/
  api/
  components/
  hooks/
  types/
```

For modules that contain forms, add:

```txt
validations/
```

Example:

```txt
src/features/candidates/
  api/
  components/
  hooks/
  types/
  validations/
```

---

### Folder Responsibilities

| Folder | Purpose |
|---|---|
| `api` | Stores API functions for the module |
| `components` | Stores UI components used only by that module |
| `hooks` | Stores custom hooks for module-specific logic |
| `types` | Stores TypeScript types for the module |
| `validations` | Stores validation schemas for module forms |

---

### Current Structure

```txt
src/features/
  applications/
    api/
    components/
    hooks/
    types/
    validations/

  candidates/
    api/
    components/
    hooks/
    types/
    validations/

  evaluations/
    api/
    components/
    hooks/
    types/

  files/
    api/
    components/
    hooks/
    types/

  job-descriptions/
    api/
    components/
    hooks/
    types/
    validations/

  resumes/
    api/
    components/
    hooks/
    types/
    validations/
```

---

### Key Decisions

- Business logic should be grouped by feature module.
- Shared UI components should not be placed inside feature modules.
- Feature-specific components should stay inside their owning module.
- API functions should be placed in the module's `api` folder.
- Feature-specific hooks should be placed in the module's `hooks` folder.
- Feature-specific types should be placed in the module's `types` folder.
- Form validation schemas should be placed in the module's `validations` folder.
- Empty folders may use `.gitkeep` until real files are added.

---

## 13. Resume Upload Form Configuration

### Purpose

This section defines the feature-level resume upload form used by the `/resumes` page.

The form is responsible for collecting the Candidate ID, selecting a CV file, validating the file, and showing user feedback through toast notifications.

---

### Files

```txt
src/features/resumes/components/resume-upload-form.tsx
src/lib/constants/file.constants.ts
src/lib/utils/format-file-size.ts
src/lib/utils/resume-file.util.ts
src/components/feedback/toast.tsx
```

| File | Purpose |
|---|---|
| `src/features/resumes/components/resume-upload-form.tsx` | Renders the resume upload form and handles user interaction |
| `src/lib/constants/file.constants.ts` | Stores accepted file types, extensions, and max file size |
| `src/lib/utils/format-file-size.ts` | Formats file size for UI display |
| `src/lib/utils/resume-file.util.ts` | Provides resume file validation helpers |
| `src/components/feedback/toast.tsx` | Provides shared toast feedback helpers |

---

### Responsibilities

`ResumeUploadForm` should handle:

- Candidate ID input state
- Selected CV file state
- Submit state
- Calling shared resume file validation utilities
- Showing toast feedback
- Preparing for future upload API integration

`ResumeUploadForm` should not hardcode:

- Accepted MIME types
- Accepted file extensions
- Maximum file size
- File size formatting logic

These rules must come from shared constants and utilities.

---

### Current Validation Rules

- Candidate ID is required.
- CV file is required.
- Only PDF and DOCX files are accepted.
- File size must not exceed `DEFAULT_MAX_FILE_SIZE`.
- File size message must use `formatFileSize`.

---

### Toast Feedback

The form should show toast notifications for:

- File selected
- Missing Candidate ID
- Missing CV file
- Invalid file format
- File too large
- Upload success
- Upload failure

---

### Future API Integration

The current mock upload delay should be replaced later with the real resume upload API call.

Example future direction:

```ts
await uploadResume({
  candidateId: normalizedCandidateId,
  file: selectedFile,
});
```

The API call should be placed in the resume feature API layer, not directly implemented as raw `fetch` inside the component.

---

## 14. Current MVP UI Direction

### Purpose

This section summarizes the current UI direction after the dashboard layout and resume upload screen updates.

The current visual direction is a clean business dashboard:

```txt
AppShell
  Sidebar
  Main area
    Header
    MainContent
      Feature page heading
      Feature content
```

---

### Visual Rules

Use:

- `bg-slate-50` for the app background
- `bg-white` for surfaces
- `border-slate-200` for layout separation
- `text-slate-950` for strong text
- `text-slate-600` for readable descriptions
- `text-slate-500` for helper text
- `blue-600` for primary actions and active states
- `rounded-xl` for controls
- `rounded-2xl` for panels and upload zones

Avoid:

- Dark sidebar in MVP
- Low-contrast text
- Strong gradients as the main visual system
- Native browser-looking file inputs
- Hardcoded file validation logic inside components
- Raw `fetch` calls in pages or components
- Custom Tailwind tokens that are not defined in `tailwind.config.ts`

---

### Target Feel

The dashboard should feel like:

```txt
Clean internal SaaS tool
Readable recruitment workspace
Simple business dashboard
No visual noise
No low-contrast text
No over-designed gradients
```

---

## 15. Resume Upload Page Implementation

### Purpose

Implemented the basic CV upload page for the resume feature.

This task allows users to upload a CV file and create a Resume record linked to an existing Candidate.

---

### Implemented Scope

- Created the `/resumes` page.
- Added a basic CV upload form.
- Added Candidate ID input for linking the uploaded CV to a candidate.
- Added PDF/DOCX file selection.
- Added frontend validation for required Candidate ID, required file, file type, and file size.
- Integrated file upload with the backend file endpoint.
- Integrated resume creation with the backend resume endpoint.
- Added upload loading state.
- Added success and error feedback.
- Refactored the upload flow into a resume feature hook.
- Moved upload hook types into a separate type file.

---

### Updated Files

```txt
src/app/(dashboard)/resumes/page.tsx

src/features/files/api/file.api.ts
src/features/files/types/file.type.ts

src/features/resumes/api/resume.api.ts
src/features/resumes/components/resume-upload-form.tsx
src/features/resumes/hooks/use-upload-resume.ts
src/features/resumes/types/resume.type.ts
src/features/resumes/types/upload-resume.type.ts
src/features/resumes/validations/resume.validation.ts
```

### Backend Endpoints Used

```
POST /files/upload
POST /resumes
```

### Result

The `/resumes` page can now upload a CV file, create a related Resume record, and display the created resume status.
A successful upload displays:

```
Resume created successfully. Status: PENDING
```

---

## 16. Candidate Creation Form Implementation

### Purpose

Implemented the candidate creation page and connected it with the candidate API.

This task allows users to create a candidate profile from the dashboard before linking resumes, applications, and evaluations.

---

### Implemented Scope

- Created the `/candidates/new` page.
- Added the candidate creation form UI.
- Added input fields for candidate profile information.
- Added frontend validation for candidate form data.
- Integrated candidate creation with the backend candidate endpoint.
- Added create loading state.
- Added success and error feedback using the shared toast helper.
- Refactored candidate creation logic into a feature hook.
- Moved candidate form types into a separate type file.
- Updated dashboard content layout so candidate and resume pages align consistently.

---

### Updated Files

```txt
src/app/(dashboard)/candidates/new/page.tsx
src/app/(dashboard)/resumes/page.tsx

src/components/layout/app-shell.tsx
src/components/layout/main-content.tsx

src/features/candidates/api/candidate.api.ts
src/features/candidates/components/candidate-form.tsx
src/features/candidates/hooks/use-create-candidate.ts
src/features/candidates/types/candidate-form.type.ts
src/features/candidates/types/candidate.type.ts
src/features/candidates/types/create-candidate.type.ts
src/features/candidates/validations/candidate.validation.ts

src/features/resumes/components/resume-upload-form.tsx
```

### Backend Endpoint Used

```
POST /candidates
```

### Result

The `/candidates/new` page can now create a candidate profile through the backend API.
A successful create action displays toast feedback and resets the form.

---

## 17. Candidate List Page Implementation

### Purpose

Implemented the candidate list page for the candidate feature.

This task allows users to view created candidate profiles from the dashboard and navigate to candidate creation or candidate detail pages.

---

### Implemented Scope

- Created the `/candidates` page.
- Added candidate list display.
- Added `Create Candidate` action linking to `/candidates/new`.
- Added candidate table columns for candidate name, email, phone, location, and action.
- Integrated candidate list fetching with the backend candidate endpoint.
- Added loading state for candidate list fetching.
- Added empty state when there are no candidates.
- Added error state with retry action.
- Added toast feedback when candidate list loading fails.
- Added Zustand store for candidate list caching.
- Reset candidate list cache after creating a new candidate.
- Refactored shared UI components to use current Tailwind classes and existing theme extensions.
- Reused global components from `src/components` for table, loading, empty, confirm dialog, detail layout, detail section, skeleton, and file upload UI.

---

### Updated Files

```txt
package.json
package-lock.json

src/app/(dashboard)/candidates/page.tsx

src/components/common/confirm-dialog.tsx
src/components/common/data-table.tsx
src/components/common/detail-page-layout.tsx
src/components/common/detail-section.tsx

src/components/feedback/empty-state.tsx
src/components/feedback/loading-state.tsx
src/components/feedback/skeleton.tsx

src/components/forms/file-upload-input.tsx

src/features/candidates/api/candidate.api.ts
src/features/candidates/components/candidate-form.tsx
src/features/candidates/components/candidate-list.tsx
src/features/candidates/hooks/use-candidates.ts
src/features/candidates/stores/candidate-list.store.ts
src/features/candidates/types/candidate-list-store.type.ts
src/features/candidates/types/candidate-list.type.ts
src/features/candidates/types/candidate-query.type.ts

src/features/resumes/components/resume-upload-form.tsx
src/lib/utils/candidate-contact.util.ts
```

### Backend Endpoint Used

```
GET /candidates
```

### State Management

Candidate list data is cached with Zustand in:

```
src/features/candidates/stores/candidate-list.store.ts
```

The store keeps:

```
candidates
hasLoaded
isLoading
errorMessage
```

The list page uses the cache to avoid showing loading repeatedly when users return to `/candidates`.

After a candidate is created successfully, the candidate list cache is reset so the next list load fetches fresh data from the backend.

### Shared Component Usage

The candidate list page uses shared UI components instead of recreating one-off UI inside the feature component:

```
src/components/common/data-table.tsx
src/components/feedback/empty-state.tsx
src/components/feedback/loading-state.tsx
src/components/feedback/toast.tsx
```

Shared component styling was also adjusted to use stable Tailwind classes such as:

```
bg-white
border-slate-200
text-slate-950
text-slate-600
text-slate-500
bg-blue-600
hover:bg-blue-700
rounded-xl
rounded-2xl
shadow-card
shadow-panel
```

### Important Notes

- Candidate list fetching must stay in `features/candidates/api/candidate.api.ts`.
- Candidate list cache must stay inside the candidate feature module, not in `src/lib`.
- Feature components should reuse shared components from `src/components` before creating new UI.
- `CandidateList` should not define API calls, reusable utility functions, or store types inline.
- `DataTable` remains business-agnostic; candidate-specific columns stay inside `CandidateList`.
- Phone is displayed in a separate table column instead of being merged into the contact column.

### Result

The `/candidates` page can now display candidate profiles from the backend.

The page supports loading, empty, error, retry, cached list data, and navigation to create or view candidate records.