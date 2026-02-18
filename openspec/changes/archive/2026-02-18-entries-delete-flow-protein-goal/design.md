## Context

The app is a SvelteKit PWA with a main dashboard (+page.svelte) showing today's entries, totals, daily allowance, and a hardcoded protein display (e.g. totalProtein/160). Entries are stored per date via `$lib/storage` (getIntake, addEntry, getEntries); there is no removeEntry. Settings (SettingsModal) include daily allowance and current weight; a "Reset data" button clears all intake and settings. The entries list is a simple `<ul>` of items with no delete affordance. Styling uses CSS variables in layout.css and component-scoped styles; the goal is to keep the UI clean and consistent.

## Goals / Non-Goals

**Goals:**

- Replace the global "Reset data" button with an entry-level delete flow: small "delete" in the entries title row, optional delete mode showing per-entry delete icons, "done" to exit.
- Remove weight from the settings UI and add a configurable protein goal (persisted like daily allowance).
- Display protein goal on the main screen (e.g. hero or totals) as total protein vs goal.
- Support removing a single entry for today from storage and UI.

**Non-Goals:**

- Changing the entry data model or date-keyed storage schema.
- Adding undo for deleted entries or bulk delete (only one-by-one in delete mode).
- Keeping weight in storage for other features (we can leave it in storage but not expose it in UI if needed for migration/export).

## Decisions

### 1. Delete mode: local UI state on the main page

- **Choice:** Hold a boolean (e.g. `deleteMode`) in +page.svelte. The entries section title row shows "delete" when false and "done" when true. Clicking "delete" sets deleteMode true; each entry renders a delete icon that calls a remove handler; clicking "done" sets deleteMode false. No URL or global store for delete mode.
- **Rationale:** Simple, no new routes or stores; matches "small text in title row" and "state resets back to normal" with "done".
- **Alternatives:** Context or a store would work but add indirection for a single-page, single-section concern.

### 2. Removing one entry: storage and store API

- **Choice:** Add `removeEntry(date: string, index: number)` in `$lib/storage.ts`: read intake for date, splice out the index, write back. Add `removeEntry` on the entries store that calls storage and then `set(getIntake())`. The main page passes todayKey and entry index (from each block) to the remove handler.
- **Rationale:** Minimal API; entries are ordered by array index, so index is a stable identifier for "this row". No need for unique IDs on entries.
- **Alternatives:** Entry IDs would allow stable identity across reorders but add schema and migration; index is sufficient for "delete this row" in order.

### 3. Settings: protein goal in same shape as daily allowance

- **Choice:** Extend Settings type with `proteinGoal: number` (e.g. default 160). In storage, add setProteinGoal (and optionally getSettings already returns it). Settings modal: remove the weight label/input and hint; add "Protein goal (g)" number input, same pattern as daily allowance (bind local state, save on blur or on close). Remove Reset data button and onResetData prop/handler from modal and +page.
- **Rationale:** Mirrors daily allowance for consistency; one new field and one removal in UI.
- **Alternatives:** Keeping weight in storage but not in UI would allow future use or export; we can leave storage schema with weight fields and only stop reading/writing them from the modal to simplify migration/export.

### 4. Displaying protein goal: hero or totals

- **Choice:** CaloriesHero already shows "Protein: totalProtein/160 grams". Pass `proteinGoal` from settings into CaloriesHero and use it instead of 160. If proteinGoal is missing or zero, show a sensible fallback (e.g. "—" or same default 160 for display only).
- **Rationale:** Single place for "total vs goal"; no new component.

### 5. UI copy and styling for delete/done and delete icon

- **Choice:** Title row: "Today's entries" with a small text link "delete" on the right (or inline); in delete mode, that link becomes "done". Entry row: in delete mode only, show a small trash/delete icon on the right; clicking it removes that entry and updates the list. Use existing typography and color tokens (e.g. muted link style) so it stays clean and consistent.
- **Rationale:** Matches user request; minimal visual weight.

## Risks / Trade-offs

- **Risk:** User might expect "delete" to mean "delete all entries for today".  
  **Mitigation:** Copy is "delete" next to the section; per-entry icons make it clear deletion is per item. "done" exits mode without deleting more.

- **Trade-off:** Removing the reset button removes the ability to wipe all data from the UI.  
  **Acceptable:** Per-entry delete covers the main use case; full reset can be reintroduced later (e.g. in a "danger zone" in settings) if needed.

- **Migration:** Existing users have no proteinGoal in settings.  
  **Mitigation:** Default proteinGoal in DEFAULT_SETTINGS (e.g. 160); getSettings() returns it; existing localStorage will need to be merged with defaults (already the pattern for getSettings).

## Migration Plan

- **Code:** Add proteinGoal to Settings type and DEFAULT_SETTINGS; add setProteinGoal in storage and settings store; ensure getSettings() merges defaults so old saved settings get proteinGoal. No migration script needed if we merge on read.
- **Deploy:** Deploy updated components and storage; remove reset button and weight from modal; add delete flow and protein goal UI. No data wipe.
- **Rollback:** Revert code; old clients may have saved proteinGoal; that is harmless for older code that ignores it.

## Open Questions

- None. Optional: keep currentWeight/previousWeight in storage (and in Settings type) for export/import compatibility and only remove from UI; then no change to setSettings/getSettings shape beyond adding proteinGoal.
