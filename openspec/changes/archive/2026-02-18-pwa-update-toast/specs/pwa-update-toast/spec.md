## ADDED Requirements

### Requirement: Update availability detection
The application SHALL detect when a new app version is available (e.g. a new service worker has been installed and is waiting). The app SHALL expose this state so the update toast can be shown when appropriate.

#### Scenario: New version waiting is detected
- **WHEN** a new service worker (or equivalent new build) has been installed and is in a waiting state
- **THEN** the app SHALL treat an update as available and SHALL be able to show the update toast subject to suppression rules

#### Scenario: No update pending
- **WHEN** the currently active service worker is the latest and no waiting worker exists
- **THEN** the app SHALL NOT show the update toast

### Requirement: Update toast presentation
When an update is available and not suppressed, the application SHALL show a single, minimal toast anchored at the bottom of the viewport. The toast SHALL inform the user that a new version is available. The toast SHALL use a dark background and SHALL have sufficient contrast for accessibility (e.g. light text on dark background). The toast SHALL match the existing app feel (e.g. reuse typography and spacing where applicable).

#### Scenario: Toast shown when update available and not suppressed
- **WHEN** an update is available and the user has not dismissed the toast within the current suppression window (or has never dismissed)
- **THEN** the app SHALL display one update toast at the bottom of the screen with a message indicating a new version is available

#### Scenario: Toast visual style
- **WHEN** the update toast is visible
- **THEN** the toast SHALL have a dark background and SHALL present text and actions with good contrast; the toast SHALL be minimal and consistent with the rest of the app

### Requirement: Dismiss and suppression
The user SHALL be able to dismiss the update toast. When dismissed, the toast SHALL disappear (e.g. fade out). The application SHALL suppress showing the update toast again for at least one week after dismiss. Suppression SHALL be persisted (e.g. in local storage) so it survives page reload and browser restart.

#### Scenario: User dismisses toast
- **WHEN** the user dismisses the update toast (e.g. via a "Later" or "Dismiss" action)
- **THEN** the toast SHALL disappear and SHALL NOT be shown again until at least one week has passed

#### Scenario: Suppression persists
- **WHEN** the user has dismissed the toast and less than one week has passed
- **THEN** the app SHALL NOT show the update toast even after refresh or reopening the app

#### Scenario: Suppression expires
- **WHEN** at least one week has passed since the user last dismissed the toast and an update is still available
- **THEN** the app MAY show the update toast again

### Requirement: Approve update and reload
The user SHALL be able to accept the update from the toast. When the user accepts, the application SHALL activate the new version (e.g. cause the waiting service worker to take control), SHALL revalidate or replace caches as needed, and SHALL load the new version (e.g. reload the page so the new assets are used).

#### Scenario: User accepts update
- **WHEN** the user accepts the update (e.g. via an "Update" or "Reload" action on the toast)
- **THEN** the app SHALL activate the new service worker (or equivalent), SHALL ensure caches are updated for the new version, and SHALL reload the page so the user is running the new version

#### Scenario: Page runs new version after approve
- **WHEN** the user has accepted the update and the page has reloaded
- **THEN** the app SHALL be running with the new build (new cache and new assets); the update toast SHALL NOT be shown for that version until a further update is available
