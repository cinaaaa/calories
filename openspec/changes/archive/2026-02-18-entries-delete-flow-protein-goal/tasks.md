## 1. Storage: protein goal and remove entry

- [x] 1.1 Add `proteinGoal` to Settings type and DEFAULT_SETTINGS in `src/lib/storage.ts`; ensure getSettings() returns it (merge with defaults)
- [x] 1.2 Add `setProteinGoal(value: number)` in storage and use it to persist protein goal
- [x] 1.3 Add `removeEntry(date: string, index: number)` in storage: read entries for date, remove item at index, write back

## 2. Stores: settings and entries

- [x] 2.1 In `src/lib/stores/settings.ts`, add `setProteinGoal(value: number)` that updates storage and store; remove or retain weight-related methods per design (stop exposing if UI no longer uses)
- [x] 2.2 In `src/lib/stores/entries.ts`, add `removeEntry(date: string, index: number)` that calls storage removeEntry and reloads intake

## 3. Settings modal: protein goal, remove weight and reset

- [x] 3.1 Remove current weight input, hint, and related props/handlers (onSaveWeight, onUpdateWeight, currentWeight) from SettingsModal
- [x] 3.2 Add protein goal (g) input to SettingsModal, same pattern as daily allowance (local state, save on blur/close); add props proteinGoal and onSaveProteinGoal
- [x] 3.3 Remove "Reset data" button and reset section; remove onResetData prop and handleClose reference to reset

## 4. Main page: entries delete mode and per-entry delete

- [x] 4.1 Add delete-mode state (e.g. deleteMode) to +page.svelte; in the entries section title row, show a small "delete" link when not in delete mode and "done" when in delete mode; toggling "delete" sets deleteMode true, "done" sets it false
- [x] 4.2 When deleteMode is true, render a delete icon on the right of each entry; on click, call entriesStore.removeEntry(todayKey, index) and keep deleteMode true until user taps "done"
- [x] 4.3 Style the title-row link and per-entry delete icon to match existing UI (muted, small)

## 5. Hero and dashboard: display protein goal

- [x] 5.1 Pass proteinGoal from settings into CaloriesHero; in CaloriesHero, use proteinGoal (or fallback) instead of hardcoded 160 for the "X / Y grams" display
- [x] 5.2 In +page.svelte, pass settings.proteinGoal to CaloriesHero and to SettingsModal; remove onResetData and resetData usage; add onSaveProteinGoal that calls settingsStore.setProteinGoal

## 6. Verification

- [x] 6.1 Manually verify: entries section shows "delete"; tapping it shows delete icons; tapping an icon removes that entry; "done" exits mode; settings show protein goal, no weight or reset; hero shows total protein vs configured goal
