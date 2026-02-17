## ADDED Requirements

### Requirement: Display daily allowance
The system SHALL display a daily allowance value (in Kcal) alongside today's totals on the main screen. The value SHALL be configurable by the user (e.g. via settings). If not set, the system MAY display a default or a placeholder so the layout is never broken.

#### Scenario: Allowance set
- **WHEN** the user has set a daily allowance
- **THEN** the system SHALL display that value on the main screen next to or below the total calories for today

#### Scenario: Allowance not set
- **WHEN** the user has not set a daily allowance
- **THEN** the system SHALL display a default value or a clear placeholder (e.g. "Set allowance" or a sensible default number) so the layout remains consistent

### Requirement: Supply data for weekly calorie chart
The system SHALL supply or consume data sufficient to render a weekly calorie chart for the current week (Mon–Sun): for each day, the total calories consumed that day and the daily allowance (or a percentage of allowance). Data SHALL be derived from existing intake storage (entries keyed by date) and the configured daily allowance; no change to the storage schema for entries is required.

#### Scenario: Chart has data for each day
- **WHEN** the app renders the weekly chart
- **THEN** the system SHALL provide for each of Mon–Sun (of the current week) the total calories for that day and the percentage of daily allowance (or equivalent) so the chart can display bars and labels

#### Scenario: Day with no entries
- **WHEN** a day in the week has no entries
- **THEN** the system SHALL report 0 calories for that day and SHALL display 0% (or equivalent) for the chart
