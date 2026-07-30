# Prompt thiết kế giao diện bằng Stitch (AI UI design tool)

> Dán lần lượt từng prompt bên dưới vào Stitch, **theo đúng thứ tự 0 → 19**. Prompt 0 thiết lập style guide chung — mọi prompt sau nên nhắc Stitch "match the style guide from earlier" nếu thấy phong cách trôi giữa các lần tạo.

## Bối cảnh

Frontend (`Ai-Recruiter-Mini-Frontend`, Next.js 16 + React 19 + Tailwind v4) hiện đã build xong: Candidates, Resumes, Job Descriptions, Applications, Evaluations, Auth login, Enterprise Batch Scoring, Admin/Dev Tools, luồng Public. Prompt 0–9 (bên dưới) đã phủ Auth/Batch Scoring/Admin/Public. Prompt 10–14 nhắm vào 5 khu vực CRUD lõi (Candidates/Resumes/Job Descriptions/Applications/Evaluations) — các màn này build **trước** đợt redesign, vừa được restyle lại đúng token màu (`surface`/`primary`/`outline`...) nhưng bố cục vẫn là layout Tailwind mặc định (table đơn giản, card trắng phẳng, không có điểm nhấn thị giác) — cần Stitch thiết kế lại bố cục/thị giác cho đẹp và có chiều sâu hơn, **giữ nguyên cấu trúc dữ liệu/field đã liệt kê** vì đây là API thật, không phải mock.

Prompt 15 (mới thêm) nhắm vào trang `/dashboard` — trang này hiện là **placeholder dựng từ đầu dự án, 100% dữ liệu giả** (`kpis`/`jobs`/`pipeline` hard-code thẳng trong component, không gọi API nào), và **backend hiện chưa có endpoint tổng hợp riêng cho dashboard** (`GET /dashboard` không tồn tại — đã rà soát toàn bộ 15 controller của backend để xác nhận). Tuy vậy, dựa vào Prisma schema + các endpoint list/count đã có sẵn (`GET /applications`, `/evaluations`, `/scoring-batches`, `/audit-logs`, `/candidates`, `/job-descriptions`), có thể suy ra chính xác dashboard nên hiển thị số liệu thật gì — không cần bảng mới, chỉ cần tổng hợp phía frontend (hoặc 1 aggregate endpoint mới sau này). Prompt 15 mô tả đúng những số liệu **đã có thật** trong hệ thống, không bịa KPI.

Prompt 16–19 (mới thêm) vá 4 lỗ hổng UI phát hiện được khi rà lại toàn bộ API backend so với các trang FE hiện có (API có sẵn nhưng chưa có UI nào gọi tới):
- **Prompt 16**: Resume Detail chưa có cách xem/tải file CV thật (`GET /files/:id/download-url` tồn tại nhưng chưa dùng ở đâu, trang chỉ hiện `fileAssetId` dạng text).
- **Prompt 17**: Candidate Detail thiếu phần "Applications" (`GET /candidates/:id/applications` tồn tại nhưng chưa dùng — trang chỉ hiện Resumes liên kết, không hiện các Application/Job đã ứng tuyển).
- **Prompt 18**: chưa có trang "My Profile" tự xem/sửa hồ sơ bản thân (`GET /users/me` mọi role đăng nhập đều gọi được, nhưng chỉ ADMIN sửa được người khác qua trang Users hiện tại — **không có endpoint đổi mật khẩu khi đã đăng nhập**, chỉ có luồng Forgot Password ẩn danh, nên màn hình này không thiết kế phần đổi mật khẩu).
- **Prompt 19**: Interview Question Bank chưa có nút gọi `POST /interview-questions/:id/reembed`, và công cụ "Test Retrieval" (Prompt 8) chưa phân biệt `POST /search` (đọc thuần) với `POST /search-or-generate` (có AI fallback sinh câu hỏi mới khi kết quả tìm được quá ít/thiếu liên quan).

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
| 17 | Candidates — danh sách + chi tiết + tạo/sửa | CRUD lõi |
| 18 | Resumes — danh sách + upload + chi tiết (parsed CV) + sửa | CRUD lõi |
| 19 | Job Descriptions — danh sách + chi tiết (raw/parsed/skills) + tạo/sửa | CRUD lõi |
| 20 | Applications — danh sách + chi tiết (status/events) + tạo/sửa | CRUD lõi |
| 21 | Evaluations — danh sách + kết quả chấm điểm AI + tạo mới | CRUD lõi — màn hình phân tích trung tâm |
| 22 | Dashboard (Overview) — trang đầu tiên sau khi login | Tổng hợp — chưa có API riêng, số liệu suy ra từ schema |
| 23 | Resume Detail — bổ sung xem/tải file CV | Vá lỗ hổng UI |
| 24 | Candidate Detail — bổ sung phần Applications | Vá lỗ hổng UI |
| 25 | My Profile (tự xem/sửa hồ sơ bản thân) | Vá lỗ hổng UI — màn hình mới |
| 26 | Interview Question Bank — bổ sung Re-embed + Search/Search-or-generate | Vá lỗ hổng UI |

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

