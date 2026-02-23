## 1. Weekly progress UI

- [x] 1.1 Implement rolling last-7-days calorie data derivation for the dashboard (today + previous 6 days)
- [x] 1.2 Update the weekly progress section UI to a clean, minimal card with weekly total and target context
- [x] 1.3 Ensure the weekly visualization handles empty days and no-data windows gracefully

## 2. QR export scope

- [x] 2.1 Update export payload builder to include only latest 7 days of intake data before compression/encoding
- [x] 2.2 Preserve existing settings fields and payload version marker in exported data
- [x] 2.3 Verify export failure messaging still appears when single-QR payload is too large

## 3. Validation

- [x] 3.1 Add or update tests for rolling weekly data shaping and last-7-days export filtering
- [x] 3.2 Run project checks/tests and fix any regressions introduced by this change
