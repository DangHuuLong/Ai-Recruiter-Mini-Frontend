# Frontend Evaluation Workflow

This document describes the evaluation flow in the AI Recruiter Mini frontend.

## Overview

The frontend lets a recruiter create an evaluation from an application and review the evaluation result in a detail page. The frontend calls the Backend API only. The Backend is responsible for calling the AI Service.

```text
Frontend -> Backend -> AI Service
```

## User flow

1. Open an application detail page.
2. Click **Create evaluation**.
3. Frontend calls the Backend to create an evaluation.
4. Backend processes the evaluation.
5. Frontend redirects to `/evaluations/{evaluationId}`.
6. Recruiter reviews the result.
7. If the evaluation failed, recruiter can retry it.

## Routes

| Route | Purpose |
| --- | --- |
| `/applications/[id]` | Shows application details and the Create evaluation action. |
| `/evaluations` | Evaluation section entry page. |
| `/evaluations/[id]` | Shows evaluation result details. |

## Main files

| File | Purpose |
| --- | --- |
| `src/features/applications/components/application-detail.tsx` | Adds the Create evaluation action. |
| `src/app/(dashboard)/evaluations/[id]/page.tsx` | Evaluation detail route. |
| `src/features/evaluations/components/evaluation-result-detail.tsx` | Evaluation result UI. |
| `src/features/evaluations/api/evaluation.api.ts` | Evaluation API functions. |
| `src/features/evaluations/types/evaluation.type.ts` | Evaluation TypeScript types. |
| `src/lib/api/api-endpoints.ts` | Central API endpoint constants. |

## Backend endpoints used

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/evaluations` | Create an evaluation. |
| `GET` | `/evaluations` | List evaluations. |
| `GET` | `/evaluations/:id` | Get evaluation detail. |
| `GET` | `/applications/:id/evaluations` | Get evaluations for an application. |
| `GET` | `/evaluations/:id/breakdown` | Get criterion breakdown. |
| `GET` | `/evaluations/:id/skills` | Get evaluation skills. |
| `GET` | `/evaluations/:id/interview-questions` | Get interview questions. |
| `GET` | `/evaluations/:id/evidence` | Get evidence map. |
| `POST` | `/evaluations/:id/retry` | Retry a failed evaluation. |

## Result page content

The evaluation result page should show:

- Overall score.
- Evaluation status.
- Candidate name.
- Job title.
- Started and completed timestamps.
- Summary.
- Skill gap summary.
- Explanation.
- Score breakdown.
- Matched skills.
- Missing skills.
- Related skills when present.
- Evidence map.
- Interview questions.
- Retry action for failed evaluations.

## UI states

- Use loading state while fetching data.
- Use empty or error state when data cannot be loaded.
- Show retry button only when evaluation status is `FAILED`.
- Disable action buttons while requests are in progress.

## Manual test checklist

1. Start Backend and Frontend.
2. Prepare a candidate, parsed resume, parsed job description, and application.
3. Open `/applications/{applicationId}`.
4. Click **Create evaluation**.
5. Confirm redirect to `/evaluations/{evaluationId}`.
6. Confirm all result sections render correctly.
7. Test failed evaluation retry.
8. Test navigation back to the application page.
9. Test responsive layout on mobile width.

## Notes

The frontend displays the score returned by the Backend. If score quality looks wrong, check AI Service parsing and scoring before changing frontend display logic.
