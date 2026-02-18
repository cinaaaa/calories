## Context

The app is a SvelteKit PWA with a custom service worker (`src/service-worker.ts`) that uses `$service-worker` (build, files, version). The cache key is `calories-pwa-${version}`, so each deploy gets a new version and a new cache. Registration is manual in `+layout.svelte` (`register: false` in `svelte.config.js`). The worker does not call `skipWaiting()` on install, so when a new build is deployed, the new worker installs and enters the "waiting" state until the active worker relinquishes control. The client currently has no way to discover that an update is waiting or to trigger a reload. Styling uses CSS variables in `layout.css` (e.g. `--color-bg`, `--color-accent`); the proposal asks for a minimal, dark, high-contrast toast that fits the existing feel.

## Goals / Non-Goals

**Goals:**

- Detect when a new service worker (new app version) is waiting.
- Show a single, minimal toast anchored at the bottom with a dark background and good contrast.
- On "Dismiss": hide the toast and suppress showing it again for at least one week (persisted).
- On "Update" / "Reload": activate the new worker (revalidate caches and load the new version).
- No change to existing offline/caching behavior; purely additive.

**Non-Goals:**

- Forcing an update without user action; no auto-reload.
- Changing cache strategy or adding new caches beyond what the SW already does on activate.
- In-app changelog or version number in the toast (can be added later if desired).

## Decisions

### 1. Update detection: use `ServiceWorkerRegistration.waiting` and periodic `update()`

- **Choice:** In the client (e.g. where the SW is registered in `+layout.svelte`), after `navigator.serviceWorker.register()`, hold the `ServiceWorkerRegistration`. Call `registration.update()` on a reasonable interval (e.g. on focus or every N minutes) and whenever `registration.waiting` is set, treat that as "update available" and show the toast.
- **Rationale:** SvelteKit’s build produces a new `service-worker.js` per deploy. When the browser fetches that file (via `update()` or next page load), it installs the new worker; since the current worker does not call `skipWaiting()`, the new one stays in "waiting". Checking `registration.waiting` is the standard way to know an update is pending.
- **Alternatives:** Rely only on `controllerchange` — that fires after the new worker takes control (e.g. after reload), so it’s too late for "update available". Polling a `/version` endpoint would work but adds a network dependency and server contract; using the registration is sufficient.

### 2. Dismiss suppression: one key in `localStorage` with a "dismissed until" timestamp

- **Choice:** Single key (e.g. `pwa-update-dismissed-until`) storing an ISO timestamp. When the user dismisses the toast, set the value to "now + 7 days". Before showing the toast, check that either the key is missing or the stored time is in the past.
- **Rationale:** Simple, no new dependencies, survives refresh and restart. One-week minimum is a product requirement; implementation is a fixed 7-day window from dismiss.
- **Alternatives:** Per-version dismiss (e.g. "dismissed for version X") would require exposing version to the client and more logic; a single time-based window keeps behavior clear and avoids version coupling.

### 3. Toast placement and structure: one global toast in the root layout

- **Choice:** Add the update toast in `+layout.svelte` (or a minimal layout wrapper), fixed at the bottom of the viewport (e.g. `position: fixed; bottom: 0; left/right`), so it appears above content and works across all routes. One toast instance; state is "update available" + "dismissed until" so we only show when both conditions are met.
- **Rationale:** Update is app-global; layout is the natural place. Avoids duplicate toasts and keeps logic in one place.
- **Alternatives:** A separate "shell" component or Svelte context could hold the toast; for a single global toast, layout is sufficient.

### 4. Activating the new version: `postMessage` to waiting worker to `skipWaiting()`, then reload on `controllerchange`

- **Choice:** When the user taps "Update" (or equivalent): (1) Post a message to `registration.waiting` (e.g. `{ type: 'SKIP_WAITING' }`). (2) In the service worker, listen for `message` and, for that type, call `self.skipWaiting()`. (3) In the client, listen for `navigator.serviceWorker.oncontrollerchange` (or the one-off `controllerchange` event) and then call `window.location.reload()` so the page runs under the new worker and gets the new cache (existing activate handler already deletes old caches).
- **Rationale:** This is the standard PWA pattern for "Update now". No change to cache logic; the existing activate handler already prunes old caches. Reload ensures all assets come from the new worker’s cache.
- **Alternatives:** Calling `registration.waiting.postMessage({ type: 'SKIP_WAITING' })` from the client is equivalent to having the SW listen and call `skipWaiting()`; doing it in the SW keeps the contract simple (one message type).

### 5. Toast UI: minimal, dark, high contrast, same feel

- **Choice:** A small bar or card at the bottom: short copy (e.g. "New version available"), two actions — primary "Update" and secondary "Later" / "Dismiss". Use dark background (e.g. dark gray/black) and light text; primary button can use the existing accent (e.g. `--color-accent`) for consistency. Reuse layout spacing and typography (e.g. `--font-sans`, `--font-size-body`) so it feels part of the app. Optional: subtle entrance (e.g. slide-up) and exit (fade) for polish.
- **Rationale:** Matches the proposal (minimal, dark, good contrast, same feel). Reusing design tokens keeps it consistent without introducing a new design system.
- **Alternatives:** A single "Reload" button only — offering "Later" reduces friction for users who are mid-task.

## Risks / Trade-offs

- **Risk:** Users who never click "Update" and rarely refresh may stay on an old version for a long time.  
  **Mitigation:** Acceptable for this product; we avoid forcing reload. Optional future improvement: shorten suppress window or show again after N days.

- **Risk:** `registration.update()` is not called often, so some users might not see the toast until they reload or revisit.  
  **Mitigation:** Call `update()` on registration and on window focus (and optionally on a timer); that’s enough for typical use without being aggressive.

- **Trade-off:** Storing "dismissed until" in localStorage means a user who dismissed on one device won’t see the toast on another (no sync).  
  **Acceptable:** Per-device behavior is simpler and matches typical PWA expectations.

## Migration Plan

- **Deploy:** No data migration. Deploy updated service worker (with message listener for `SKIP_WAITING`) and updated client (registration + toast + localStorage check). Existing clients will get the new SW on next fetch of `service-worker.js`; then they see the toast when the new worker is waiting (and not suppressed).
- **Rollback:** Revert to previous build; no persistent state to migrate back. Old clients may still have "dismissed until" in localStorage; that only affects whether the toast is shown, not correctness.

## Open Questions

- None. Optional follow-ups: expose a build/version string in the toast for debugging; tune how often to call `registration.update()` (e.g. every 30–60 minutes or only on focus).
