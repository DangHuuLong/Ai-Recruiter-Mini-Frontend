# Auth screens are currently mocked — restore before shipping

Static-UI-first phase: all 6 auth screens (Login, Register, Verify Email, Resend
Verification, Forgot Password, Reset Password) are wired to **fake/mocked** responses,
not the real backend. This was a deliberate step-back from an earlier version that
called the real API directly — see git history on `feat/auth-screens` for the original
real implementation if you need to reference exact request/response shapes.

## What's mocked

`src/features/auth/api/auth.api.ts` — every exported function (`login`,
`registerOrganization`, `verifyEmail`, `resendVerification`, `forgotPassword`,
`resetPassword`) is a fake implementation: `setTimeout` delay + a hardcoded success
response. No `apiClient`/`fetch` call happens. Real backend endpoints already exist and
were tested (see backend session notes) — restoring real calls is a matter of swapping
the function bodies back to `apiClient.post(...)`, not building new backend work.

`login` and `verifyEmail` both call `setSession(...)` with a **fake** user
(`mock-user-id`, `Sarah Jenkins`, role `ADMIN`) and a fake `accessToken`
(`'mock-access-token'`). This token will NOT work against real backend endpoints — any
page that calls a real API (Candidates, Resumes, etc.) will get a real 401 once this is
restored and a real backend is hit without a real login.

## What's disabled

`src/features/auth/components/auth-guard.tsx` — the redirect-to-`/login` check is
removed entirely; it currently just renders `children` unconditionally. This was
necessary because with `login` mocked, there was no way to reach dashboard routes
without either faking a session (done) or removing the gate — the gate was removed so
the dashboard is directly reachable while reviewing static UI without needing a working
login first.

## To restore real integration later

1. In `auth.api.ts`, replace each mocked function body with a real `apiClient.post(...)`
   call. The original real implementation (request/response shapes, `ApiResponse<T>`
   envelope handling) is preserved in git history — check the commit before this mock
   change on `feat/auth-screens`, or `docs/auth.md` for the documented contract.
2. In `auth-guard.tsx`, restore the `isHydrated`/`isAuthenticated` check + redirect to
   `${ROUTES.LOGIN}?next=${pathname}` (see git history for the exact previous version).
3. Re-verify the `login-form.tsx` "unverified email" banner path (checks
   `error.statusCode === 403`) still works against a real 403 response — this path is
   currently unreachable since mocked `login` never throws.
4. Update `docs/auth.md` to reflect the 5 new screens (currently only documents Login).
5. Delete this file once restoration is done.
