# Stitch design assets

Each folder below corresponds to one screen/flow from `docs/stitch-design-prompts.md`. After generating a screen in Stitch, use its "Download" feature and drop the exported files (`screen.png`, `code.html`, `DESIGN.md`) directly into the matching folder.

- `00-style-guide/` — Prompt 0 output (colors, typography, component library). **This is
  the single canonical design system for every screen in this folder** — every other
  subfolder below was implemented against these tokens, not any per-batch style export
  Stitch happens to bundle alongside a later prompt's screens.
- `01-auth/` — Prompt 1 (register org, email verify, resend, forgot/reset password, login)
- `02-batch-scoring/` — Prompts 2-4 (create batch wizard, matrix + cell detail, list, skill-gap summary)
- `03-admin/` — Prompts 5-8 (evaluation configs, user management, audit log, interview question bank)
- `04-public/` — Prompt 9 (public landing/create batch, public matrix results)
- `05-core-crud/` — Prompts 10-14 (candidates, resumes, job descriptions, applications,
  evaluations — the pre-existing real-API screens, redesigned). Its
  `00-stitch-export-reference-only/` subfolder is Stitch's own style export from that
  generation session — kept as raw reference only, **not** used as a design source (see
  the NOTE.md inside); `00-style-guide/` above was used instead, same as every other
  folder.

Once reviewed and merged into `develop`, implementation happens on separate per-screen branches: static UI first, then API integration.
