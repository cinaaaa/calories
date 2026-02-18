## ADDED Requirements

### Requirement: Entries list delete mode
The system SHALL provide a way to remove individual entries for today. The entries section title row SHALL include a small "delete" control (e.g. text link). When the user activates it, the system SHALL enter a delete mode in which each entry SHALL show a delete icon on the right; activating that icon SHALL remove that entry only. The title-row control SHALL switch to "done" in delete mode; when the user activates "done", the system SHALL exit delete mode and return to the normal view without removing further entries.

#### Scenario: Enter delete mode
- **WHEN** the user taps the "delete" control in the entries title row
- **THEN** the system SHALL show a delete icon on the right of each entry and SHALL change the title-row control to "done"

#### Scenario: Remove one entry
- **WHEN** the user is in delete mode and taps the delete icon for an entry
- **THEN** the system SHALL remove that entry from today's list and SHALL persist the change; the list SHALL update immediately

#### Scenario: Exit delete mode
- **WHEN** the user taps "done" in the entries title row
- **THEN** the system SHALL exit delete mode, hide per-entry delete icons, and SHALL show the title-row control as "delete" again

### Requirement: Display daily protein goal
The system SHALL display a daily protein goal value (in grams) alongside today's total protein on the main screen. The value SHALL be configurable by the user (e.g. via settings). If not set, the system MAY display a default or a placeholder so the layout is never broken.

#### Scenario: Protein goal set
- **WHEN** the user has set a daily protein goal
- **THEN** the system SHALL display that value on the main screen with today's total protein (e.g. "X / Y grams" where Y is the goal)

#### Scenario: Protein goal not set
- **WHEN** the user has not set a daily protein goal
- **THEN** the system SHALL display a default value or a clear placeholder so the layout remains consistent

### Requirement: Settings protein goal
The system SHALL allow the user to set a daily protein goal (in grams) in settings, in the same way as the daily allowance. The settings surface SHALL NOT include current weight. The settings surface SHALL NOT include a "Reset data" or global reset button.

#### Scenario: Set protein goal in settings
- **WHEN** the user opens settings and enters or changes the protein goal (g) and closes or saves
- **THEN** the system SHALL persist the value and SHALL display it as the daily protein goal on the main screen

#### Scenario: Settings without weight or reset
- **WHEN** the user opens the settings modal
- **THEN** the system SHALL show daily allowance and protein goal inputs and SHALL NOT show a current weight input or a Reset data button

## MODIFIED Requirements

### Requirement: List today's entries
The system SHALL display a list of all entries added for today. Each entry SHALL be visible (e.g. calories and protein for that entry). The list SHALL reflect the order entries were added or the stored order for that date. The system SHALL support removing a single entry via the entries list delete mode.

#### Scenario: Empty state
- **WHEN** today has no entries
- **THEN** the system SHALL show an empty state (no entries listed) rather than a list with items

#### Scenario: New day starts empty
- **WHEN** the calendar date changes to a new day (e.g. after midnight)
- **THEN** the system SHALL treat the new date as today and SHALL show empty totals and an empty list until the user adds entries for that day

#### Scenario: Entry removed in delete mode
- **WHEN** the user removes an entry via the delete icon in delete mode
- **THEN** the system SHALL remove that entry from storage for that date and SHALL refresh the list and totals so the entry no longer appears