## Prompt 10 — Core CRUD: Candidates

```
Design the "Candidates" screens for AI Recruiter's authenticated dashboard, using the established design system and app shell (this lives under a "Recruiting" section in the sidebar). Candidates are the root entity — every resume, application, and evaluation links back to one.

LIST VIEW
Title "Candidates", "Create Candidate" button top-right. Search bar (searches name/email/phone/location) + pagination below the table, matching the app's standard list pattern. Table columns: Candidate (name + a small monospace ID below it), Email, Phone, Location, row actions (View, Edit, Delete with confirmation). Empty state for a brand-new organization inviting the recruiter to create the first candidate profile.

DETAIL VIEW
Header card: candidate full name as the page title, a back link to the list. Three content sections below: "Basic information" (Full name, Location as a 2-column key-value grid), "Contact information" (Email, Phone), "Online profiles" (LinkedIn/GitHub/Portfolio — each rendered as a clickable link when present, or "Not provided" when empty), and a "Resumes" section showing a compact table of resume records linked to this candidate (resume ID, parse status badge, a "View detail" link per row), with an empty state ("No resumes linked yet — Upload Resume" CTA) if none exist.

CREATE / EDIT FORM
A single-column form inside a card: Full name (required), Email, Phone, LinkedIn URL, GitHub URL, Portfolio URL, Location. Cancel + Submit buttons at the bottom, with a small helper note ("This profile will be used for resumes, applications, and evaluations").

Design goal: this is the single most-visited screen in the app (recruiters live in the candidate list) — give the list view real visual polish (avatar-style initials chip per row, subtle hover state, comfortable row height) rather than a plain flat table.
```

---

## Prompt 11 — Core CRUD: Resumes

```
Design the "Resumes" screens for AI Recruiter's authenticated dashboard, using the established design system and app shell ("Recruiting" section). This is where CV files are uploaded and their AI-parsed structured data is reviewed.

LIST VIEW
Title "Resumes". An "Upload CV" panel sits above the list (see below), then the resume table: search bar + pagination, columns: Resume (file name or ID), Candidate ID, Parse Status (badge: PENDING/PROCESSING/SUCCESS/FAILED), Parser version, Updated date, row actions (View, Edit, Delete).

UPLOAD PANEL
A card with a candidate-ID input and a drag-and-drop file dropzone (PDF/DOCX, shows the chosen file name once selected, a max-size hint like "up to 5 MB"), an upload-progress bar that appears once submitted (percentage + status label: Uploading → Processing → Completed/Failed), and an "Upload CV" submit button.

DETAIL VIEW — the richest screen in this set
Header: back link, "Resume detail" title, a "Parse CV" / "Retry parse" action button (disabled + spinner while running). Sections below: "Resume information" (Resume ID, Candidate ID, Parse status, File asset ID as a 4-column info-card grid), "Parse status" card (current status line + explanatory sentence that changes per status + an error message box when parsing failed), "Linked candidate" (a link to the candidate detail page), and the centerpiece — "Parsed CV Profile": a series of icon-labeled sub-sections rendered as cards: Personal information (name/email/phone/location as a 2-col grid), Professional summary (paragraph), Technical skills (compact colored tag chips, each with a small icon badge showing the skill's initials, an optional category label), Experience (a card per role: title, company/duration subtitle, description paragraph, technology tags), Education (a card per entry: institution + degree/field, a year-range pill top-right, description), Projects (same card pattern as Experience), Certifications and Languages (two side-by-side simple bulleted-card lists). Design each of these 7 sub-sections with a consistent card language (small icon chip + title + description in the section header) so the whole parsed-data screen reads as one coherent "CV report" rather than a stack of unrelated boxes.

EDIT FORM
A lightweight metadata-only form (this does NOT re-parse the CV): Candidate ID, Parser version. Cancel + Save changes.

Design goal: the Parsed CV Profile section is effectively an information-dense "report" — invest the most visual craft here (icon language, card rhythm, skill-tag styling) since it's the screen recruiters spend the most time reading.
```

