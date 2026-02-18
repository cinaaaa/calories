## 1. Design tokens and global styles

- [x] 1.1 Add CSS custom properties for mockup (background #F5F4EC, orange accent, dark text, white on dark/orange, card colors, border-radius, typography)
- [x] 1.2 Apply global layout and mobile-first base styles to the main screen container

## 2. Settings storage for allowance and weight

- [x] 2.1 Implement localStorage read/write for daily allowance and current weight (and optional previous weight) using a dedicated key or module
- [x] 2.2 Expose allowance and weight via a store or shared module for dashboard and settings UI

## 3. Header component

- [x] 3.1 Create header component with circular orange logo, "Calories" title, and 4-dot menu button
- [x] 3.2 Wire menu button to open a menu or modal (e.g. Settings / options)

## 4. Main calories block

- [x] 4.1 Add hero block showing total calories consumed (large) with "Kcal" and "Daily allowance:" with value
- [x] 4.2 Wire total to today's entries sum and allowance to settings; ensure total updates when entries change

## 5. Weekly calorie chart

- [x] 5.1 Compute weekly data: for current week (Mon–Sun), sum calories per day from intake and percentage vs daily allowance
- [x] 5.2 Implement weekly chart component (SVG or CSS bars): orange bars for actual, striped/muted bar for target, day labels and percentages
- [x] 5.3 Highlight current day (e.g. bolder label or distinct style) in the chart

## 6. Bottom cards

- [x] 6.1 Create current weight card (dark background): "Current Weight" title, weight value with "Kg", optional change indicator (arrow and % when previous weight exists)
- [x] 6.2 Create calories card (orange background): "Calories" title, value with "Kcal", trend indicator; wire value to today's total
- [x] 6.3 Place both cards in dashboard layout (single column or grid) for narrow viewport

## 7. Settings and weight/allowance editing

- [x] 7.1 Add settings view or modal to edit daily allowance and current weight (reachable from menu)
- [x] 7.2 On weight update, support storing previous weight so weight card can show change %

## 8. Dashboard layout and integration

- [x] 8.1 Compose main dashboard page: header, main calories block, weekly chart, two cards; mobile-first order and spacing per mockup
- [x] 8.2 Resolve entry list placement (below cards or separate view) and ensure add-entry flow and today's list still work
- [x] 8.3 Verify no horizontal overflow on narrow viewport and text contrast on dark and orange surfaces
