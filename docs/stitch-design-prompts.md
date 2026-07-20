# Prompt thiết kế giao diện bằng Stitch (AI UI design tool)

> Dán lần lượt từng prompt bên dưới vào Stitch, **theo đúng thứ tự 0 → 9**. Prompt 0 thiết lập style guide chung — mọi prompt sau nên nhắc Stitch "match the style guide from earlier" nếu thấy phong cách trôi giữa các lần tạo.

## Bối cảnh

Frontend (`Ai-Recruiter-Mini-Frontend`, Next.js 16 + React 19 + Tailwind v4) hiện đã build xong: Candidates, Resumes, Job Descriptions, Applications, Auth login. Chưa có UI cho: Organization/Auth đầy đủ (register, verify email, forgot/reset password), Enterprise Batch Scoring (ma trận CV×JD), các trang quản trị nội bộ (Evaluation Configs, User management, Audit log, Interview Question bank), và luồng Public ẩn danh. Bộ prompt dưới đây nhắm vào đúng 4 mảng thiếu này, với **hướng thiết kế lại hoàn toàn** (không giữ style Tailwind mặc định hiện tại).

## Danh sách màn hình

| # | Màn hình | Thuộc luồng |
|---|---|---|
| 1 | Register Organization | Auth |
| 2 | Email verification landing | Auth |
| 3 | Resend verification | Auth |
| 4 | Forgot password | Auth |
| 5 | Reset password | Auth |
| 6 | Login (bổ sung nhánh lỗi "email chưa xác thực") | Auth |
| 7 | Scoring Batches — danh sách | Enterprise Batch |
| 8 | Tạo batch mới (wizard 3 bước) | Enterprise Batch |
| 9 | Batch Matrix (ma trận CV×JD) + chi tiết 1 ô | Enterprise Batch — màn hình trung tâm |
| 10 | Skill-gap summary | Enterprise Batch |
| 11 | EvaluationConfig — danh sách + tạo/sửa | Nội bộ (ADMIN) |
| 12 | User management | Nội bộ (ADMIN) |
| 13 | Audit log viewer | Nội bộ (ADMIN) |
| 14 | Interview Question bank | Nội bộ (role DEV) |
| 15 | Public landing + tạo batch ẩn danh | Public |
| 16 | Public batch matrix (chỉ xem) | Public |

---

## Prompt 0 — Master prompt (dán đầu tiên)

```
You are designing the UI for "AI Recruiter" — a B2B SaaS platform that helps recruiters and hiring managers screen job candidates against job descriptions using AI-powered scoring. Think of it as a professional HR-tech tool, not a consumer app.

PRODUCT CONTEXT
- Two tiers of users:
  1. Enterprise (authenticated): recruiters, hiring managers, and org admins working inside a multi-tenant dashboard. They manage candidates, resumes, job descriptions, applications, and run AI evaluations — including a bulk "batch scoring" feature that scores many CVs against many job descriptions at once and shows results as a matrix.
  2. Public (anonymous, no login): a self-serve trial experience where anyone can upload a couple of CVs and job descriptions and instantly see AI match scores, as a way to experience the product before signing up.
- The data is sensitive (candidate PII, hiring decisions) — the design should feel trustworthy, precise, and calm. Avoid playful illustrations, bright consumer-app gradients, or gamified elements. Favor clarity and information density done well over decoration.
- Primary brand action color should convey trust and intelligence (blues, teals, or deep indigos are appropriate directions, but you have full creative freedom to propose something distinctive — avoid generic default Tailwind blue).

DESIGN SYSTEM TO ESTABLISH
Propose a cohesive design system (color palette, typography, spacing/radius scale, elevation/shadow style) that will be applied consistently across every subsequent screen prompt. Include:
- A primary + neutral palette, plus semantic colors for status states: pending/in-progress (amber/blue), success (green), failure/error (red), and a neutral "inactive" gray.
- Typography: one clean, highly legible sans-serif system, with a clear scale for page titles, section headers, table text, and small metadata/caption text.
- Component conventions to reuse everywhere: primary/secondary/destructive buttons, text inputs, select dropdowns, badges/pills (for status and role labels), data tables with pagination, empty states, loading skeletons, toast notifications, confirmation dialogs for destructive actions, and a modal/drawer pattern for detail views.
- Light mode only for now (no dark mode required).

LAYOUT CONVENTIONS
- Authenticated app: persistent left sidebar (organization switcher not needed — single org per session), grouped navigation (Recruiting: Candidates, Resumes, Job Descriptions, Applications, Evaluations, Batch Scoring; Admin: Evaluation Configs, Users, Audit Log; and a separate "DEV Tools" section for Interview Question Bank, only relevant to a special internal role). Top header shows page title and a user menu (avatar, name, role badge, logout).
- Public/anonymous pages: no sidebar — a lightweight marketing-style top nav (logo + a "Sign up" / "Log in" call to action), full-width hero sections where appropriate.
- Status badges appear throughout: batch/evaluation status (PENDING, PARSING, SCORING, COMPLETED, COMPLETED_WITH_ERRORS, FAILED, CANCELLED), skill match type (MATCHED green, MISSING red, RELATED/PARTIAL amber), user role (ADMIN, RECRUITER, HIRING_MANAGER, DEV).

Please generate a style guide / component library screen first (colors, type scale, buttons, inputs, badges, table row, card) that all following screens will be generated to match.
```