---

## Prompt 12 — Core CRUD: Job Descriptions

```
Design the "Job Descriptions" screens for AI Recruiter's authenticated dashboard, using the established design system and app shell ("Recruiting" section).

LIST VIEW
Title "Job Descriptions", "Create JD" button top-right. Search bar + pagination. Table columns: Job Description (title + company name + an Active/Inactive tag underneath), Location, Type (employment type + seniority, stacked), Parse Status (badge), Skills (count), Updated date, row actions (View, Edit, Deactivate [amber text, only shown when active], Delete).

DETAIL VIEW — three stacked sections
1. Header card: back link, JD title as page heading, company · location subtitle, a row of status/type badges (parse status + employment type + seniority as neutral pills), an inline error message box if the last parse failed, and a "Parse JD" action button top-right.
2. "Raw JD Text" card: shows the parser version used, and the full original job posting text in a scrollable monospace/code-style block.
3. "Parsed JD Data" card (shown once parsed, otherwise a dashed empty-state card prompting to click Parse JD): a top row of info cards (Parsed Title, Seniority, Employment Type, Minimum Experience, Education — as a small grid), then three bulleted list sections (Responsibilities, Requirements, Nice to have), two skill-tag sections (Required skills, Preferred skills — each skill tag shows name · normalized name · core/optional), and a "Domain keywords" tag cloud.
4. "Job Skills" manager card below: an inline add/edit form (skill name, normalized name, type dropdown Required/Preferred, weight number input, "mark as core" checkbox, Add/Update button) followed by two skill-card grids grouped by "Required skills" and "Preferred skills" — each card shows the skill name, a type badge (color-coded by required vs preferred), a CORE badge when applicable, the weight, and Edit/Delete row actions.

CREATE / EDIT FORM
Fields: Title (required), Company, Department, Location, Employment Type, Seniority (as a 2-column grid), then a large "Raw JD Text" textarea (required) with a helper note that this text can be parsed later to extract structured data.

Design goal: this screen mixes structured metadata, freeform raw text, AI-parsed output, and manual skill curation — use clear visual hierarchy (distinct card treatments) so a recruiter can tell at a glance which parts are "what I typed" vs "what the AI extracted" vs "what I'm manually managing".
```

---

## Prompt 13 — Core CRUD: Applications

