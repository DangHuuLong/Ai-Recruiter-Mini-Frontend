# Application UI Overview

## Purpose

The Application UI allows recruiters to create, review, and track applications from the frontend dashboard.

An application links one candidate, one resume, and one active job description into a trackable hiring flow.

This UI connects the frontend with the existing backend Application APIs.

## Main Routes

```text
/applications
/applications/new
/applications/:id
```

## Implemented Features

- Display a list of applications.
- View application detail.
- Create a new application by selecting a candidate, resume, and job description.
- Load resumes after a candidate is selected.
- Show only active job descriptions in the create application form.
- Display application status using status badges.
- Update application status from the detail page.
- Add an optional note when updating application status.
- Display application events in a timeline-style list.
- Link to related candidate, resume, and job description detail pages.

## Feature Structure

The frontend implementation is located in:

```text
src/features/applications
```

Main folders:

```text
api
components
types
```

## Route Files

```text
src/app/(dashboard)/applications/page.tsx
src/app/(dashboard)/applications/new/page.tsx
src/app/(dashboard)/applications/[id]/page.tsx
```

Route files should only compose feature components and pass route params. Business logic and API calls stay inside feature modules.

## Main Components

```text
src/features/applications/components/application-list.tsx
src/features/applications/components/application-form.tsx
src/features/applications/components/application-detail.tsx
src/features/applications/components/application-status-badge.tsx
src/features/applications/components/application-status-form.tsx
src/features/applications/components/application-events.tsx
```

| Component | Responsibility |
| --- | --- |
| `ApplicationList` | Loads and renders the application list table. |
| `ApplicationForm` | Handles the create application flow. |
| `ApplicationDetail` | Loads and renders full application detail. |
| `ApplicationStatusBadge` | Displays application status consistently. |
| `ApplicationStatusForm` | Updates application status and optional status note. |
| `ApplicationEvents` | Loads and renders application audit events. |

## API Usage

The feature uses the shared `apiClient` and endpoint constants from:

```text
src/lib/api
```

Main API operations:

```text
GET    /applications
POST   /applications
GET    /applications/:id
PATCH  /applications/:id
PATCH  /applications/:id/status
GET    /applications/:id/events
GET    /candidates/:id/resumes
GET    /job-descriptions
```

The frontend endpoint constants are stored in:

```text
src/lib/api/api-endpoints.ts
```

Application-specific API functions are stored in:

```text
src/features/applications/api/application.api.ts
```

## Create Application Flow

```text
Open /applications/new
↓
Load candidates and job descriptions
↓
User selects candidate
↓
Frontend loads resumes for selected candidate
↓
User selects resume
↓
User selects active job description
↓
User optionally enters source and notes
↓
POST /applications
↓
Redirect to /applications/:id
```

Important rules:

- Resume selection depends on the selected candidate.
- The backend remains responsible for enforcing that the resume belongs to the selected candidate.
- The UI filters job descriptions by `isActive = true` before showing options.
- The backend remains the source of truth for final validation.

## Application Detail Flow

```text
Open /applications/:id
↓
GET /applications/:id
↓
Display candidate, resume, JD, status, source, notes, counts, and timestamps
↓
GET /applications/:id/events
↓
Display application audit events
```

The detail page also links to related resources:

```text
/candidates/:candidateId
/resumes/:resumeId
/job-descriptions/:jobDescriptionId
```

## Status Update Flow

```text
User selects new status
↓
User optionally enters a status note
↓
PATCH /applications/:id/status
↓
Update local application state
↓
Reload application events
```

If the status changes, the backend creates a `STATUS_CHANGED` event.

If the selected status is the same as the current status, the backend may return the existing application without creating a duplicate event.

## Application Status Values

```text
DRAFT
APPLIED
SCREENING
SHORTLISTED
INTERVIEWING
OFFER
HIRED
REJECTED
WITHDRAWN
```

The frontend stores these values in:

```text
src/features/applications/types/application.type.ts
```

Status values are API enum values and should remain in uppercase snake case.

## Application Events

The events UI supports known event types:

```text
APPLICATION_CREATED
STATUS_CHANGED
```

For `STATUS_CHANGED`, the UI displays:

```text
fromStatus
toStatus
note
createdAt
```

For unknown event types, the UI falls back to rendering the event data as JSON.

## UI Rules

- Use the shared dashboard layout from `src/app/(dashboard)/layout.tsx`.
- Use shared feedback components such as `LoadingState`, `EmptyState`, and `showToast`.
- Use the shared `DataTable` component for application lists.
- Do not call `fetch` directly inside pages or components.
- API calls must go through feature API files and the shared `apiClient`.
- Keep application-specific types in the application feature `types` folder.
- Keep route files thin and move UI logic into feature components.

## Notes

The UI does not call the AI service directly.

Applications are created and tracked through the backend API. Evaluations can later be triggered from the application domain once the evaluation UI is connected.
