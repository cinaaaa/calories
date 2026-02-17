## Requirements

### Requirement: Show today's date
The system SHALL determine the current calendar date in the user's local timezone and SHALL display or use that date (YYYY-MM-DD) as "today" for loading and displaying entries.

#### Scenario: App opens on a given day
- **WHEN** the user opens the app
- **THEN** the system SHALL detect today's date in local time and SHALL load and display only entries for that date

### Requirement: Display today's totals
The system SHALL display the total calories consumed today and the total protein consumed today, computed as the sum of all entries for today's date.

#### Scenario: Totals with no entries
- **WHEN** today has no entries
- **THEN** the system SHALL display total calories as 0 and total protein as 0

#### Scenario: Totals with entries
- **WHEN** today has one or more entries
- **THEN** the system SHALL display the sum of all entries' calories and the sum of all entries' protein

### Requirement: List today's entries
The system SHALL display a list of all entries added for today. Each entry SHALL be visible (e.g. calories and protein for that entry). The list SHALL reflect the order entries were added or the stored order for that date.

#### Scenario: Empty state
- **WHEN** today has no entries
- **THEN** the system SHALL show an empty state (no entries listed) rather than a list with items

#### Scenario: New day starts empty
- **WHEN** the calendar date changes to a new day (e.g. after midnight)
- **THEN** the system SHALL treat the new date as today and SHALL show empty totals and an empty list until the user adds entries for that day