---

## Prompt 1 — Auth & Organization Onboarding

```
Design the following connected authentication screens for "AI Recruiter" (a B2B HR-tech SaaS), using the design system established in the previous style guide. These screens are for a brand-new organization signing up, and for existing users recovering access.

SCREEN 1 — Register Organization
Split-panel layout (left: brief product pitch / value proposition copy + a subtle illustration or abstract graphic reflecting "AI-powered candidate matching"; right: a form card). Form fields: Organization name, Admin full name, Admin email, Admin password (with a password strength hint). Primary CTA: "Create organization". Below the form, a link to the login page for existing users. On submit, show a success state (can be the same screen transformed, or a dedicated confirmation screen): a checkmark/email icon, headline like "Check your email", body text explaining a verification link was sent to the admin email, with a secondary "Resend email" text link.

SCREEN 2 — Email Verification Landing
A minimal centered card page reached by clicking the emailed link. Three states to design: (a) verifying — a loading spinner with "Verifying your email…", (b) success — checkmark icon, "Email verified!", a primary button "Go to dashboard" (this state also implies the user is now logged in), (c) error/expired — a warning icon, message like "This link has expired or already been used", with a button to request a new verification email.

SCREEN 3 — Resend Verification
A simple centered card: headline "Resend verification email", a single email input, submit button. After submit, always show the same neutral confirmation message regardless of whether the email exists ("If an account with this email exists and isn't verified yet, we've sent a new link") — design this as a calm, reassuring confirmation state, not an error.

SCREEN 4 — Forgot Password
Same minimal centered-card pattern as Resend Verification: email input, submit, then a neutral "check your email" confirmation state (same privacy-preserving copy pattern — don't reveal whether the email exists).

SCREEN 5 — Reset Password
Centered card reached from the emailed reset link: new password field + confirm password field, password strength hint, submit button. Include an error state variant for an expired/invalid token (same visual pattern as Screen 2's error state) and a success state ("Password updated — you can now log in") with a button to the login page.

SCREEN 6 — Login (redesign existing)
Similar split-panel pattern to Register Organization (reuse the same left-side pitch panel for visual consistency across the auth flow). Right side: email + password fields, "Forgot password?" link, primary "Log in" button, and a link to Register Organization for new users. Include an inline error banner state specifically for "Your email is not verified yet" that contains a "Resend verification email" action inline (not just a generic error toast) — this is an important edge case to design distinctly from a generic wrong-password error.

Keep all five screens visually part of one cohesive flow (same panel layout, same card style, same button/input styling from the style guide).
```

---

## Prompt 2 — Enterprise Batch Scoring: Create Batch Wizard

