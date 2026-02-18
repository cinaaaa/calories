## Requirements

### Requirement: Persistent header with logo, title, and menu
The system SHALL display a persistent header on the main screen containing: an app logo (circular orange icon), the title "Calories", and a menu or options button (e.g. 4-dot grid icon). The header SHALL remain visible when the main dashboard content is in view.

#### Scenario: Header visible on main screen
- **WHEN** the user views the main dashboard
- **THEN** the system SHALL show the header with logo, "Calories" title, and menu button

#### Scenario: Menu button actionable
- **WHEN** the user taps or clicks the menu button
- **THEN** the system SHALL open a menu, modal, or navigation (e.g. Settings or options) and SHALL NOT navigate away from the app

### Requirement: Main calories block with total and daily allowance
The system SHALL display a main block on the dashboard showing the total calories consumed (large prominent number with unit "Kcal") and a "Daily allowance" value (numeric, e.g. 2267). The total SHALL reflect today's intake; the daily allowance SHALL be the user-configured or default value.

#### Scenario: Block shows totals and allowance
- **WHEN** the user views the main screen
- **THEN** the system SHALL display total calories consumed (large) with "Kcal" and SHALL display "Daily allowance:" followed by the allowance value

#### Scenario: Total updates when entries change
- **WHEN** today's entries change (add or remove)
- **THEN** the displayed total calories SHALL update to the new sum

### Requirement: Weekly calorie bar chart (Mon–Sun)
The system SHALL display a horizontal bar chart for the current week with one group per weekday (Mon through Sun). For each day the system SHALL show the consumption as a percentage of daily allowance (e.g. 55%, 110%). The system SHALL use orange bars for actual consumption and a striped or muted bar for the target/allowance. The current day SHALL be visually highlighted (e.g. bolder label or distinct style).

#### Scenario: Chart shows seven days
- **WHEN** the user views the dashboard
- **THEN** the system SHALL display Mon, Tue, Wed, Thu, Fri, Sat, Sun with a bar and percentage for each day

#### Scenario: Current day highlighted
- **WHEN** the chart is rendered
- **THEN** the weekday label (or bar) for the current calendar day SHALL be visually distinct from the other days

#### Scenario: Percentages reflect intake and allowance
- **WHEN** a day has intake and allowance is set
- **THEN** the percentage for that day SHALL equal (total calories for that day / daily allowance) * 100, rounded or truncated as appropriate

### Requirement: Current weight card
The system SHALL display a card (dark background) showing "Current Weight", a weight value with unit "Kg", and an optional change indicator (e.g. arrow and text such as "-1.2 (-1.68%)"). The card MAY include an action (e.g. icon) to edit weight or open settings.

#### Scenario: Weight card visible
- **WHEN** the user views the main screen
- **THEN** the system SHALL show the current weight card with title "Current Weight" and a numeric weight value (or placeholder if not set)

#### Scenario: Change indicator when previous weight exists
- **WHEN** the user has a current weight and a previous weight stored
- **THEN** the system SHALL display the change (absolute and/or percentage) with a downward or upward indicator as appropriate

### Requirement: Calories summary card with trend
The system SHALL display a card (orange background) showing "Calories", a calorie value with "Kcal", and a trend indicator (e.g. percentage change such as "-8.2%"). The card MAY display an optional trend line or sparkline. The value SHALL represent today's total or another defined metric (e.g. today's total).

#### Scenario: Calories card visible
- **WHEN** the user views the main screen
- **THEN** the system SHALL show the orange calories card with title "Calories", a numeric value with "Kcal", and a trend indicator (or placeholder if trend is not available)

#### Scenario: Trend reflects comparison when data available
- **WHEN** trend data is available (e.g. comparison to previous period)
- **THEN** the system SHALL display the trend as a percentage or equivalent (e.g. "-8.2%") with an up/down indicator as appropriate

### Requirement: Mockup-aligned visual design
The system SHALL apply visual styling that matches the provided mockup: light beige background (#F5F4EC or equivalent), orange as the primary accent color, dark grey or black for primary text, white text on dark and orange surfaces, rounded corners for cards and key elements, and consistent typography (sans-serif, clear hierarchy).

#### Scenario: Background and accents
- **WHEN** the user views the main screen
- **THEN** the page background SHALL be light beige and primary accent elements (e.g. logo, orange card, chart bars) SHALL use orange

#### Scenario: Text contrast
- **WHEN** text appears on dark or orange backgrounds
- **THEN** the system SHALL use white or high-contrast light text so content remains readable

### Requirement: Mobile-first layout
The system SHALL lay out the main dashboard for narrow viewports (e.g. phone width) first. Spacing, font sizes, and component order SHALL follow the mockup hierarchy: header, main calories block, weekly chart, then the two bottom cards. The layout SHALL remain usable and readable on small screens without horizontal scroll for core content.

#### Scenario: Layout order on narrow viewport
- **WHEN** the viewport width is narrow (e.g. 390px or less)
- **THEN** the system SHALL show header, then main calories block, then weekly chart, then the two cards in a single column or defined grid matching the mockup

#### Scenario: No horizontal overflow for main content
- **WHEN** the user views the dashboard on a narrow viewport
- **THEN** the main content (header, totals, chart, cards) SHALL NOT require horizontal scrolling to be read or used
