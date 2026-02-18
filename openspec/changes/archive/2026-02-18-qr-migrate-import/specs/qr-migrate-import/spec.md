## ADDED Requirements

### Requirement: Settings entry for migrate/import
The system SHALL provide access to export and import data from the settings modal. The UI SHALL include controls or buttons that let the user start "Export" (show QR) and "Import" (scan or choose code). Copy SHALL be minimal and informative (e.g. short labels and one-line explanations).

#### Scenario: User opens export from settings
- **WHEN** the user opens settings and chooses the option to export or move data
- **THEN** the system SHALL show the export flow (e.g. a screen or modal where a QR code will be displayed)

#### Scenario: User opens import from settings
- **WHEN** the user opens settings and chooses the option to import data
- **THEN** the system SHALL start the import flow (camera scanner or file/image picker) so the user can scan or select a QR code

### Requirement: Export produces a single QR code from compressed payload
The system SHALL build an export payload from current intake and settings in local storage. The payload SHALL use a compact format (short keys, no unnecessary whitespace, minimal fields). The system SHALL compress the payload (e.g. gzip/deflate) and encode it (e.g. base64url) before rendering it as a QR code. The QR code SHALL be displayed so the user can show it to another device. If the resulting payload exceeds a safe size for a single QR code, the system SHALL NOT render a code and SHALL show a clear message that data is too large to fit in one QR.

#### Scenario: Export with data shows QR
- **WHEN** the user starts export and local storage has intake and/or settings
- **THEN** the system SHALL produce a compressed, encoded payload and SHALL display it as a QR code

#### Scenario: Export when payload too large
- **WHEN** the user starts export and the encoded payload exceeds the configured maximum size for one QR
- **THEN** the system SHALL NOT display a QR code and SHALL show an informative message (e.g. that there is too much data for one code)

### Requirement: Payload format and version
The export payload SHALL include intake (date-keyed entries) and settings (daily allowance, current weight, previous weight). The payload SHALL use a version prefix or marker so the importer can reject unknown or invalid formats. The encoded string (after compression and encoding) SHALL be the sole content used to generate the QR code.

#### Scenario: Payload contains intake and settings
- **WHEN** export runs with existing intake and settings
- **THEN** the decoded payload SHALL contain data equivalent to the current intake store and settings (dates, entries with calories and protein, and the three settings fields)

#### Scenario: Import rejects invalid or unknown payload
- **WHEN** the user completes import and the scanned or selected content is missing the version marker, malformed, or from an unsupported version
- **THEN** the system SHALL NOT write to local storage and SHALL show a clear error (e.g. invalid or damaged code)

### Requirement: Import via scan or file
The system SHALL allow the user to provide the QR content either by scanning with the device camera (when available) or by choosing an image file that contains the QR code. After the code is read, the system SHALL decode and decompress the payload.

#### Scenario: Import from camera scan
- **WHEN** the user starts import and the device supports camera access and the user scans a valid export QR code
- **THEN** the system SHALL decode the payload and SHALL proceed to validate and apply the import

#### Scenario: Import from image file
- **WHEN** the user starts import and selects an image file containing a valid export QR code (e.g. when camera is unavailable)
- **THEN** the system SHALL decode the payload from the image and SHALL proceed to validate and apply the import

### Requirement: Import overwrites local storage and gives feedback
On successful import, the system SHALL overwrite intake and settings in local storage with the payload contents (replace-all; no merge). The system SHALL then show clear success feedback. After success, the app SHALL reflect the newly imported data (e.g. current view updates).

#### Scenario: Successful import replaces data
- **WHEN** import completes successfully with a valid payload
- **THEN** the system SHALL write the payload's intake to the intake store and the payload's settings to settings storage, SHALL replace any existing data for those keys, and SHALL show a success message or state

#### Scenario: UI reflects imported data after import
- **WHEN** import has just completed successfully
- **THEN** the displayed intake and settings (e.g. on the current screen) SHALL reflect the newly imported data

### Requirement: Minimal informative copy
All user-facing text for migrate/import (buttons, labels, messages) SHALL be short and informative. Error messages SHALL clearly indicate what went wrong (e.g. too much data, invalid code, scan failed) without technical jargon.

#### Scenario: Export and import options are clearly labeled
- **WHEN** the user views the migrate/import section in settings
- **THEN** the options for export and import SHALL have concise labels and SHALL include brief explanatory text so the user understands the action (e.g. "Export" / "Show QR to move data to another device" and "Import" / "Scan QR to load data from another device")

#### Scenario: Errors are understandable
- **WHEN** export or import fails (payload too large, invalid code, or scan/read error)
- **THEN** the system SHALL show a short, user-friendly message that explains the problem (e.g. "Too much data for one QR" or "Invalid or damaged code")