```
Design a multi-step "Create Scoring Batch" wizard for the AI Recruiter enterprise dashboard, using the established design system and the authenticated app shell (sidebar + header) as the surrounding chrome. This is the flow a recruiter uses to score many CVs against many job descriptions at once.

Step indicator: a horizontal stepper at the top with 3 steps: "1. Add resumes", "2. Add job descriptions", "3. Review & submit".

STEP 1 — Add Resumes
A tabbed input area with three tabs: "Upload files" (drag-and-drop zone accepting PDF/DOCX, multi-file, showing a list of added files with name/size/remove button and a running count against a limit like "3 / 2000 files"), "Paste text" (a repeatable list of textareas, each representing one candidate's resume pasted as plain text, with an "Add another" button and an optional label field per entry), "Structured form" (an expandable form for manually entering one candidate's structured profile — name, contact, skills, experience entries — as an alternative to file/text). Show a running total count of resumes added so far at the bottom, with "Continue" button.

STEP 2 — Add Job Descriptions
Same three-tab pattern (Upload files / Paste text / Structured form) but for job descriptions instead of resumes, with a lower max count shown (e.g. "2 / 50 job descriptions"). Back and Continue buttons.

STEP 3 — Review & Submit
A summary screen: two compact lists (resumes added, job descriptions added) with counts, an optional dropdown to select an "Evaluation Config" (scoring criteria weighting) to apply — defaulting to "Organization default", and optional fields for notification (webhook URL, notify email) collapsed under an "Advanced options" disclosure. A prominent "Start scoring N × M pairs" submit button showing the computed total pair count. Include a small informational note about processing time for large batches.

Design all three steps to feel like one continuous, low-friction flow — consistent spacing, consistent tab styling, clear progress feedback.
```

---

## Prompt 3 — Enterprise Batch Scoring: Matrix & Cell Detail (hero screen)

```
Design the centerpiece screen of AI Recruiter: the Scoring Batch Matrix view, using the established design system and authenticated app shell.

MAIN MATRIX VIEW
Header area: batch name, a status badge (COMPLETED / SCORING / COMPLETED_WITH_ERRORS / etc.), a progress bar or percentage if still in progress, and action buttons (Export CSV, Cancel batch [only while in progress], Promote selected).
Below that: a matrix/grid table where each ROW is a candidate/resume (row header shows candidate name + a small parse-status indicator) and each COLUMN is a job description (column header shows JD title, angled or wrapped text if needed). Each CELL shows a numeric match score (0-100) with a color-coded background forming a heatmap effect (e.g. red-to-green gradient scale, or a more sophisticated 3-color system: red for weak match, amber for moderate, green for strong) — design this heatmap coloring carefully since it's the core "wow" visual of the product. A cell that failed to score shows a small error icon instead of a score. Support the case of a large matrix (many rows/columns) needing to scroll both directions with the row/column headers staying frozen/sticky.
Include a way to select individual cells (checkbox overlay on hover, or a selection mode toggle) for the "Promote selected" bulk action.
Show small "Top match" indicators — e.g. a subtle star/highlight on the highest-scoring cell in each row and/or column.

CELL DETAIL (drawer or modal, opened by clicking a cell)
Shows: candidate name + job title as the header, the overall score prominently, a breakdown of scoring criteria (each criterion name, its weight, its normalized score, shown as a small horizontal bar or radial indicator, plus a short text reason), a two-column skills section (Matched skills as green tags, Missing skills as red tags, Related/Partial as amber tags), a list of AI-generated interview questions (numbered, each with a short rationale/category label), and a "Promote to pipeline" button at the bottom to turn this specific match into a real candidate/application record.

Design for information density done elegantly — this is a data-heavy analytical tool, but it should never feel cluttered or overwhelming. Generous whitespace between the matrix and surrounding chrome, tight but legible spacing within the matrix itself.
```

---

## Prompt 4 — Enterprise Batch Scoring: List & Skill-Gap Summary

```
Design two supporting screens for the AI Recruiter batch scoring feature, using the established design system and authenticated app shell.

SCREEN 1 — Scoring Batches List
A standard list page: page title "Scoring Batches", a prominent "New batch" button top-right. A table with columns: Batch name, Status (colored badge: PENDING/PARSING/SCORING/COMPLETED/COMPLETED_WITH_ERRORS/FAILED/CANCELLED), Progress (a small inline progress bar or "42/50 pairs"), CV count, JD count, Created date, and a row action to open the batch. Include search/filter controls above the table and pagination below it, matching the app's standard list-page pattern. Include an empty state for a brand-new organization with no batches yet, with a friendly illustration-free prompt to create the first batch.

SCREEN 2 — Skill Gap Summary
A dedicated analytics view for one batch: shows the most frequently MISSING skills across all candidates in the batch, as a ranked horizontal bar list (skill name + frequency count + a bar proportional to frequency), optionally filterable by a specific job description. This helps a recruiter spot systemic gaps in their candidate pool at a glance.
```

