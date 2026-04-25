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