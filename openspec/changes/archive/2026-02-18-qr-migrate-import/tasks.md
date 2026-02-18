## 1. Dependencies and module structure

- [x] 1.1 Add QR code generation library (e.g. qrcode) and compression library (e.g. pako) to package.json
- [x] 1.2 Add QR code scanning library (camera and/or image file decode) to package.json
- [x] 1.3 Create a dedicated module (e.g. src/lib/migrate.ts or migrate/) for payload build/parse and compress/encode

## 2. Payload format and encoding

- [x] 2.1 Implement build of compact export payload: intake as date → array of [calories, protein] tuples, settings as a/c/p short keys, version prefix (e.g. v1:)
- [x] 2.2 Implement compress (gzip/deflate) and base64url encode of payload string; define max payload size constant for QR (e.g. 1500–2000 bytes)
- [x] 2.3 Implement decode (base64url), decompress, and parse of payload; validate version and structure (i, s, valid intake and settings shape)
- [x] 2.4 Export functions: buildAndEncodePayload() returning encoded string or null if too large, and parseEncodedPayload(encoded) returning parsed data or throwing on invalid

## 3. Export flow (show QR)

- [x] 3.1 Create export UI component or modal: call buildAndEncodePayload() from current storage; if too large show clear message (e.g. "Too much data for one QR")
- [x] 3.2 When payload is valid, render QR code from encoded string using QR library (canvas or SVG) and display in modal/screen
- [x] 3.3 Add close/done action to dismiss export view

## 4. Import flow (scan and apply)

- [x] 4.1 Create import UI: offer camera scan when available and fallback to "Choose image file" for QR image
- [x] 4.2 On successful QR read (from camera or file), extract raw string and call parseEncodedPayload(); on parse/validation failure show user-friendly error (e.g. "Invalid or damaged code")
- [x] 4.3 On valid payload: overwrite intake store and settings in localStorage (setIntake, setSettings), then show success message and close import view
- [x] 4.4 Ensure app UI (e.g. current page) reflects imported data after successful import (e.g. trigger store updates or navigation refresh)

## 5. Settings entry point and copy

- [x] 5.1 Add "Move data to another device" or "Export / Import data" section in the settings modal with two actions: Export (opens export flow) and Import (opens import flow)
- [x] 5.2 Use minimal informative labels and one-line explanations (e.g. "Export — Show QR to move data to another device", "Import — Scan QR to load data from another device")
- [x] 5.3 Wire Export button to open export modal/screen and Import button to open import (camera or file picker) flow