---

## Prompt 5 — Internal Admin: Evaluation Configs

```
Design the "Evaluation Configs" management screens for AI Recruiter's admin area, using the established design system and authenticated app shell (this lives under an "Admin" section in the sidebar).

LIST VIEW
Standard list page: title "Evaluation Configs", "New config" button, table with columns: Config name, scope (a badge showing "Organization default" or the specific job description title it's scoped to), Default indicator (a filled star/check if this is the active default for its scope), Last updated, row actions (edit, delete with confirmation).

CREATE/EDIT FORM
Fields: Config name, optional description, optional Job Description picker (a searchable select — leaving it empty means "organization-wide default"), an "Set as default for this scope" toggle. The centerpiece is a CRITERIA WEIGHT BUILDER: a repeatable list of rows, each with a criterion dropdown (Skills Match, Experience Relevance, Project Relevance, Education/Certification, Keyword/Domain Alignment) and a weight input — design this as sliders or numeric steppers that visually communicate the running total, with a live sum indicator showing e.g. "Total: 100%" in green when valid or in red with a warning message when the weights don't add up to 100%. Include an "Add criterion" button and a way to remove a row. Duplicate-criterion selection should show an inline validation error.
```

---

## Prompt 6 — Internal Admin: User Management

```
Design the "Users" management screens for AI Recruiter's admin area (Admin section of the sidebar), using the established design system and authenticated app shell.

LIST VIEW
Title "Team members", "Invite member" button top-right. Table columns: Avatar/initials + name, Email, Role (badge: Admin/Recruiter/Hiring Manager), Status (Active/Inactive badge), Joined date, row actions (edit role, deactivate/reactivate). Search bar and role/status filter controls above the table.

INVITE MEMBER (modal or slide-over panel)
Fields: Full name, Email, Role dropdown. Submit sends an invitation email (mirror the tone of the email-verification flow — a confirmation toast like "Invitation sent to jane@company.com").

EDIT MEMBER (modal or slide-over panel opened from the list)
Fields: Full name (editable), Role dropdown, Active/Inactive toggle. Include a distinct warning state for when the target is the last active admin in the organization — the deactivate/demote controls should appear disabled with an inline explanatory note ("This is the last active admin — promote another member first"), rather than only failing after submit. Also design the case where a user tries to edit their own account — role and active-status controls should appear disabled with a note like "You can't change your own role or deactivate yourself."
```

---

## Prompt 7 — Internal Admin: Audit Log Viewer

```
Design the "Audit Log" screen for AI Recruiter's admin area (Admin section of the sidebar), using the established design system and authenticated app shell.

A read-only, dense table view: title "Audit Log", filter controls above the table (resource type dropdown — Candidate/User/ScoringBatch/JobDescription/EvaluationConfig, actor/team-member dropdown, date range picker). Table columns: Timestamp, Actor (avatar + name), Action (a small colored tag: DELETE=red, UPDATE=blue, CREATE=green, PROMOTE/CANCEL/BULK_DELETE=neutral/amber), Resource (type + a short identifier), and an expandable row or a "View details" action that reveals the raw metadata as a formatted key-value list or JSON viewer in a side panel. Pagination below. Empty state for an org with no audit history yet.
```

---

## Prompt 8 — Internal Admin: Interview Question Bank (DEV role)

