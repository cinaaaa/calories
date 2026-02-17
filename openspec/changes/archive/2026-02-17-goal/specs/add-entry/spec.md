## ADDED Requirements

### Requirement: Floating Add button
The system SHALL provide a floating Add (+) button visible on the main screen. When the user clicks it, the system SHALL open a minimal modal for adding an entry.

#### Scenario: Open modal on click
- **WHEN** the user clicks the floating Add (+) button
- **THEN** the system SHALL open the add-entry modal

### Requirement: Add-entry form fields
The modal SHALL contain a Calories field (number input, required, value MUST be greater than 0) and a Protein field (number input, optional, value MUST be greater than or equal to 0). The system SHALL validate input before saving.

#### Scenario: Add with valid calories only
- **WHEN** the user enters calories > 0 and leaves protein empty or zero and submits
- **THEN** the system SHALL accept the entry (protein defaulting to 0 if omitted) and SHALL save it for today

#### Scenario: Reject invalid calories
- **WHEN** the user enters calories ≤ 0 or non-numeric and attempts to add
- **THEN** the system SHALL NOT save and SHALL indicate or prevent invalid submission (e.g. validation message or disabled Add)

### Requirement: Add and Cancel actions
The modal SHALL provide an "Add" button and a "Cancel" button. Add SHALL save the entry for today, update the UI (totals and list), close the modal, and persist to storage. Cancel SHALL close the modal without saving.

#### Scenario: Add saves and closes
- **WHEN** the user fills valid values and clicks Add
- **THEN** the system SHALL save the entry for today, SHALL update the displayed totals and list immediately, SHALL close the modal, and SHALL persist the data to local storage

#### Scenario: Cancel closes without saving
- **WHEN** the user clicks Cancel (or equivalent dismiss)
- **THEN** the system SHALL close the modal and SHALL NOT add or persist any entry
