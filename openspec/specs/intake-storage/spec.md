## Requirements

### Requirement: Persist entries by calendar date
The system SHALL store intake entries in local storage (e.g. localStorage or IndexedDB), keyed by calendar date in YYYY-MM-DD format. Each date key SHALL map to an array of entry objects. Each entry SHALL have numeric fields `calories` and `protein`. Data SHALL persist across reloads and browser restarts.

#### Scenario: Read entries for a date
- **WHEN** the app requests entries for a given date (e.g. 2026-02-17)
- **THEN** the system SHALL return the array of entries for that date, or an empty array if none exist

#### Scenario: Write entry for a date
- **WHEN** the app saves a new entry `{ calories, protein }` for a given date
- **THEN** the system SHALL append that entry to the array for that date in storage and persist immediately

#### Scenario: New date has no entries
- **WHEN** the app requests entries for a date that has never been written
- **THEN** the system SHALL return an empty array

### Requirement: Storage schema
The system SHALL use a single top-level structure keyed by date. Example: `{ "2026-02-17": [ { "calories": 450, "protein": 32 }, { "calories": 300, "protein": 0 } ] }`. The system SHALL support read and write for any valid YYYY-MM-DD date (current or past).

#### Scenario: Multiple dates stored
- **WHEN** entries have been saved for more than one date
- **THEN** the system SHALL retain all dates and their arrays independently; reading one date SHALL NOT affect another
