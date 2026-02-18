# Proposal: QR migrate/import for local storage

## Why

Users keep their calorie data in local storage only. When they switch or add a device, there is no simple way to move that data. A QR-based migrate/import flow lets one device export data as a QR code and another scan it to import—no accounts, no servers, minimal friction.

## What Changes

- **Settings entry point**: A button in the settings modal to access migrate/import (e.g. “Move data to another device” or “Export / Import data”).
- **Export flow**: User taps export → app reads relevant data from local storage, builds a minimal payload, compresses and encodes it, then shows a QR code that encodes that payload.
- **Import flow**: User taps import → app opens a scanner (or file/camera picker where supported); after a successful scan, app decodes the payload, decompresses, validates, then writes to local storage and gives clear success/error feedback.
- **Payload size**: The payload must be kept as small as possible so a lot of data can fit in a single QR code. Use compression, short key names, no unnecessary whitespace, and strip any redundant or optional fields. Encoding (e.g. base64 or similar) should be chosen to maximize data density in the QR.

## Capabilities

### New Capabilities

- `qr-migrate-import`: Export local storage as a compact, compressed payload shown as a QR code; import by scanning a QR (or equivalent input) and writing decoded data into local storage. Includes payload format, compression/short keys/no spaces, and minimal UI in settings (export/import buttons and clear, minimal copy).

### Modified Capabilities

- (none)

## Payload size (QR-friendly)

To fit as much data as possible in the QR:

- **Compress**: Use a compression step (e.g. gzip/deflate or a lightweight alternative) on the JSON (or equivalent) before encoding.
- **Short keys**: Use a fixed mapping of short keys (e.g. `e` for entries, `d` for date, `c` for calories) instead of long descriptive keys; both sides use the same mapping.
- **No spaces**: Emit JSON (or equivalent) with no spaces or newlines.
- **Strip unnecessary data**: Omit fields that can be recomputed or that are not needed for restore (e.g. internal IDs if not required), and only include the minimal set needed to restore entries and any required app state.
- **Encoding**: Encode the compressed bytes into a QR-friendly string (e.g. base64 or base64url); avoid characters that QR might handle less efficiently if relevant.

Design and specs will define the exact payload schema, key map, and compression/encoding choices.

## Impact

- **Settings UI**: New controls and copy in the existing settings modal; possible new modal/screen for “show QR” and “scan QR” flows.
- **Dependencies**: QR code generation library (e.g. for canvas/svg); optional QR scan library or use of native input (camera/file) plus a decoder; compression available in browser (e.g. Compression Streams or a small lib).
- **Storage**: Reuses current local storage shape; import overwrites or merges according to spec (e.g. replace-all vs merge by date).
- **Code**: New modules for payload build/parse, compress/decompress, encode/decode, and integration in settings + export/import flows.
