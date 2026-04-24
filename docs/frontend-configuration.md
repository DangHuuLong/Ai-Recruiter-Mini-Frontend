# Frontend Configuration

**Project:** AI Recruiter Mini — Internal Recruiter Dashboard  
**Stack:** Next.js App Router · TypeScript · Tailwind CSS  
**Scope:** Shared frontend configuration for routes and navigation.

---

## 1. Routes and Navigation Configuration

### Purpose

This section defines the shared configuration for route paths and dashboard navigation.

The goal is to avoid hardcoded route strings inside layout components and keep navigation data outside the `Sidebar` component.

---

### Files

```
src/config/routes.config.ts
src/config/navigation.config.ts
src/lib/types/navigation.ts
```

| File | Purpose |
|---|---|
| `src/config/routes.config.ts` | Stores shared route constants |
| `src/config/navigation.config.ts` | Stores dashboard navigation items |
| `src/lib/types/navigation.ts` | Stores navigation-related types |