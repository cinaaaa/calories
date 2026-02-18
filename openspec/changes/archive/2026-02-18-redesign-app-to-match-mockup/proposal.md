## Why

The app currently does not match the intended product design. Redesigning the UI to match the provided mockup will align the experience with the target look and feel (mobile-first, clear hierarchy, calorie and weight at a glance) and establish a single source of truth for layout and visuals.

## What Changes

- **Header**: Add a persistent header with app logo (circular orange icon), "Calories" title, and a menu/options button (e.g. 4-dot grid). Remove or replace any existing header that does not match.
- **Main calories block**: Show total calories consumed (large prominent number with "Kcal") and a "Daily allowance" value (e.g. 2267) on the main screen.
- **Weekly calorie chart**: Add a horizontal bar chart for Mon–Sun showing each day’s consumption as a percentage of daily allowance (e.g. 55%, 34%, 110%, …). Use orange bars for actual consumption and a striped or muted bar for target/allowance. Highlight the current day (e.g. Wed).
- **Bottom cards**: Add two card widgets:
  - **Current weight**: Dark card showing current weight (e.g. 90.22 Kg) with a change indicator (e.g. arrow and "-1.2 (-1.68%)").
  - **Calories**: Orange card showing a calorie value (e.g. 1280 Kcal) with a trend indicator (e.g. -8.2%) and optional trend line.
- **Visual design**: Apply mockup styling: light beige background (#F5F4EC or similar), orange as primary accent, dark grey/black for primary text, white text on dark and orange surfaces, rounded corners and consistent typography.
- **Mobile-first layout**: Ensure the layout works in a narrow viewport (e.g. phone frame) with spacing and hierarchy matching the mockup.

No changes to add-entry flow, storage schema, or PWA behavior are required unless needed to support daily allowance or weekly/weight data.

## Capabilities

### New Capabilities

- `mockup-dashboard`: Main-screen UI that matches the provided mockup. Covers header (logo, title, menu), total calories and daily allowance, weekly bar chart (Mon–Sun, % of allowance, current day highlight), and two bottom cards (current weight with change, calories with trend). Includes layout, structure, and visual design (colors, typography, spacing) to align with the mockup.

### Modified Capabilities

- `daily-dashboard`: Require display of a **daily allowance** value alongside today’s totals. Require that the dashboard supplies or consumes data needed for the **weekly calorie chart** (totals or percentages per day for Mon–Sun) so the new chart can be implemented without changing storage semantics beyond what the app already has per day.

## Impact

- **Front-end**: All main-screen markup, components, and styles (SvelteKit pages/components and CSS or design tokens) will change to implement the new layout and visuals. Existing logic for “today’s date”, “today’s totals”, and “list today’s entries” remains; where and how they are rendered will follow the mockup.
- **Data**: If daily allowance or weight/trend are not yet stored, new preferences or storage (e.g. user settings, local state) may be needed; scope is limited to what’s required for the mockup (daily allowance number, weight value and optional change/trend).
- **APIs**: None unless we add a backend later; current impact is UI and local data only.
- **Dependencies**: No new runtime dependencies are implied; optional use of a small charting or CSS-only approach for the weekly bars.
- **PWA / add-entry / intake-storage**: No requirement changes; manifest, service worker, add-entry modal, and storage schema stay as-is unless we explicitly extend them for allowance or weight.
