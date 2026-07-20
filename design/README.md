# Stitch design assets

Each folder below corresponds to one screen/flow from `docs/stitch-design-prompts.md`. After generating a screen in Stitch, use its "Download" feature and drop the exported files (`screen.png`, `code.html`, `DESIGN.md`) directly into the matching folder.

- `00-style-guide/` — Prompt 0 output (colors, typography, component library)
- `01-auth/` — Prompt 1 (register org, email verify, resend, forgot/reset password, login)
- `02-batch-scoring/` — Prompts 2-4 (create batch wizard, matrix + cell detail, list, skill-gap summary)
- `03-admin/` — Prompts 5-8 (evaluation configs, user management, audit log, interview question bank)
- `04-public/` — Prompt 9 (public landing/create batch, public matrix results)

Once reviewed and merged into `develop`, implementation happens on separate per-screen branches: static UI first, then API integration.
