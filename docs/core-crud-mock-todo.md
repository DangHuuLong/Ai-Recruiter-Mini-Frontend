# Candidates / Resumes / Job Descriptions / Applications / Evaluations are mocked — restore before shipping

Static-UI-first phase for the Stitch-redesigned core CRUD screens (branch
`refactor/design-system-core-crud-screens`): all 5 areas are wired to **fake/mocked**
data so the redesigned UI can be reviewed without a live backend. Auth has since been
restored to real API calls (see the frontend integration plan) — this doc now covers
only these 5 CRUD areas. The real API calls here are **not deleted** — they're
commented out directly above each mock block, so restoring is a matter of deleting the
mock block and uncommenting.

## What's mocked

Each area has the same shape: a `mock/*-mock-data.ts` file holding an in-memory,
mutable array (so create/update/delete during a review session persist visibly in the
list), and the corresponding `api/*.api.ts` rewritten so every exported function has its
real `apiClient` call commented out immediately above a mock implementation using
`mockDelay()`/`paginateMock()` (`src/lib/utils/mock-delay.ts`).

- `src/features/candidates/mock/candidate-mock-data.ts` + `api/candidate.api.ts`
- `src/features/resumes/mock/resume-mock-data.ts` + `api/resume.api.ts` (also
  `src/features/files/api/file.api.ts` — `uploadFile` mocked with simulated progress)
- `src/features/job-descriptions/mock/job-description-mock-data.ts` +
  `api/job-description.api.ts`
- `src/features/applications/mock/application-mock-data.ts` + `api/application.api.ts`
- `src/features/evaluations/mock/evaluation-mock-data.ts` + `api/evaluation.api.ts`

Mock records cross-reference each other by id (an Application's `candidate`/`resume`/
`jobDescription` fields resolve to real Candidates/Resumes/Job-Descriptions mock
records; an Evaluation's `application` field resolves to a real mock Application), so
"View candidate" / "View resume" / "View JD" / "View application" links work correctly
while reviewing.

`evaluation.api.ts` only mocks the functions actually called by a component/hook
(`getEvaluations`, `getEvaluationById`, `createEvaluation`, `retryEvaluation`,
`getApplicationEvaluations`) — the other 4 exported functions
(`getEvaluationBreakdown`/`getEvaluationSkills`/`getEvaluationInterviewQuestions`/
`getEvaluationEvidence`) are mocked too for completeness but have no real caller today;
`getEvaluationById` returns the full nested `Evaluation` object instead.

## To restore real integration later

1. In each `api/*.api.ts`, for every function: delete the mock block (from `await
   mockDelay()` down to the `return`), uncomment the real `apiClient` call directly
   above it.
2. Delete the 5 `mock/*-mock-data.ts` files (and the `uploadFile` mock block in
   `files/api/file.api.ts`).
3. `apiClient`/`apiEndpoints` are still imported in every rewritten file (kept
   intentionally, referenced only by the now-uncommented real calls) — no import changes
   needed after step 1.
4. `src/lib/utils/mock-delay.ts` (`mockDelay`/`paginateMock`) can be deleted once no
   `mock/*-mock-data.ts` file references it.
5. Delete this file once restoration is done.