```
Design the "Applications" screens for AI Recruiter's authenticated dashboard, using the established design system and app shell ("Recruiting" section). An application links one candidate + one of their resumes + one job description, and tracks a hiring-pipeline status through its lifecycle.

LIST VIEW
Title "Applications", "Create Application" button top-right. Search bar + pagination. Table columns: Application (candidate name + a small ID below), Job description (title + company subtitle), Resume (file name, truncated), Status (a colored pill for one of 9 values — DRAFT, APPLIED, SCREENING, SHORTLISTED, INTERVIEWING, OFFER, HIRED, REJECTED, WITHDRAWN — design a clear color progression: neutral for Draft, brand-primary for early funnel stages, an "in review" accent for Shortlisted/Interviewing, amber for Offer, green for Hired, red for Rejected, muted gray for Withdrawn), Applied at (date+time), row actions (View, Edit, Delete).

DETAIL VIEW
Header card: candidate name as title, "Candidate application for [JD title]" subtitle, the status pill and a prominent "Create evaluation" button top-right. Below: an 8-item info-card grid (Candidate ID, Resume ID, Job Description ID, Applied at, Source, Last activity, Evaluation count, Event count). Then a 3-column row of linked-record cards — Candidate (name, email, "View candidate" link), Resume (file name, parse status, "View resume" link), Job description (title, company, "View JD" link). A Notes card if notes exist. Below the header card: a separate "Update status" card (status dropdown + a status-note text input + Update button, with a small note that changing status logs a timeline event) and an "Application events" card showing a reverse-chronological timeline (each entry: event type label, a relative/absolute timestamp, and a description — e.g. "Status changed from APPLIED to SCREENING. Note: ...").

CREATE FORM
Three dependent dropdowns in a row: Candidate → Resume (populated only after a candidate is picked, shows a loading state while fetching, and a warning note if the candidate has no resumes yet) → Job description (only active JDs listed). Below that: Source and Notes text inputs. Cancel + Create Application buttons.

EDIT FORM
A lighter form: Source input + a read-only "Linked records" info card (candidate/JD, non-editable) + Notes textarea. Status changes are intentionally NOT part of this form (they live on the detail page's status-update card).

Design goal: the 9-status pipeline is the visual backbone of this whole feature — get the status pill color scale right first, since it's reused across the list, detail header, and status-update form.
```

---

## Prompt 14 — Core CRUD: Evaluations (AI scoring result)

```
Design the "Evaluations" screens for AI Recruiter's authenticated dashboard, using the established design system and app shell ("Recruiting" section). An evaluation is the AI-generated scoring result for one application (one candidate × one job description) — this is the analytical payoff screen of the whole product for a single candidate, distinct from the bulk Batch Matrix feature.

LIST VIEW
Title "Evaluations", "New evaluation" button top-right. A single filter control (Status dropdown: All / Pending / Processing / Completed / Failed — there is intentionally no free-text search here, only status filtering) + pagination below the table. Table columns: Candidate, Job description (truncated), Status (badge: neutral Pending, blue/info Processing, green Completed, red Failed), Overall score (bold number out of 100, or a dash if not yet scored), Created date, a View row action. Empty state prompting to create the first evaluation from an application.

DETAIL VIEW — the hero analytical screen
Header card: a large circular score badge (0–100, prominent brand-primary color) on the left, next to it the candidate name as title, "[JD title] · Status [STATUS]" subtitle, and "Started [time] · Completed [time]" caption. Top-right actions: "View application" button, and — only when status is FAILED — a "Retry evaluation" button plus a red error-message banner below the header showing the failure reason.
Below the header, in order: a 2-column row of "Summary" and "Skill gap summary" cards (paragraph text each), an "Explanation" card (paragraph), a "Score breakdown" card listing each scoring criterion (Skills Match, Experience Relevance, Project Relevance, Education/Certification, Keyword/Domain Alignment) as a row with the criterion name, "Weight X% · Contribution Y" caption, a bold percentage on the right, a horizontal progress bar below, and an optional reason paragraph + bulleted evidence list.
Then a 2-column "Matched skills" / "Missing skills" section (each skill shown as a card: name + normalized name, an importance badge, an optional note, and a bulleted evidence list) — matched should read positively (green accents), missing should read as a gap to address (red/amber accents) without feeling alarming. A "Related skills" section appears below only when applicable.
Then an "Evidence" card showing the raw evidence data as a formatted, syntax-highlighted-style code block (this is a technical/debug view, keep it visually de-emphasized compared to the sections above).
Finally an "Interview questions" card: a numbered list of AI-generated questions, each in its own sub-card with a "Question N" label, the question text prominent, a row of small tags (category / linked skill / difficulty), and a rationale paragraph.

CREATE FORM
A single-field form inside a card: an "Application" dropdown listing candidate name · JD title · current status per option, plus a "Selected application" summary card that appears once one is picked (candidate name + JD title). A helper note explains scoring runs asynchronously and the user will be redirected to the evaluation detail page. Cancel + "Create evaluation" buttons.

Design goal: the score breakdown and matched/missing skills sections are what a recruiter reads first — make the big score badge and the per-criterion progress bars the strongest visual anchors on the page, with the raw JSON evidence block deliberately the least visually prominent element (it's a technical fallback, not the headline).
```

