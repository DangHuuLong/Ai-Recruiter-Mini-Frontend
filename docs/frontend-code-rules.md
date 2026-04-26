# Frontend Code Generation Rules

**Project:** AI Recruiter Mini — Frontend  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Purpose:** Define code generation rules for AI-assisted development so generated code stays clean, consistent, and aligned with the existing frontend architecture.

---

## 1. Core Principle

Generated code must follow the existing project structure. Do not create large, self-contained UI files that mix component rendering, API calls, validation schemas, constants, utility functions, and types in one place.

Every file must have one clear responsibility.

The project already has shared folders for reusable logic. AI-generated code must reuse them instead of redefining logic locally.

---

## 2. Project Structure Rule

The frontend source code is organized as follows:

```txt
src/
├── app/
├── components/
│   ├── common/
│   ├── feedback/
│   ├── forms/
│   ├── layout/
│   └── ui/
├── config/
├── features/
│   ├── applications/
│   ├── candidates/
│   ├── evaluations/
│   ├── files/
│   ├── job-descriptions/
│   └── resumes/
├── hooks/
├── lib/
│   ├── api/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   └── validations/
└── providers/
```

Generated code must place files in the correct folder based on responsibility.

---

## 3. File Responsibility Rules

### `src/app`

Use only for route-level files.

Allowed responsibilities:

- Page composition
- Route layout composition
- Calling feature-level components
- Passing route params to feature components

Not allowed:

- API request functions
- Business logic
- Validation schemas
- Type definitions
- Utility functions
- Large UI sections that belong to feature components

Example:

```tsx
import { ResumeUploadForm } from '@/features/resumes/components/resume-upload-form';

export default function ResumesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Resume Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Resumes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Upload candidate CV files and prepare them for AI evaluation.
        </p>
      </div>

      <ResumeUploadForm />
    </div>
  );
}
```

---

### `src/components/common`

Use for reusable business-agnostic components.

Examples:

- `DataTable`
- `ConfirmDialog`
- `DetailPageLayout`
- `DetailSection`

Rules:

- Must not call APIs.
- Must not contain feature-specific business logic.
- Must receive data and actions through props.
- Must not import from `src/features/*`.

---

### `src/components/feedback`

Use for shared feedback UI.

Examples:

- `LoadingState`
- `Skeleton`
- `EmptyState`
- `toast.tsx`

Rules:

- Use `showToast` from `src/components/feedback/toast.tsx`.
- Do not import `toast` from `sonner` directly inside feature components.
- Do not create local toast helper functions inside UI files.

Correct:

```ts
import { showToast } from '@/components/feedback/toast';

showToast.success('CV uploaded successfully');
```

Incorrect:

```ts
import { toast } from 'sonner';

toast.success('CV uploaded successfully');
```

---

### `src/components/forms`

Use for reusable form controls.

Examples:

- `FileUploadInput`
- Shared input wrappers
- Reusable form field components

Rules:

- Components in this folder should be reusable.
- They should not call feature APIs.
- They should not know about feature-specific entities such as Candidate, Resume, Application, or Evaluation.
- Feature-specific form submit logic must stay inside feature modules.

---

### `src/components/layout`

Use only for global app layout components.

Examples:

- `AppShell`
- `Sidebar`
- `Header`
- `MainContent`

Rules:

- Sidebar navigation must use `src/config/navigation.config.ts`.
- Route paths must use `src/config/routes.config.ts`.
- Active navigation logic must use `src/lib/utils/navigation.ts`.
- Layout components should not contain feature business logic.

---

### `src/config`

Use for app-level configuration.

Examples:

- Routes
- Navigation items
- Environment configuration

Rules:

- Do not hardcode route strings in components when route constants already exist.
- Navigation items must not be duplicated inside `Sidebar`.

---

### `src/features/{module}`

Use for feature-specific code.

Each feature module should follow this structure:

```txt
features/{module}/
├── api/
├── components/
├── hooks/
├── types/
└── validations/
```

Rules:

- Feature API calls go in `api`.
- Feature UI goes in `components`.
- Feature stateful orchestration goes in `hooks`.
- Feature types go in `types`.
- Feature validation schemas go in `validations`.

Do not put all feature logic into one component file.

---

### `src/lib/api`

Use for shared API infrastructure.

Examples:

- `api-client.ts`
- `api-error.ts`
- `api-endpoints.ts`
- `api-types.ts`

Rules:

- Pages and components must not call `fetch` directly.
- Feature API files must use the shared `apiClient`.
- Endpoint constants should be stored in `api-endpoints.ts`.
- The frontend API base URL already contains `/api`, so endpoint constants must not repeat `/api`.

Correct:

```ts
apiClient.post('/resumes', payload);
```

Incorrect:

```ts
fetch('/api/resumes');
```

---

### `src/lib/constants`

Use for shared constants.

Examples:

- File size constants
- Accepted file types
- Shared numeric limits
- Shared UI constants

Rules:

- Do not hardcode repeated values in components.
- If a value is reused by more than one file, move it to constants.
- Constants should be named clearly and exported as readonly when possible.

Example:

```ts
export const DEFAULT_MAX_FILE_SIZE = 5 * FILE_SIZE.MB;
```

---

### `src/lib/utils`

Use for pure utility functions.

Examples:

- `cn`
- `formatFileSize`
- `resume-file.util.ts`
- Navigation matching helpers

Rules:

- Utility functions must be pure when possible.
- Utility functions must not render JSX.
- Utility functions must not call React hooks.
- Utility functions must not call APIs.
- If a component contains reusable helper logic, move it to `src/lib/utils`.

Correct:

```ts
import { isAcceptedResumeFile } from '@/lib/utils/resume-file.util';
```

Incorrect:

```tsx
function isAcceptedResumeFile(file: File) {
  // defined inside resume-upload-form.tsx
}
```

---

### `src/lib/types`

Use for shared TypeScript types.

Examples:

- Navigation types
- Shared option types
- Common UI types

Rules:

- Shared types must not be duplicated in feature files.
- Feature-specific types should stay inside `features/{module}/types`.
- API response types should stay inside `src/lib/api/api-types.ts`.

---

### `src/lib/validations`

Use for shared validation rules.

Examples:

- `requiredString`
- `emailSchema`
- Common Zod helpers

Rules:

- Shared validation helpers go in `src/lib/validations`.
- Feature-specific schemas go in `features/{module}/validations`.
- Do not define Zod schemas directly inside page files.
- Avoid defining schemas inside UI components unless the schema is truly local and non-reusable.

---

### `src/providers`

Use for app-level providers.

Examples:

- `ToastProvider`
- Future query/client/theme providers

Rules:

- Providers should be mounted at the correct layout level.
- Do not create duplicate providers inside feature components.

---

## 4. Component Code Rules

### Rule 1: Components should focus on rendering and user interaction

A component may handle:

- Local UI state
- Form input state
- Event handlers
- Calling feature hooks
- Rendering UI

A component should not contain:

- API implementation
- Large validation schemas
- Shared constants
- Reusable utility functions
- Feature type definitions
- Complex data transformation logic

---

### Rule 2: Keep component files small

Prefer component files under 150 lines when possible.

If a component grows too large, split it into:

- Smaller child components
- A feature hook
- A utility file
- A validation file
- A type file

Do not solve large-file problems by adding comments only. Split the logic.

---

### Rule 3: No mixed responsibility files

Do not create files that contain all of these together:

- JSX component
- API request functions
- Type declarations
- Validation schema
- Constants
- Utility functions

Incorrect:

```tsx
// resume-upload-form.tsx

type Resume = { ... };
const ACCEPTED_TYPES = [...];
function formatFileSize() { ... }
async function uploadFile() { ... }
const schema = z.object({ ... });
export function ResumeUploadForm() { ... }
```

Correct:

```txt
features/resumes/components/resume-upload-form.tsx
features/resumes/api/resume.api.ts
features/resumes/types/resume.type.ts
features/resumes/validations/resume.validation.ts
lib/constants/file.constants.ts
lib/utils/format-file-size.ts
lib/utils/resume-file.util.ts
```

---

## 5. API Code Rules

### Rule 1: No raw `fetch` in pages or components

All API calls must go through feature API files and the shared `apiClient`.

Correct:

```ts
// features/resumes/api/resume.api.ts
export const createResume = (payload: CreateResumePayload) => {
  return apiClient.post<ApiResponse<Resume>>('/resumes', payload);
};
```

Incorrect:

```tsx
// resume-upload-form.tsx
await fetch('/api/resumes', {
  method: 'POST',
  body: JSON.stringify(payload),
});
```

---

### Rule 2: Cross-feature flows should use hooks

If a UI action needs multiple API calls, coordinate them inside a feature hook.

