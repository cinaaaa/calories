# Design: QR migrate/import

## Context

The app stores calorie intake in `localStorage` under `calories-intake` (date → array of `{ calories, protein }`) and settings under `calories-settings` (`dailyAllowance`, `currentWeight`, `previousWeight`). There is no sync or backup; data is device-local. Users need a simple way to move this data to another device without accounts or servers. QR codes are a natural fit: one device shows a code, the other scans it. QR capacity is limited (hundreds to low thousands of bytes in typical usage), so the payload must be compressed and minimal.

## Goals / Non-Goals

**Goals:**

- Export current intake + settings into a single, minimal payload and display it as a QR code.
- Import by scanning a QR (or equivalent input) and writing decoded data into local storage (intake + settings).
- Maximize payload density (compress, short keys, no whitespace, strip unnecessary fields) so more data fits in one QR.
- Expose export and import from the settings modal with minimal, informative copy.

**Non-Goals:**

- Cloud sync, multi-device live sync, or version history.
- Encrypted or password-protected payloads (payload is best-effort private via local transfer only).
- Supporting multiple QR codes for chunked transfer (single QR only; if data doesn’t fit, show a clear message).

## Decisions

### 1. Payload contents and shape

- **Decision:** Export both intake store and settings. Use a single JSON object with short, fixed keys, then compress and encode.
- **Rationale:** Users expect “move my data” to include goals/settings as well as entries. One payload keeps the flow simple.
- **Alternatives:** Export only intake (simpler but incomplete); separate QRs for intake vs settings (worse UX).

### 2. Short key mapping (for maximum density)

- **Decision:** Use a fixed, minimal schema. Top-level: `i` = intake, `s` = settings. Intake: object with date keys (YYYY-MM-DD) unchanged (already short), values = array of `[calories, protein]` tuples (numbers only). Settings: `a` = dailyAllowance, `c` = currentWeight, `p` = previousWeight.
- **Rationale:** Dropping key names inside entries saves many bytes per entry; date format is standard and compact. Top-level short keys keep the wrapper small.
- **Alternatives:** Full key names (larger); binary format (smaller but harder to debug and version).

### 3. Compression and encoding

- **Decision:** Compress the JSON string with gzip/deflate (e.g. via a small library like `pako` or browser `CompressionStream` if available), then encode the result as base64url (no padding, URL-safe so QR is robust).
- **Rationale:** Deflate gives strong size reduction on repetitive JSON; base64url is QR-friendly and widely supported. Single encoding path keeps implementation simple.
- **Alternatives:** No compression (payload too large for many entries); LZ-string or other (possible but gzip is standard and well-supported).

### 4. QR generation and scanning

- **Decision:** Use a small QR code generation library (e.g. `qrcode` or similar) to render the payload string to canvas/SVG. For import, use a scanner library that can use device camera or a file input (image) when camera is unavailable.
- **Rationale:** Pure client-side, no backend. Camera + file fallback improves support on desktop and restricted environments.
- **Alternatives:** Data URL / download-only (no scan path); native-only camera (fails on desktop).

### 5. Import policy (overwrite vs merge)

- **Decision:** On import, overwrite intake and settings entirely with the payload contents (replace-all). No merge by date.
- **Rationale:** “Move data to this device” is clearer as “this device now has exactly what was exported.” Merge semantics are harder to explain and can produce duplicates.
- **Alternatives:** Merge by date (complexity and duplicate risk); prompt user (adds friction; we can add later if needed).

### 6. Version and validation

- **Decision:** Prepend a short version prefix to the payload (e.g. `v1:` or a single-byte version) before compression. On import, check version and structure; reject invalid or unknown version with a clear message.
- **Rationale:** Allows future schema changes without breaking old exports. Validation avoids corrupting storage with bad data.
- **Alternatives:** No version (hard to evolve); checksum only (no schema evolution).

## Risks / Trade-offs

- **[QR size limit]** → Use compression and short keys; if payload still exceeds a safe QR size (e.g. ~2KB effective), show an error with a short message (“Too much data for one QR”) and avoid generating an unreadable code.
- **[Camera / file access]** → Prefer camera when available; fall back to “choose image file” for import so desktop and locked-down environments still work.
- **[Corrupt or tampered payload]** → Validate structure and version after decode; on failure show “Invalid or damaged code” and do not write to storage.
- **[Re-export overwrites previous export]** → Acceptable; each export is a fresh snapshot. No need to “revoke” a QR.

## Migration Plan

- Add new dependencies (QR generation, optional QR scan, compression lib) via package manager.
- Implement payload build/parse and compress/decompress in a dedicated module; add export (show QR) and import (scan then write) flows behind settings buttons.
- No data migration for existing users; feature is additive. No rollback beyond removing the UI and code (existing storage unchanged).

## Open Questions

- Exact QR size threshold (e.g. 1500 bytes) and copy for “too much data” to be confirmed during implementation.
- Whether to include a simple magic header (e.g. `CQR1`) in the encoded string so scanners can ignore non-app QR content (optional polish).
