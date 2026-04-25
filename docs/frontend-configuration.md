# Frontend Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** Shared frontend configuration for routes, navigation, and API communication.

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

```
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

```
/api
```

Therefore, endpoint constants should not repeat `/api`.

#### Correct:

```typescript
/candidates
/files/upload
/job-descriptions
```

#### Incorrect:

```typescript
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

```
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

```
/files/upload
```

---

### Key Decisions

- ✅ Pages and components should **not** call `fetch` directly
- ✅ Feature API files should use the shared `apiClient`
- ✅ Backend endpoint paths should be stored in `src/lib/api/api-endpoints.ts`
- ✅ API response and error types should be stored in `src/lib/api/api-types.ts`
- ✅ API errors should be normalized through `src/lib/api/api-error.ts`
- ✅ The API base URL should come from `src/config/env.config.ts`
- ✅ Endpoint constants should **not** include the `/api` prefix
- ✅ Upload requests should be handled by the shared API client
- ✅ API response types should stay aligned with the backend API contract

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

```
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

```
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

- ✅ Loading UI should be placed in `src/components/feedback`
- ✅ Pages and feature components should reuse shared loading components
- ✅ Loading UI should not be recreated separately in every feature
- ✅ API client should not manage loading state directly
- ✅ Loading state should be handled by pages, feature hooks, or the future data-fetching layer
- ✅ Skeleton components should be used for tables, cards, and detail pages when layout stability is useful

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

```
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

```
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

```
src/lib/validations
```

Feature-specific validation schemas should be placed inside each feature.

Example:

```
src/features/candidates/validations/candidate.validation.ts
src/features/job-descriptions/validations/job-description.validation.ts
src/features/applications/validations/application.validation.ts
```

This keeps common validation reusable while keeping business-specific rules close to the feature that owns them.

---

### Shared Validation Rules

The shared validation configuration includes common rules such as:

```
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

- ✅ Validation logic should not be written directly inside page components
- ✅ Common validation rules should be placed in `src/lib/validations`
- ✅ Feature-specific schemas should stay inside their own feature folder
- ✅ Form types should be inferred from Zod schemas when possible
- ✅ Frontend validation should match backend expectations, but backend remains the source of truth
- ✅ Validation messages should be clear and consistent across forms
- ✅ HTML form values may need coercion, especially for number inputs

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

```
src/components/forms/file-upload-input.tsx
src/components/forms/index.ts
src/lib/constants/file.constants.ts
src/lib/utils/format-file-size.ts
```

| File | Purpose |
|---|---|
| `src/components/forms/file-upload-input.tsx` | Provides the shared file upload input component |
| `src/components/forms/index.ts` | Re-exports form components for cleaner imports |
| `src/lib/constants/file.constants.ts` | Stores shared file upload constants |
| `src/lib/utils/format-file-size.ts` | Formats file size into a readable display value |

---

### Upload Rules

The default upload configuration supports resume/CV files.

Accepted file formats:

```
PDF
DOCX
```

Default maximum file size:

```
5 MB
```

These rules are stored outside the component so they can be reused by upload forms, frontend validation, and future file-related features.

---

### Component Responsibility

`FileUploadInput` is responsible for the upload UI only.

#### Should handle:

- File selection from the input
- File selection from drag and drop
- Basic file type validation
- Basic file size validation
- Displaying the selected file
- Removing the selected file

#### Should NOT handle:

- Calling the upload API
- Creating resume records
- Linking files to candidates
- Handling backend upload response
- Managing feature-specific business logic

Those responsibilities should stay inside feature-level API functions, hooks, or forms.

---

### Usage Location

The shared file upload component should be placed in:

```
src/components/forms
```

Feature-specific upload logic should be placed in the relevant feature folder.

Example:

```
src/features/resumes/api
src/features/resumes/components
src/features/files/api
```

---

### Key Decisions

- ✅ File upload UI should be reusable across features
- ✅ Upload constants should be stored in `src/lib/constants`
- ✅ File size formatting should be stored in `src/lib/utils`
- ✅ The upload component should not call APIs directly
- ✅ File upload requests should use the shared API client
- ✅ The backend upload endpoint should remain configured in `api-endpoints.ts`
- ✅ Resume upload should follow the backend file upload contract using `multipart/form-data`

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

```
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

#### Handles:

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

```
src/features/candidates/components
src/features/resumes/components
src/features/job-descriptions/components
src/features/applications/components
src/features/evaluations/components
```

The shared table should not know business-specific fields such as candidate name, application status, or evaluation score. Those details should stay inside the feature component.

---

### Key Decisions

- ✅ Table UI should be placed in `src/components/common`
- ✅ Feature modules should reuse `DataTable` instead of creating separate table markup
- ✅ Column definitions should be owned by each feature
- ✅ `DataTable` should not call APIs directly
- ✅ `DataTable` should not contain business logic
- ✅ Pagination, filtering, sorting, and row actions should be handled by feature-level components or added as separate shared components later
- ✅ Empty list display should be consistent across list screens

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

```
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

- ✅ Detail page layout should be placed in `src/components/common`
- ✅ Detail pages should reuse `DetailPageLayout` and `DetailSection`
- ✅ Detail layout components should not contain business logic
- ✅ Detail layout components should not call APIs directly
- ✅ Feature-specific data rendering should stay inside each feature module
- ✅ Loading, error, and empty states should be handled separately by shared feedback components or feature-level logic