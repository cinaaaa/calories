## Context

The Calories app is a SvelteKit PWA that tracks daily calorie and protein intake. Entries are stored per date in local storage; the main screen shows today's date, today's totals, and a list of today's entries. A floating Add button opens a modal to add entries. The app has no backend; all data is local. The redesign aligns the main screen with a provided mockup: header (logo, title, menu), prominent total calories and daily allowance, a weekly bar chart (Mon–Sun), and two bottom cards (current weight, calories with trend). Existing behavior (today's date, totals, entry list, add-entry flow, storage schema) remains; only layout, structure, and visuals change to match the mockup.

## Goals / Non-Goals

**Goals:**

- Implement the main-screen layout and structure from the mockup: header, main calories block, weekly chart, two bottom cards.
- Apply mockup visual design: light beige background (#F5F4EC or similar), orange accent, dark text, white on dark/orange, rounded corners, consistent typography.
- Ensure mobile-first layout and hierarchy; support narrow viewports.
- Source today's total from existing intake data; support daily allowance and weekly aggregates for the chart from existing or minimal new data.
- Support current weight and optional change/trend for the weight card; support calorie trend for the calories card, using minimal local state or storage as needed.

**Non-Goals:**

- No backend or new APIs in this change.
- No change to add-entry modal flow, validation, or storage schema for entries (unless we add a single key for daily allowance or weight).
- No full weight-history or calorie-history feature; only what is needed to render the two cards and the weekly chart from existing or minimal new data.

## Decisions

### 1. Daily allowance and weight storage

- **Decision:** Store daily allowance and current weight (and optionally previous weight for % change) in `localStorage` under a small, dedicated key (e.g. `calories-settings` or separate keys like `dailyAllowance`, `currentWeight`, `previousWeight`). No new backend or IndexedDB schema.
- **Rationale:** Mockup requires a visible daily allowance and weight; the app currently has neither. Minimal scope is one-off user-configurable values that persist across reloads. localStorage is already used for entries; reusing it keeps the stack simple.
- **Alternatives considered:** Hardcoded allowance/weight (rejected: not configurable); IndexedDB (rejected: overkill for two numbers); in-memory only (rejected: loss on reload).

### 2. Weekly chart data source and rendering

- **Decision:** Compute weekly data from existing intake storage: for each day in the current week (Mon–Sun), sum calories for that date, divide by daily allowance to get percentage. Render the chart with CSS or lightweight SVG (e.g. one `<svg>` with `<rect>`s or div-based bars). No charting library dependency.
- **Rationale:** Intake is already keyed by date; we only need to read the last 7 days (or the week containing today) and aggregate. CSS/SVG keeps bundle size small and matches the mockup’s simple bar style.
- **Alternatives considered:** Third-party chart library (rejected: extra dependency for a simple bar chart); canvas (rejected: SVG/CSS sufficient and easier to style).

### 3. Component and page structure

- **Decision:** Implement the main screen as the existing root page (or single dashboard route) with distinct UI regions: a header component, a “hero” block for total calories and daily allowance, a weekly-chart component, and two card components (weight card, calories card). Reuse or adapt existing logic that loads today’s date and today’s entries for totals; add small modules or stores for allowance, weight, and weekly aggregates.
- **Rationale:** Clear separation makes the mockup structure obvious in code and keeps responsibilities testable. No new routes required unless we later split settings or weight history.
- **Alternatives considered:** Single monolithic page (rejected: harder to maintain); separate routes for chart vs dashboard (rejected: mockup is one screen).

### 4. Design tokens and styling approach

- **Decision:** Define a small set of CSS custom properties (or a single global styles file) for mockup colors and typography: background (e.g. `#F5F4EC`), primary accent (orange), primary text (dark grey/black), inverse text (white), card backgrounds (dark, orange), border-radius, font sizes/weights. Use these in component-scoped or global CSS; no design-system library.
- **Rationale:** Single source of truth for colors and spacing; easy to tweak to match the mockup pixel-perfect later.
- **Alternatives considered:** Tailwind or similar (rejected: not required for current scope); hardcoded hex in every component (rejected: harder to keep consistent).

### 5. Menu button and weight/allowance editing

- **Decision:** Implement the header menu button as a placeholder that opens a simple menu or modal (e.g. “Settings” / “About”); in Settings (or inline on the dashboard), allow editing daily allowance and current weight so the chart and cards can show real values. Previous weight can be set when user updates weight (e.g. “Save and set as previous”) to compute change %.
- **Rationale:** Mockup shows the button but not its behavior; minimal viable behavior is “opens menu” and a path to configure allowance and weight. Full weight history can be a later change.
- **Alternatives considered:** Menu does nothing (rejected: poor UX); full weight log (deferred to non-goals).

## Risks / Trade-offs

- **[Risk] Weekly chart shows “0%” or empty if no allowance set** → Mitigation: Default daily allowance to a sensible value (e.g. 2000) or show a short hint (“Set daily allowance in Settings”) and still render bars from intake so the chart is never broken.
- **[Risk] Weight card shows placeholder until user sets weight** → Mitigation: Show “—” or “Set weight” and make the card clickable to open settings or a small edit flow.
- **[Risk] Layout or typography drift from mockup on different devices** → Mitigation: Use relative units and the same design tokens; test on a narrow viewport (e.g. 390px width) and adjust breakpoints if we add a wider layout later.
- **[Trade-off] No server sync** → Acceptable: proposal and specs are local-only; sync can be a future change.

## Migration Plan

- **Deploy:** Ship the redesigned front-end as the next release. No backend or API changes.
- **Data:** If we introduce `dailyAllowance` / `currentWeight` (and optional `previousWeight`) in localStorage, existing users get default or empty values on first load; no migration script needed. Entry storage format is unchanged.
- **Rollback:** Revert to the previous build; no data migration to undo.

## Open Questions

- Whether the entry list from the current daily-dashboard spec remains on the same screen (e.g. below the cards or behind a tab) or moves to a separate view; the mockup does not show the list. Resolve during implementation: either add a compact list/section below the cards or keep it on a second screen/tab so the main view matches the mockup exactly.
- Whether “Calories” on the orange card is “today’s total” or a different metric (e.g. average); assumption for implementation: today’s total unless the spec says otherwise.
