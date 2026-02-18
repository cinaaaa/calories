## Why

Users need a clearer way to remove individual entries instead of a single "reset all data" action, and they need to set a daily protein goal like they already set a calories allowance. Replacing the reset button with an entry-level delete flow reduces accidental full wipes and keeps the UI focused; adding a configurable protein goal makes the protein display meaningful and consistent with allowance.

## What Changes

- **Remove reset button**: The "Reset data" button in the settings modal SHALL be removed.
- **Entries delete flow**: In the "Today's entries" section, the title row SHALL include a small "delete" control (e.g. text link). When the user taps it, each entry SHALL show a delete icon on the right; tapping that icon SHALL remove that entry only. The title-row control SHALL then show "done" so the user can exit delete mode and return to normal view.
- **Settings: remove weight, add protein goal**: The settings modal SHALL no longer ask for or display current weight. Instead, the modal SHALL include a "Protein goal (g)" input (or equivalent), configurable like daily allowance, with a sensible default or placeholder.
- **Display protein goal**: The main screen SHALL display the user's protein goal alongside total protein (e.g. "X / Y grams" where Y is the configured goal), consistent with the existing UI.

## Capabilities

### New Capabilities

- (None.)

### Modified Capabilities

- **daily-dashboard**: Entries list gains a delete mode (title-row "delete" / "done" and per-entry delete icon); display daily protein goal from settings and show total protein vs goal; settings surface removes weight and adds protein goal.

## Impact

- **Main page (`+page.svelte`)**: Entry list section gains delete-mode state, "delete"/"done" in title row, per-entry delete icons and remove-one-entry behavior.
- **Settings modal**: Remove weight field and related props/handlers; add protein goal field; remove "Reset data" button and related handlers.
- **Storage and settings**: Settings schema gains `proteinGoal` (number), loses or deprecates weight-related fields for the UI (storage can retain for migration if needed); default or migration for existing users.
- **Stores**: Settings store exposes setProteinGoal; entries store (or storage) supports removing a single entry by index/identity for a date.
- **CaloriesHero (or equivalent)**: Receives protein goal from settings and displays "total / goal" instead of hardcoded goal.
