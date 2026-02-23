## Context

The app currently focuses on daily intake totals and entries, with existing weekly-chart data support in `daily-dashboard` and QR export/import in `qr-migrate-import`. The requested change has two cross-cutting concerns:

1. Present last-week progress in a cleaner, more motivational way on the dashboard.
2. Constrain QR export payload size by exporting only the most recent 7 days of intake data.

Constraints and assumptions:
- Keep existing storage model (date-keyed intake entries) and payload versioning approach.
- Avoid breaking current import behavior for valid payloads.
- Maintain a lightweight UI aligned with current app aesthetics and minimal copy.

## Goals / Non-Goals

**Goals:**
- Show a polished "last week progress" block with easy-to-scan weekly context (e.g., weekly total, target context, and 7-day bars).
- Ensure exported QR payload includes only latest 7 days of intake data plus required settings fields.
- Improve export reliability by reducing payload size while preserving user understanding.
- Keep implementation localized to dashboard rendering/data shaping and export payload construction.

**Non-Goals:**
- Redesign the entire dashboard layout beyond the weekly progress section.
- Change intake storage schema or migrate historical local data.
- Add multi-QR chunking for large payload export in this change.
- Alter import semantics from replace-all behavior.

## Decisions

### 1) Weekly progress uses rolling last 7 days, not fixed Mon-Sun
Decision: Render and summarize a rolling 7-day window ending today (today and previous 6 days).

Rationale:
- Matches user request wording ("last week progress").
- Produces stable behavior regardless of weekday.
- Better aligns with export cutoff rule (same rolling window concept).

Alternatives considered:
- Fixed calendar week (Mon-Sun): familiar but can hide very recent trends at week boundaries.
- User-selectable ranges: flexible but out of scope and adds UI complexity.

### 2) Keep chart structure minimal and emphasize summary metrics
Decision: Use a simple compact bar visualization with restrained colors, rounded bars, minimal axis labels, and a summary row (weekly kcal total and target context).

Rationale:
- Supports "clean and pretty" requirement without introducing a heavy charting redesign.
- Preserves readability on mobile layouts.
- Reuses existing data derivation pipeline where possible.

Alternatives considered:
- Line/area chart: visually rich but can be noisier and harder to read quickly.
- Detailed grid/table: precise but less motivating and less minimal.

### 3) Export payload filters intake dates to most recent 7 days before compression
Decision: During export payload build, derive a filtered intake object containing only dates in the rolling 7-day window (local date), then compress/encode as today.

Rationale:
- Reduces QR payload size at the earliest stage.
- Keeps payload format/versioning intact with smaller data volume.
- Avoids schema changes and preserves import compatibility.

Alternatives considered:
- Trim after compression: no practical benefit and less explicit.
- Export only current day: too restrictive for migration use cases.
- Keep full history and rely on compression: does not reliably solve QR size limits.

### 4) Preserve required settings fields in export
Decision: Keep exporting current settings fields expected by importer (daily allowance, current weight, previous weight), unchanged.

Rationale:
- Maintains compatibility with existing import and data restoration expectations.
- Limits risk of partial state restoration.

Alternatives considered:
- Export fewer settings to shrink payload further: could break user expectations and compatibility.

## Risks / Trade-offs

- [Different interpretation of "last week" (rolling vs calendar)] -> Mitigation: codify rolling 7-day behavior in specs and UI copy.
- [Locale/timezone edge cases near midnight] -> Mitigation: use existing local-date utilities consistently for both chart and export filtering.
- [Payload can still exceed single QR for extreme entry density] -> Mitigation: keep existing "too large" user-facing error path.
- [UI visual regressions in dense/small screens] -> Mitigation: constrain bar count to 7, cap text density, and test common mobile widths.

## Migration Plan

1. Update specs for `daily-dashboard` and `qr-migrate-import` to formalize new behavior.
2. Implement dashboard weekly-progress UI refresh and rolling-window summary computation.
3. Implement export payload date filtering (latest 7 days) before compression.
4. Validate with manual tests:
   - Dashboard displays correct 7-day totals and bars with empty and mixed data.
   - Exported payload decodes to max 7 intake dates.
   - Import still restores exported data and settings correctly.
5. Rollback strategy: revert to previous dashboard component state and remove export filter logic (restoring full-history export path).

## Open Questions

- Should the weekly target context show "sum of daily target for 7 days" or "average vs daily target" as primary copy?
- Should the 7-day labels use localized short weekdays or fixed English abbreviations?
