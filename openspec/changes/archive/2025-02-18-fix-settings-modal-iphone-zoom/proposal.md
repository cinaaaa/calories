## Why

On iPhone, focusing the number inputs in the Settings modal causes Safari to zoom in (due to default font-size behavior) and the viewport does not zoom back out when the user dismisses the modal or blurs the field. This degrades usability and makes the app feel broken on iOS.

## What Changes

- Prevent or mitigate unwanted viewport zoom when the user focuses inputs inside the Settings modal on iOS.
- Ensure the viewport does not remain zoomed after the user leaves the inputs (blur) or closes the modal.

## Capabilities

### New Capabilities

- `settings-modal-mobile-zoom`: Inputs in the Settings modal must not cause persistent or disruptive viewport zoom on mobile (notably iOS Safari). Acceptable approaches include preventing zoom on focus or restoring scale on blur/close.

### Modified Capabilities

- (none)

## Impact

- **Affected code**: `src/lib/components/SettingsModal.svelte` (and possibly shared layout or app shell if viewport/meta is adjusted globally).
- **APIs**: None.
- **Dependencies**: None (solution should use standard HTML/CSS or minimal JS).
- **Systems**: Mobile web / PWA experience on iOS; desktop and Android unchanged.