Example:

```txt
features/resumes/hooks/use-upload-resume.ts
```

This hook can coordinate:

```txt
POST /files/upload
POST /resumes
```

The UI component should call the hook, not manually orchestrate multiple API calls inline.

---

## 6. TypeScript Rules

### Rule 1: Do not define reusable types inside UI components

Feature-specific types go in:

```txt
features/{module}/types
```

Shared types go in:

```txt
src/lib/types
```

API response types go in:

```txt
src/lib/api/api-types.ts
```

---

### Rule 2: Prefer named exports

Use named exports for components, hooks, API functions, utilities, constants, and types.

Correct:

```ts
export function ResumeUploadForm() {}
export const createResume = () => {};
export type Resume = {};
```

Avoid default exports except where Next.js requires them, such as:

```txt
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
```

---

### Rule 3: Avoid `any`

Do not use `any` unless there is a clear reason.

Prefer:

- Explicit types
- Generic types
- `unknown` with narrowing
- API response types

---

## 7. Validation Rules

### Rule 1: Shared validation belongs in `src/lib/validations`

Use this for common validation helpers.

Example:

```ts
requiredString
emailSchema
optionalString
```

---

### Rule 2: Feature schemas belong in feature folders

Example:

```txt
features/resumes/validations/resume.validation.ts
```

Do not define feature Zod schemas inside page files or large UI components.

---

### Rule 3: File validation must reuse constants and utilities

For resume upload, use:

```txt
src/lib/constants/file.constants.ts
src/lib/utils/format-file-size.ts
src/lib/utils/resume-file.util.ts
```

Do not hardcode MIME types, extensions, or file size limits inside UI components.

---

## 8. Toast and Feedback Rules

### Rule 1: Use shared toast helper

Use:

```ts
import { showToast } from '@/components/feedback/toast';
```

Do not import `toast` from `sonner` directly in pages or feature components.

---

### Rule 2: Use shared feedback components

Use existing feedback components before creating new ones:

```txt
src/components/feedback/loading-state.tsx
src/components/feedback/skeleton.tsx
src/components/feedback/empty-state.tsx
src/components/feedback/toast.tsx
```

Do not create one-off loading, empty, or toast components inside feature folders unless there is a specific feature requirement.

---

## 9. UI Styling Rules

### Rule 1: Follow the project business dashboard style

Use readable, business-friendly Tailwind classes:

```txt
bg-slate-50
bg-white
border-slate-200
text-slate-950
text-slate-600
text-slate-500
bg-blue-600
hover:bg-blue-700
bg-blue-50
text-blue-700
```

Avoid:

- Low-contrast text
- Strong gradients
- Bright decorative backgrounds
- Hard-to-read color combinations
- Native browser-looking file inputs
- Heavy shadows everywhere

---

### Rule 2: Reuse layout components

Do not recreate dashboard layout inside pages.

Use existing layout structure:

```txt
src/app/(dashboard)/layout.tsx
src/components/layout/app-shell.tsx
src/components/layout/sidebar.tsx
src/components/layout/header.tsx
src/components/layout/main-content.tsx
```

---

### Rule 3: Prefer shared components

Before creating new UI, check whether the project already has:

```txt
src/components/common
src/components/feedback
src/components/forms
src/components/ui
```

If a shared component exists, use it instead of recreating similar markup.

---

## 10. Import Rules

### Rule 1: Use path aliases

Use `@/` imports instead of long relative paths.

Correct:

```ts
import { showToast } from '@/components/feedback/toast';
import { createResume } from '@/features/resumes/api/resume.api';
```

Incorrect:

```ts
import { showToast } from '../../../components/feedback/toast';
```

---

### Rule 2: Import from the correct layer

A feature component may import from:

```txt
src/components
src/config
src/features/{same-module}
src/lib
```

A shared component in `src/components/common`, `src/components/forms`, or `src/components/feedback` must not import from feature modules.

This prevents shared components from becoming feature-specific.

---

## 11. AI Code Generation Checklist

Before generating code, AI must check:

```txt
1. Is there already a shared component for this UI?
2. Is there already a constant for this value?
3. Is there already a utility function for this logic?
4. Is there already a toast/helper/provider for this behavior?
5. Should this type live in a feature `types` folder?
6. Should this validation live in a feature `validations` folder?
7. Should this API call live in a feature `api` folder?
8. Should this multi-step action live in a feature `hook`?
9. Is this file mixing UI, API, validation, constants, and types?
10. Can this component be smaller and cleaner by extracting logic?
```

