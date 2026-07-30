This `DESIGN.md` is Stitch's own style-guide export from the same generation session as
the 5 screens in this `06-gap-fixes/` folder — kept here only as raw reference (it may
mention a different palette/token naming than the rest of the app, e.g. "Intelligent
Talent System" branding).

**Do not use this as the source of truth.** The canonical design system for this project
is `design/00-style-guide/` (Prompt 0 output) — every screen, including all of
`06-gap-fixes/`, was implemented against those tokens (`surface`, `on-surface`,
`primary`, `success`/`warning`/`error` + `-container` variants, etc. in
`tailwind.config.ts`), not the palette described in this file.
