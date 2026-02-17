## ADDED Requirements

### Requirement: Web app manifest
The application SHALL provide a valid web app manifest (e.g. manifest.json) so the app is installable as a PWA. The manifest SHALL include required fields (e.g. name, start_url, display, icons as required for installability).

#### Scenario: App is installable
- **WHEN** the user visits the app in a supporting browser
- **THEN** the browser SHALL offer or support installation (e.g. "Add to Home Screen" or install prompt) when the manifest is present and valid

### Requirement: Service worker for offline
The application SHALL register a service worker that SHALL cache static assets (HTML, JS, CSS, manifest, and other app resources) so the app SHALL work fully offline after the first successful load.

#### Scenario: Offline after first visit
- **WHEN** the user has loaded the app at least once with network available
- **THEN** on subsequent visits without network, the app SHALL load and function using cached assets

#### Scenario: Static assets cached
- **WHEN** the service worker is active and the user loads the app
- **THEN** the service worker SHALL cache all static assets required to run the app (e.g. index document, scripts, styles, manifest) so they can be served offline

### Requirement: No network dependency after first load
The application SHALL NOT require network access for core functionality (viewing today's data, adding entries, persistence) after the initial load that populates the cache. All data SHALL be stored and read locally.

#### Scenario: Add entry offline
- **WHEN** the user is offline after the app has been cached
- **THEN** the user SHALL be able to add entries and SHALL see totals and list update; data SHALL persist in local storage
