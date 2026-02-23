## ADDED Requirements

### Requirement: Display last-7-days progress summary
The system SHALL display a dedicated weekly progress section on the main dashboard that summarizes the user's calorie intake for the most recent 7 days (today and previous 6 days). The section SHALL use concise, minimal copy and SHALL include a weekly total value and target context so users can quickly understand their recent progress.

#### Scenario: Weekly progress section is rendered
- **WHEN** the dashboard is displayed
- **THEN** the system SHALL render a weekly progress section showing the most recent 7 days, a weekly calories total, and target context

#### Scenario: Weekly progress with no intake in window
- **WHEN** the dashboard is displayed and all 7 days have no entries
- **THEN** the system SHALL display zero totals and an empty-state equivalent visualization without breaking layout

## MODIFIED Requirements

### Requirement: Supply data for weekly calorie chart
The system SHALL supply or consume data sufficient to render a weekly calorie chart for the most recent 7 days (rolling window ending today): for each day in that 7-day window, the total calories consumed that day and the corresponding daily allowance context needed for chart and summary display. Data SHALL be derived from existing intake storage (entries keyed by date) and the configured daily allowance; no change to the storage schema for entries is required.

#### Scenario: Chart has data for each day in rolling window
- **WHEN** the app renders the weekly chart
- **THEN** the system SHALL provide for each of the most recent 7 dates the total calories for that date and allowance context so the chart can display bars and labels

#### Scenario: Day with no entries in rolling window
- **WHEN** a date in the rolling 7-day window has no entries
- **THEN** the system SHALL report 0 calories for that date and SHALL provide zero-equivalent chart values
