# GOLD PICSAVER Loan Scanner

An offline-first Expo app for photographing GOLD PICSAVER loan forms, reviewing extracted applicant data, and keeping a searchable local applicant workspace.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo 57 + Expo Router + React Native
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/gold-picsaver-scanner/` — Expo mobile app and offline applicant workspace
- `artifacts/gold-picsaver-scanner/lib/app-state.tsx` — dynamic template and AsyncStorage-backed applicant state
- `artifacts/gold-picsaver-scanner/app/` — overview, scan, review, applicants, and applicant detail routes
- `artifacts/api-server/src/routes/templates.ts` — active-template, extraction, and applicant sync API scaffold
- `lib/api-spec/openapi.yaml` — source of truth for the API contract

## Architecture decisions

- Form fields are defined by a versioned template and applicant values are stored as a keyed data object, so new fields do not require a mobile redeploy.
- The first mobile build persists applicants in AsyncStorage and keeps sync status on each record; the API is ready for the next Supabase-backed sync phase.
- Extraction is intentionally mocked in the API scaffold and the review screen surfaces low-confidence values for correction before save.
- Camera capture uses the native Expo image picker camera on device and a library-picker fallback in web preview.

## Product

- Start a new scan with multi-page capture.
- Review a dynamically rendered GOLD PICSAVER field set with flagged fields.
- Save applicants locally for offline use.
- Search applicants and open a detail view with a direct call action.
- View pending review and sync status at a glance.

## User preferences

No additional preferences recorded.

## Gotchas

- The API routes currently use in-memory storage as a development scaffold; Supabase persistence and real vision extraction are the next production integrations.
- Expo preview may log a non-fatal React Native DevTools `libglib` warning in this environment while Metro continues to serve the app.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
