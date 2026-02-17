## Why

Personal calorie and protein tracking should be instant and reliable: open the app many times per day without waiting on the network or heavy tooling. A minimal offline-first PWA solves this by storing everything locally and loading from cache, so it works after first visit and stays fast.

## What Changes

- **New app**: A single-page, offline-first PWA for logging daily calorie and protein intake.
- **Local-only storage**: All data in localStorage (or IndexedDB), keyed by calendar date (YYYY-MM-DD). No backend or cloud.
- **Today-centric UX**: On open, detect today’s date, load today’s entries, show total calories, total protein, and the list of entries. Each new day starts empty.
- **Add-entry flow**: Floating Add (+) button opens a minimal modal with Calories (required, > 0) and Protein (optional, ≥ 0); Add saves for today and closes, Cancel closes without saving. Totals update immediately and data persists.
- **PWA shell**: manifest.json, service worker, installable, and full offline use after first load; all static assets cached.
- **Tech constraints**: Vanilla JS (or very lightweight), no backend/APIs/auth, runnable via opening index.html on a local server.

Out of scope: user accounts, cloud sync, food database, editing past days, charts/analytics.

## Capabilities

### New Capabilities

- `intake-storage`: Local persistence of intake entries by date (localStorage or IndexedDB); schema keyed by YYYY-MM-DD with array of `{ calories, protein }`; read/write for current and past dates.
- `daily-dashboard`: Today’s view: detect current date, load today’s entries, display total calories, total protein, and list of today’s entries; empty state when no entries.
- `add-entry`: Floating Add (+) button, modal with Calories (number, required, > 0) and Protein (number, optional, ≥ 0); Add saves entry for today, updates UI, closes modal, persists; Cancel closes without saving.
- `pwa-offline`: Web app manifest, service worker for installability and offline; cache all static assets so the app works fully offline after first visit.

### Modified Capabilities

- (None — no existing specs in this repo.)

## Impact

- **New codebase**: New SPA under the project (e.g. `index.html`, app JS, minimal CSS, `manifest.json`, service worker script). No existing app code to modify.
- **Dependencies**: None beyond what’s needed for a static PWA (no frameworks required; optional dev server for local development).
- **Systems**: No external APIs, auth, or backend; purely client-side and local storage.
