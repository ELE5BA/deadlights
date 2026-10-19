# DEADLIGHTS 3D: The Lost Pokédex

Local-first school-booth horror-carnival runner. The product baseline is documented in `DEADLIGHTS_3D_Master_Project_Blueprint-2.md`.

## Prerequisites

- Node.js 22 LTS (pinned in `.nvmrc`)
- npm 10+

## Quick start

1. Copy `.env.example` to `.env` and replace both placeholder secrets.
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`; API health is at `http://127.0.0.1:4174/api/health`.

## Commands

- `npm test` — unit and integration tests
- `npm run build` — production frontend build
- `npm run start:booth` — serve `dist` and API from one localhost port after a build
- `npm run db:seed` — run migrations and idempotent catalog/config seed
- `npm run db:backup` — create a dated SQLite backup
- `npm run db:restore -- <backup.sqlite> <separate-test.sqlite>` — restore only to a separate test copy
- `npm run check:environment` — verify Node baseline and database path

The runtime database is `data/deadlights.sqlite`; it and backups are intentionally ignored by Git.