If the answer shows mixed responsibilities, AI must split the code into proper files.

---

## 12. Required Prompt for AI-Assisted Coding

Use this prompt before asking AI to generate or modify frontend code:

```txt
You are working in the AI Recruiter Mini frontend project.

Follow the existing project architecture strictly.

Do not put API calls, reusable types, constants, validation schemas, or utility functions inside UI component files.

Use the existing folder structure:

- Route files: src/app
- Shared UI: src/components/common, src/components/feedback, src/components/forms, src/components/layout, src/components/ui
- Feature code: src/features/{module}/api, components, hooks, types, validations
- Shared API infrastructure: src/lib/api
- Shared constants: src/lib/constants
- Shared utilities: src/lib/utils
- Shared validations: src/lib/validations
- Providers: src/providers

Before writing new code, check whether a shared component, helper, constant, validation, or provider already exists.

Use `showToast` from `@/components/feedback/toast` for toast messages.
Do not import `toast` directly from `sonner`.

Use `apiClient` through feature API files.
Do not call `fetch` directly inside pages or components.

Use feature hooks for multi-step business flows.
For example, upload file then create resume should live in a hook, not inside a large UI component.

Use constants from `src/lib/constants` and utilities from `src/lib/utils` instead of hardcoding values.

Use named exports unless Next.js requires a default export.

Keep components focused on rendering and local user interaction only.
If a file becomes large or mixes responsibilities, split it into smaller files following the project structure.
```

---

## 13. Example: Resume Upload Separation

### Incorrect Structure

```tsx
// features/resumes/components/resume-upload-form.tsx

type FileAsset = { id: string };
type Resume = { id: string };

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf'];

function formatFileSize(size: number) {}
function isAcceptedFile(file: File) {}

async function uploadFile(file: File) {}
async function createResume(payload: unknown) {}

export function ResumeUploadForm() {
  // UI + validation + API + types + constants all mixed together
}
```

### Correct Structure

```txt
src/features/files/api/file.api.ts
src/features/files/types/file.type.ts

src/features/resumes/api/resume.api.ts
src/features/resumes/components/resume-upload-form.tsx
src/features/resumes/hooks/use-upload-resume.ts
src/features/resumes/types/resume.type.ts
src/features/resumes/validations/resume.validation.ts

src/lib/constants/file.constants.ts
src/lib/utils/format-file-size.ts
src/lib/utils/resume-file.util.ts
src/components/feedback/toast.tsx
```

### Correct Responsibility Split

| File | Responsibility |
| --- | --- |
| `resume-upload-form.tsx` | Render form, manage local UI state, call hook, show UI state |
| `use-upload-resume.ts` | Coordinate upload file then create resume |
| `file.api.ts` | Call `/files/upload` |
| `resume.api.ts` | Call `/resumes` |
| `file.type.ts` | Define FileAsset types |
| `resume.type.ts` | Define Resume types |
| `resume.validation.ts` | Define resume form schema |
| `file.constants.ts` | Define file size and accepted file rules |
| `format-file-size.ts` | Format file sizes |
| `resume-file.util.ts` | Validate resume files |
| `toast.tsx` | Show shared toast feedback |

---

## 14. Code Review Checklist

Use this checklist before accepting generated code:

```txt
[ ] Does the page file only compose the page?
[ ] Does the UI component avoid raw API calls?
[ ] Are API calls placed in feature `api` files?
[ ] Are multi-step flows placed in feature `hooks`?
[ ] Are types placed in `types` files?
[ ] Are validation schemas placed in `validations` files?
[ ] Are reusable helpers placed in `src/lib/utils`?
[ ] Are repeated values placed in `src/lib/constants`?
[ ] Does the code use existing shared components?
[ ] Does the code use `showToast` instead of direct `sonner` imports?
[ ] Does the code avoid hardcoded route strings when route constants exist?
[ ] Does the code avoid hardcoded file size and MIME rules?
[ ] Does the code use path alias imports with `@/`?
[ ] Is the component file reasonably small and focused?
[ ] Is the implementation aligned with the current business dashboard UI style?
```

---

## 15. Final Rule

If generated code ignores the project structure, mixes responsibilities, duplicates existing utilities, or bypasses shared infrastructure, it should be rejected and rewritten before commit.

Clean structure is not optional. It is part of the implementation requirement.
