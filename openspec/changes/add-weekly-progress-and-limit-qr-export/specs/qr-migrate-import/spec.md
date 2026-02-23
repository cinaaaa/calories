## MODIFIED Requirements

### Requirement: Export produces a single QR code from compressed payload
The system SHALL build an export payload from intake and settings in local storage. The intake portion of that payload SHALL include only the most recent 7 calendar days (today and previous 6 days in local time). The payload SHALL use a compact format (short keys, no unnecessary whitespace, minimal fields). The system SHALL compress the payload (e.g. gzip/deflate) and encode it (e.g. base64url) before rendering it as a QR code. The QR code SHALL be displayed so the user can show it to another device. If the resulting payload exceeds a safe size for a single QR code, the system SHALL NOT render a code and SHALL show a clear message that data is too large to fit in one QR.

#### Scenario: Export with recent data shows QR
- **WHEN** the user starts export and local storage has intake and/or settings
- **THEN** the system SHALL produce a compressed, encoded payload from settings plus only the latest 7 days of intake and SHALL display it as a QR code

#### Scenario: Export excludes older intake history
- **WHEN** the user starts export and intake storage contains data older than the latest 7 days
- **THEN** the system SHALL omit intake dates outside the latest 7-day window from the exported payload

#### Scenario: Export when payload too large
- **WHEN** the user starts export and the encoded payload exceeds the configured maximum size for one QR
- **THEN** the system SHALL NOT display a QR code and SHALL show an informative message (e.g. that there is too much data for one code)

### Requirement: Payload format and version
The export payload SHALL include intake (date-keyed entries limited to the latest 7 days) and settings (daily allowance, current weight, previous weight). The payload SHALL use a version prefix or marker so the importer can reject unknown or invalid formats. The encoded string (after compression and encoding) SHALL be the sole content used to generate the QR code.

#### Scenario: Payload contains limited intake and settings
- **WHEN** export runs with existing intake and settings
- **THEN** the decoded payload SHALL contain settings and at most 7 intake date keys representing the latest 7-day window

#### Scenario: Import rejects invalid or unknown payload
- **WHEN** the user completes import and the scanned or selected content is missing the version marker, malformed, or from an unsupported version
- **THEN** the system SHALL NOT write to local storage and SHALL show a clear error (e.g. invalid or damaged code)
