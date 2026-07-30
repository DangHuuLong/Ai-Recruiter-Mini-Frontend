# Frontend Auth UI Notes

## 1. Purpose

This document summarizes the current frontend authentication UI flow after the `feature/auth-ui` work.

The auth UI is intentionally kept lightweight. It only documents the main login/session/protected-route behavior needed for development and handoff. Backend authentication and authorization rules remain the source of truth.

---

## 2. Current Scope

Implemented on the frontend:

- Login page at `/login`
- Login form with email/password validation
- Auth API call to `POST /api/auth/login`
- Access token and user data stored in browser `localStorage`
- Shared API client automatically attaches `Authorization: Bearer <accessToken>`
- Global auth hydration through `AuthProvider`
- Dashboard route protection through `AuthGuard`
- User menu in the dashboard header
- Logout action that clears local session and redirects to login

Not in scope yet:

- Refresh token flow
- Token revocation on logout
- Password reset
- Register page
- `/me` profile refresh endpoint
- Deep role-based UI hiding beyond simple display needs

---

## 3. Main Flow

### Login

1. User opens `/login`.
2. `LoginForm` validates email and password on the client.
3. Frontend calls `POST /api/auth/login` through `features/auth/api/auth.api.ts`.
4. On success, the frontend stores:
   - `accessToken`
   - `user`
5. User is redirected to the `next` query value if present, otherwise to `/dashboard`.

### Session hydration

1. `AuthProvider` runs at root layout level.
2. It hydrates auth state from `localStorage` into the auth store.
3. The dashboard can then check whether the user has an active local session.

### Protected dashboard routes

1. Dashboard pages are wrapped by `AuthGuard` in the dashboard layout.
2. While auth state is being hydrated, a small loading state is shown.
3. If no valid local session exists, the user is redirected to `/login?next=<current-path>`.
4. If a local session exists, dashboard content is rendered.

### Logout

1. User clicks `Đăng xuất` in the dashboard header.
2. The frontend clears stored access token and user data.
3. User is redirected back to `/login`.

---

## 4. Important Files

| File | Purpose |
| --- | --- |
| `src/app/login/page.tsx` | Login page layout |
| `src/features/auth/components/login-form.tsx` | Login form, validation, submit behavior |
| `src/features/auth/api/auth.api.ts` | Auth API integration |
| `src/features/auth/store/auth.store.ts` | Session state using Zustand |
| `src/lib/auth/auth-storage.ts` | Read/write/clear auth data in `localStorage` |
| `src/features/auth/components/auth-provider.tsx` | Hydrates auth store on app load |
| `src/features/auth/components/auth-guard.tsx` | Protects dashboard routes |
| `src/features/auth/components/user-menu.tsx` | Shows current user and logout action |
| `src/lib/api/api-client.ts` | Injects Bearer token into normal and upload requests |
| `src/config/routes.config.ts` | Contains shared route constants including `/login` |

---

## 5. API Client Behavior

The shared API client reads the stored access token before each request.

If a token exists, it adds:

```http
Authorization: Bearer <accessToken>
```

This applies to both normal JSON requests and upload requests handled through `XMLHttpRequest`.

Current frontend behavior does not yet globally intercept `401` or `403`. For now, login handles invalid credentials locally, and protected route access is guarded by local session state.

Recommended future improvement:

- On `401`, clear local session and redirect to login.
- On `403`, show a permission/forbidden message instead of forcing login.

---

## 6. Notes for Future Work

- Keep backend authorization as the source of truth.
- Use `user.role` only for UI display or optional UI visibility, not for security decisions.
- Do not send `createdById` from frontend forms; backend should derive creator fields from the authenticated user.
- If refresh tokens are added later, update this document and the storage/session flow together.
- If `/api/users/me` is added later, prefer refreshing the user profile from backend instead of relying only on stored user data.

---

## 7. Manual Check List

- [ ] `/login` renders correctly.
- [ ] Empty/invalid email shows validation error.
- [ ] Password shorter than 8 characters shows validation error.
- [ ] Valid login stores token and user data.
- [ ] API requests include Bearer token after login.
- [ ] Opening a dashboard route without session redirects to login.
- [ ] `next` query redirects back to the originally requested route after login.
- [ ] User menu shows full name and role.
- [ ] Logout clears local session and returns to login.