---

## Prompt 15 — Dashboard (Overview)

```
Design the "Dashboard" (Overview) screen for AI Recruiter's authenticated app — the first page a recruiter, hiring manager, or admin sees after login, using the established design system and app shell. This replaces a placeholder page that currently shows fake, invented numbers unrelated to any real data. Every metric described below maps to a real, existing field in the product's data model (Candidates, Job Descriptions, Applications, Evaluations, Scoring Batches, Audit Log) — do not invent additional KPIs beyond what's listed.

TOP: KPI stat row (4-5 tiles)
- Total Candidates (count)
- Active Job Descriptions (count where Active, shown alongside the total)
- Applications this month (count, optionally with a small trend vs. last month)
- Evaluations completed + average overall score (0-100)
Each tile: label, large bold number, optional small trend indicator, clickable through to the relevant list page filtered appropriately (e.g. "Active Job Descriptions" links to Job Descriptions pre-filtered to Active).

APPLICATION PIPELINE / FUNNEL
A horizontal funnel or stacked bar showing the count of Applications at each status: Draft, Applied, Screening, Shortlisted, Interviewing, Offer, Hired, Rejected, Withdrawn (reuse the same status badge colors already established elsewhere in the product for these exact statuses). This is the single most important "at a glance" visual on the page — a recruiter should immediately see where candidates are getting stuck in the pipeline.

RECENT EVALUATIONS
A compact list/card of the most recently completed evaluations: candidate name, job description title, overall score (small colored badge or ring, reusing the score-ring pattern from the Evaluation detail screen), status, and a "View" link. Give any FAILED evaluations needing retry a distinct visual treatment (e.g. a red accent + retry icon) so they stand out as needing attention.

SCORING BATCHES IN PROGRESS
A small section (empty-state if none) listing any Scoring Batch currently Parsing or Scoring: batch name, a progress bar (completed/total pairs), link through to the batch detail page. Recently completed batches can also appear here, visually de-emphasized.

SKILL GAP HIGHLIGHTS
A compact ranked list of the most frequently missing skills across recent evaluations/scoring batches (reuse the skill-gap-summary visual pattern already used on the Batch Scoring feature) — lets a recruiter spot systemic gaps across their current candidate pool without opening a specific batch.

RECENT ACTIVITY (admin-relevant, can be a smaller side panel)
A short activity feed pulling from the same event types shown in the Audit Log (delete, bulk-delete, deactivate, cancel, promote, user role change) — timestamp, actor name, action, resource — as a lightweight trust/accountability signal, not a full audit log. Link through to "View full audit log".

QUICK ACTIONS
A row or small panel of shortcut buttons to the most common creation flows: "Add candidate", "Create job description", "New application", "Start batch scoring".

Design goal: this is an "at a glance" overview page, not a deep-analytics page — the KPI row and the Application funnel should be the strongest visual anchors, every other section stays compact and scannable (link through to the relevant full list/detail page rather than replicating its depth here). Match the calm, trustworthy B2B tone established in Prompt 0 — no gamified progress rings or celebratory confetti-style elements, even for positive metrics like the Hired count.
```

---

## Prompt 16 — Resume Detail addition: view/download the CV file

