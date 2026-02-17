## Context

New greenfield app: a minimal, personal-use PWA for logging daily calorie and protein intake. No existing codebase to integrate; constraints are vanilla (or very lightweight) JS, no backend/APIs/auth, single page, and runnable via a local server opening `index.html`. Data is stored only locally and grouped by calendar date (YYYY-MM-DD).

## Goals / Non-Goals

**Goals:**

- Deliver an offline-first, installable PWA that works after first load without network.
- Persist intake entries by date in local storage; show today’s totals and list; support adding entries via a minimal modal.
- Keep the app fast to open and simple (minimal UI, no unnecessary animations).

**Non-Goals:**

- User accounts, cloud sync, food database, editing past days, charts/analytics.

## Decisions

**1. Storage: localStorage vs IndexedDB**

- **Choice:** localStorage.
- **Rationale:** Single user, small payload (entries per day, few fields). localStorage is synchronous, has no setup, and is sufficient for expected volume. IndexedDB would be used only if we later needed large datasets or async patterns.
- **Alternative considered:** IndexedDB for future-proofing and async API; rejected for added complexity with no current need.

**2. Stack: Vanilla JS**

- **Choice:** Vanilla JS (no framework).
- **Rationale:** Proposal requires “no frameworks unless necessary”; the app is a single page with one main view, a modal, and local read/write. Vanilla JS keeps bundle size minimal and load instant.
- **Alternative considered:** Lightweight lib (e.g. Preact/Alpine); rejected to avoid tooling and keep “open index.html via local server” trivial.

**3. App structure**

- **Choice:** Single entry HTML file that loads one main JS module and one CSS file; optional small modules (e.g. storage, render) if it keeps main file readable.
- **Rationale:** Simplest mental model and fastest first load; no build step required for basic run.
- **Alternative considered:** Multi-page or heavy modularization; rejected for scope and “minimal” requirement.

**4. “Today” and timezone**

- **Choice:** Use the user’s local date via `new Date()` and format as YYYY-MM-DD for storage keys.
- **Rationale:** Daily logging is local-time oriented; no server, so no need for UTC. Same approach works in development and production.
- **Alternative considered:** UTC; rejected because “today” should match the user’s calendar day.

**5. Service worker strategy**

- **Choice:** Cache-first for same-origin static assets (HTML, JS, CSS, manifest). No cache for network fetches (there are none).
- **Rationale:** App is static and offline-first; one fetch per asset type, then serve from cache. No versioned URLs required for initial version; cache can be versioned later if needed.
- **Alternative considered:** Network-first; rejected because offline use is a requirement.

**6. Modal and add-entry UX**

- **Choice:** Inline modal in the same HTML (hidden by default), toggled by class or attribute; form submit adds entry for today, then close and re-render.
- **Rationale:** No routing; one screen plus one modal. Keeps DOM and JS simple.
- **Alternative considered:** Separate “page” or overlay component library; rejected for complexity and bundle size.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| localStorage quota (~5–10 MB) exceeded with long-term use | Acceptable for personal daily logs; if needed later, migrate to IndexedDB or prune old dates. |
| No backup or sync | Explicit non-goal; user can export (future) or accept device-only data. |
| Stale cache after updates | Use cache name or version in service worker so new SW can replace old cache; consider skipWaiting for simple updates. |
| Date edge cases (e.g. DST, midnight) | Use standard `Date` and YYYY-MM-DD; document that “today” is local date at open. |

## Migration Plan

- **Deploy:** Static deploy only (e.g. copy `index.html`, JS, CSS, `manifest.json`, service worker to host). No backend or DB migrations.
- **Rollback:** Revert to previous static assets; users may need to refresh or re-open app to get new SW/cache.
- **Data:** No server-side data; no migration of user data.

## Open Questions

- None for initial scope. Optional future: export of entries (e.g. JSON download) or cache versioning strategy if we add hashed filenames.
