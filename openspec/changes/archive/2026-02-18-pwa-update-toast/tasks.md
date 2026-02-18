## 1. Service worker: skipWaiting on request

- [x] 1.1 In `src/service-worker.ts`, add a `message` event listener that, when the message type is `SKIP_WAITING`, calls `self.skipWaiting()`

## 2. Dismiss suppression persistence

- [x] 2.1 Implement logic to read and write the dismiss-suppression state: localStorage key `pwa-update-dismissed-until` storing an ISO timestamp (now + 7 days on dismiss); before showing the toast, require that the key is missing or the stored timestamp is in the past

## 3. Update toast component

- [x] 3.1 Create a reusable update-toast component (e.g. `UpdateToast.svelte`) that accepts props for visibility, onUpdate, and onDismiss
- [x] 3.2 Style the toast: fixed at bottom of viewport, dark background, light text, good contrast; short message (e.g. "New version available"); primary "Update" and secondary "Later" / "Dismiss" actions; reuse existing design tokens (e.g. `--font-sans`, `--font-size-body`, `--color-accent` for primary button)
- [x] 3.3 Add optional entrance (e.g. slide-up) and exit (fade) so the toast appears and disappears smoothly

## 4. Layout: update detection and toast wiring

- [x] 4.1 In `+layout.svelte`, after registering the service worker, keep a reference to the `ServiceWorkerRegistration` and call `registration.update()` on window focus (and optionally on a timer, e.g. every 30–60 minutes)
- [x] 4.2 Derive "update available" when `registration.waiting` is set; derive "show toast" when update is available and not suppressed (using the dismiss-until localStorage check from task 2.1)
- [x] 4.3 Render the update toast in the layout when "show toast" is true; on Dismiss: set `pwa-update-dismissed-until` to now + 7 days and hide the toast; on Update: postMessage `{ type: 'SKIP_WAITING' }` to `registration.waiting`, then listen for `controllerchange` and call `window.location.reload()`

## 5. Verification

- [ ] 5.1 Manually verify: deploy a new build, open app in a tab, trigger an update check (or wait for focus/timer); toast appears at bottom with dark style and Update / Dismiss; Dismiss hides toast and suppresses for 7 days; Update reloads the page and new version runs