```
This is an addition to the existing "Resume Detail" screen for AI Recruiter (the same screen from the Candidates/Resumes core-CRUD set — reuse its established layout, don't redesign the whole screen). The product can generate a time-limited signed download URL for the candidate's original uploaded CV file, but the current design never surfaced any way to actually open or download it — recruiters could see metadata about the file but never read the real document.

Design just the addition: in the "Resume information" card (the one showing Resume ID / Candidate ID / Parse status / File asset ID), replace the plain "File asset ID" text row with a small file-preview row: a file-type icon (PDF/DOCX), the original file name if known (fall back to the file asset ID if not), and two actions — a primary "View CV" button that opens the file in a new tab, and a secondary "Download" icon button. Since the download link expires after a short time, design a loading state on the button while a fresh link is being requested (spinner + "Preparing file..."), and an inline error state for when the file can't be retrieved (e.g. it was deleted) — a small warning-colored inline message next to the button rather than a full-page error, since the rest of the resume detail page (parsed data, etc.) should still be usable even if the raw file itself is unavailable.

Design goal: this should feel like a natural, low-emphasis part of the existing info card — a file preview affordance, not a new prominent section — since the parsed CV data below it remains the main content recruiters read.
```

---

## Prompt 17 — Candidate Detail addition: Applications section

```
This is an addition to the existing "Candidate Detail" screen for AI Recruiter (same screen as the core-CRUD Candidates set — reuse its established layout of stacked info sections, don't redesign the whole screen). The screen currently shows Basic information / Contact information / Online profiles / a "Resumes" section listing linked resume records — but never shows which job descriptions this candidate has actually applied to, even though that data exists.

Design just the addition: a new "Applications" section, styled consistently with the existing "Resumes" section on the same page (same card language, positioned directly after it). A compact table/list of this candidate's applications: Job description title, Status (reuse the same status badge colors used everywhere else in the product for DRAFT/APPLIED/SCREENING/SHORTLISTED/INTERVIEWING/OFFER/HIRED/REJECTED/WITHDRAWN), Applied date, and a "View" link through to the full Application detail page. Empty state ("Not applied to any job description yet") when the candidate has no applications, matching the tone of the existing empty Resumes state.

Design goal: a recruiter looking at a candidate profile should be able to answer "what has this person applied to, and where are they in the process" without leaving the page — keep this section scannable at a glance (it's a summary list, not the full Application detail).
```

---

## Prompt 18 — My Profile (new screen)

```
Design a new "My Profile" screen for AI Recruiter's authenticated app, using the established design system and app shell — reachable from the user-menu in the top header (avatar/name/role badge/logout), which currently has no link to view one's own account. Every authenticated role (Admin, Recruiter, Hiring Manager, DEV) can reach this screen for themselves.

LAYOUT
A single centered card (similar width to the Evaluation create-form card, not full-width like a list page): a large avatar/initials circle at the top, full name as the heading, role shown as the same colored role badge used on the Users admin screen (Admin/Recruiter/Hiring Manager/DEV), and the organization name as a subtitle. Below that, a simple key-value section: Email (read-only), Full name (editable text field), Member since (joined date, read-only).

EDITABLE STATE
An "Edit" button toggles the Full name field into an editable input with Cancel/Save actions; email/role/organization/joined-date remain permanently read-only on this screen (they're either identity fields or admin-managed elsewhere). After saving, show a success toast ("Profile updated").

IMPORTANT CONSTRAINT — no password change here
There is intentionally no "change password" section on this screen — the product has no authenticated "change my password" endpoint yet, only an unauthenticated forgot-password email flow. Instead, include a small text note near the bottom: "Need to change your password? Log out and use the Forgot Password link on the login screen." — worded as a calm informational note, not an error.

Design goal: this is a lightweight, low-frequency-visit screen — keep it simple and calm, a single focused card rather than a dashboard-style page with multiple sections.
```

---

## Prompt 19 — Interview Question Bank additions: Re-embed action + Search vs Search-or-Generate

