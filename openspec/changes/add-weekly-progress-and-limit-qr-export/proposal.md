## Why

Users need a quick, motivating view of recent eating progress, not just today, so they can understand weekly patterns at a glance. At the same time, QR export can fail or become hard to scan when payloads grow too large, so limiting export to the most recent week improves reliability for device-to-device transfer.

## What Changes

- Add a clean, minimal weekly progress section that highlights the user's last 7 days of calorie intake in a visually clear way.
- Improve the weekly visualization and summary copy to make trend reading easier (total, range, and target context) while keeping the UI lightweight.
- Update export behavior so QR payload includes only the most recent 7 days of intake data (plus required settings), instead of full historical intake.
- Keep import compatibility for supported payload versions and preserve user-friendly feedback if QR payload is still too large.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `daily-dashboard`: Extend dashboard behavior to present a polished, minimal "last week progress" experience with clear weekly context.
- `qr-migrate-import`: Change export payload scope so intake data is limited to the latest 7 days before compression/encoding and QR generation.

## Impact

- Affected specs: `openspec/specs/daily-dashboard/spec.md`, `openspec/specs/qr-migrate-import/spec.md`
- Likely affected code: dashboard UI and weekly chart rendering logic (e.g. `src/routes/+page.svelte` and related styles/components)
- Likely affected export logic: QR payload builder/compression code in migrate/export flow
- User impact: clearer weekly progress insights and more reliable single-QR exports
