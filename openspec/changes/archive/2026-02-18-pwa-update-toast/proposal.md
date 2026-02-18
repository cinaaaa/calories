## Why

The app is offline-first and serves assets from local caches. When we ship a new version, users keep running the old one until they manually refresh or revisit. We need a clear way to tell users an update is available and let them choose to reload so they get fixes and new features without leaving the app.

## What Changes

- **Update detection**: When a new app version is available (e.g. new service worker / new build), the app detects it.
- **Update toast**: A minimal toast appears from the bottom informing the user that a new version is available.
- **Dismiss**: User can dismiss the toast; it fades out and is suppressed for at least one week (no repeat prompt in that period).
- **Approve / Update**: User can accept the update; the app revalidates caches and loads the new version (e.g. skipWaiting + reload or equivalent).
- **UI**: Toast is minimal, matches existing app feel, dark background, good contrast.

## Capabilities

### New Capabilities

- `pwa-update-toast`: Notify users when a new app version is available via a bottom toast; support dismiss (suppress for ≥1 week) and approve (revalidate caches and load new version); minimal, dark, high-contrast UI.

### Modified Capabilities

- (None. Existing `pwa-offline` behavior is unchanged; this adds update notification and refresh flow on top.)

## Impact

- **Service worker / registration**: Hook into update detection (e.g. `registration.waiting`, or check for new SW/build) and expose “update available” state to the app.
- **Root layout or shell**: Host the update toast (single global toast, bottom-positioned).
- **Persistence**: Store “dismissed until” (or equivalent) in local storage so we respect the one-week suppression.
- **Cache / reload**: On approve, trigger cache revalidation and load new version (e.g. `skipWaiting()` + `location.reload()` or framework-specific refresh).