```
These are two additions to the existing "Interview Question Bank" screens for AI Recruiter (DEV role tool — reuse the established layout from that screen set, don't redesign the whole thing).

ADDITION 1 — Re-embed row action
The retrieval engine ranks questions by a vector embedding of their question text; the product can recompute and persist that embedding on demand (useful after an embedding-model upgrade, as a backfill tool). Add a small icon-only "Re-embed" action (a refresh/vector icon) to the row actions on the main list table, alongside the existing Edit/Delete/Approve actions — same icon-button-with-hover-tooltip style used elsewhere. On click, show a brief loading spinner on the icon itself, then a small success toast ("Embedding recomputed").

ADDITION 2 — distinguish "Search" from "Search or Generate" on the Test Retrieval tool
The existing Test Retrieval tool (query text + Occupation Family/Specialization selectors + a single "Search" button) actually needs to represent two different real actions: a pure read-only similarity search over existing approved questions, versus a search that falls back to generating brand-new AI-authored questions when the existing results are too few or too weakly related to the query. Replace the single "Search" button with two clearly distinct actions — e.g. a secondary "Search" button plus a primary "Search + Generate if needed" button (with a small sparkle/AI icon to signal the generative fallback) — and add a one-line helper caption under the buttons explaining the difference in plain language.

Results layout: existing matched questions render exactly as before (ranked list, similarity score/bar per item). When the "Search + Generate if needed" action produces newly AI-generated questions, render them in a visually distinct sub-section below the existing results — a subtle divider, a small "Newly generated — pending review" label, each item shown with the same pending-review quality-gate badge/styling already used elsewhere in this tool, plus an inline "Approve" quick-action so the DEV reviewer can immediately promote a good one into the reusable question bank without leaving this screen.

Design goal: a DEV user glancing at the results should immediately be able to tell "this came from the existing bank" apart from "this was just generated and needs my review" — the pending-review visual language already established for the main list (amber/warning accent) should carry over here rather than inventing a new treatment.
```

---

## Sau khi có kết quả từ Stitch

1. Dán Prompt 0 trước, xác nhận style guide hợp lý (đúng tinh thần B2B, không quá "consumer app") trước khi dùng làm nền cho các prompt sau.
2. Dán lần lượt Prompt 1 → 19, nhắc Stitch "match the style guide from earlier" nếu thấy phong cách trôi giữa các lần tạo.
3. Ưu tiên review kỹ Prompt 3 (Matrix), Prompt 14 (Evaluation detail), và Prompt 15 (Dashboard) trước — đây là các màn hình phân tích/tổng hợp trung tâm, nên lặp lại nhiều lần nếu bố cục/heatmap/hierarchy chưa ổn.
4. Sau khi có bộ thiết kế ưng ý: map thành component thật trong dự án theo đúng convention hiện có (`api/`+`components/`+`hooks/`+`types/`+`validations/` mỗi feature module, dùng lại `apiClient`/`DataTable`/`ConfirmDialog`/`showToast` sẵn có).
   - Prompt 10–14: đây là màn hình API thật, khi code lại chỉ đổi phần UI/layout — **giữ nguyên toàn bộ hooks/api calls/logic hiện có**, không tự ý đổi field hay hành vi.
   - Prompt 15 (Dashboard): **chưa có API thật** — khi code lại cần tạo mock data trước (giống cách 5 khu vực CRUD lõi đã làm ở giai đoạn mock), không phải map vào hooks có sẵn.
   - Prompt 16 (Resume file) và Prompt 17 (Candidate applications): **có API thật** (`GET /files/:id/download-url`, `GET /candidates/:id/applications`) — code thẳng vào hooks/api call thật, không cần mock.
   - Prompt 18 (My Profile): `GET /users/me` là API thật (dùng ngay); phần sửa Full name cần xác nhận trước — nếu chưa chắc `PATCH /users/:id` cho phép user tự sửa tên mình khi không phải ADMIN, kiểm tra lại `UsersService` bên backend trước khi code, tránh giả định sai.
   - Prompt 19 (Interview Question additions): `POST /interview-questions/:id/reembed` và `POST /interview-questions/search-or-generate` đều là API thật đã có sẵn — nhưng cả module `interview-questions` ở FE hiện vẫn theo pattern mock-import trực tiếp (không có `api/` riêng, xem `interview-question-list.tsx`) — cần quyết định có tách ra `api/interview-question.api.ts` thật khi wiring lại hay không, tuỳ phạm vi công việc lúc đó.