```
Design the "Interview Question Bank" admin tool for AI Recruiter, intended for a small internal content-management role (labeled "DEV" in the product), using the established design system and authenticated app shell — but visually signal this is a distinct, more technical/internal tool area (e.g. a slightly different sidebar section styling, or a small "Internal tool" label near the page title) compared to the recruiter-facing admin screens.

LIST VIEW
Title "Interview Question Bank". Filter controls: Occupation Family dropdown (IT, Marketing, Design, Data, Product, Sales, Legal), Specialization dropdown (dependent on family), Question Type dropdown, Quality Gate Status dropdown (Pending Review / Approved / Rejected — as colored badges, since reviewing AI-generated pending questions is a key workflow here). Table columns: Question text (truncated), Family/Specialization, Competency, Quality status badge, Source (Seed vs AI-Generated, shown as a small icon or tag), Usage count, row actions (edit, delete, and for pending items specifically an inline "Approve" quick-action button).

CREATE/EDIT FORM
Fields: Question text (textarea), Occupation Family + Specialization (dependent dropdowns), Enablers (multi-select tag input), Business Context (text), Competency + Competency Type, Assessment Target, Experience Bucket, Autonomy Level, Question Type, Rubric (a repeatable list of short text points — "what a good answer should cover"), Quality Gate Status.

BULK CREATE
A secondary flow/modal: a large textarea or file-drop for pasting a JSON array of questions, with a preview table showing parsed items before final submit, and per-item success/failure indicators after submit (since bulk creation processes items one by one and some may fail validation).

SEARCH TEST TOOL (a distinct sub-page or tab, e.g. "Test Retrieval")
A simple tool: a query text input + Occupation Family/Specialization selectors + a "Search" button, results shown as a ranked list of matching questions each annotated with a similarity score (e.g. "0.78 similarity") shown as a small percentage/bar — this exists so the DEV role can sanity-check how well the retrieval system is working for a given query, distinct from the main CRUD list.
```

---

## Prompt 9 — Public Anonymous Batch Scoring

```
Design the public-facing, unauthenticated "try it now" experience for AI Recruiter, using the established design system but a lighter-weight marketing-style shell (no sidebar — just a simple top nav with logo left, "Log in" / "Sign up" links right). This is meant to feel inviting and low-friction — no account required — while still visually part of the same product family as the authenticated dashboard.

SCREEN 1 — Public Landing / Try It Now
A hero section: strong headline about instantly matching CVs to job descriptions with AI, a short supporting sentence, and a prominent CTA button "Try it free — no signup required". Below the hero, a simple 3-step visual explainer (Upload your CVs → Add job descriptions → See AI match scores instantly). A secondary section with subtle trust-building copy (e.g. "your files are never stored" — reflecting the real privacy guarantee of this ephemeral public tier) and a small note about limits (e.g. "up to 2 CVs and 10 job descriptions per try").

SCREEN 2 — Public Batch Creation
A simplified single-page (not multi-step wizard, since limits are small) version of the enterprise create-batch flow: an "Add your CVs" section (upload/paste text, capped at 2), an "Add job descriptions" section (upload/paste text, capped at 10), and a "See my results" submit button. Design a friendly rate-limit/quota-exceeded error state (e.g. "You've reached the free trial limit — sign up for unlimited scoring") that gently pushes toward signup rather than feeling punitive.

SCREEN 3 — Public Batch Results
A read-only version of the matrix view from the authenticated product (same heatmap cell coloring, same cell-detail drawer with score breakdown/skills/interview questions) but with no Promote/Export actions, and a persistent banner or footer CTA inviting the visitor to "Sign up to save these results and unlock full batch scoring" — this is the primary conversion moment in the whole public flow, so it should be visually present but not obstruct the results themselves.
```

---

## Sau khi có kết quả từ Stitch

1. Dán Prompt 0 trước, xác nhận style guide hợp lý (đúng tinh thần B2B, không quá "consumer app") trước khi dùng làm nền cho các prompt sau.
2. Dán lần lượt Prompt 1 → 9, nhắc Stitch "match the style guide from earlier" nếu thấy phong cách trôi giữa các lần tạo.
3. Ưu tiên review kỹ Prompt 3 (Matrix) trước — đây là màn hình lõi khác biệt nhất, nên lặp lại nhiều lần nếu heatmap/interaction chưa ổn.
4. Sau khi có bộ thiết kế ưng ý: map thành component thật trong dự án theo đúng convention hiện có (`api/`+`components/`+`hooks/`+`types/`+`validations/` mỗi feature module, dùng lại `apiClient`/`DataTable`/`ConfirmDialog`/`showToast` sẵn có).
