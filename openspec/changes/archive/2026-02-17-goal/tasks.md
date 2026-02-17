## 1. Project setup

- [x] 1.1 Create index.html as single entry point with minimal structure and script/style links
- [x] 1.2 Add main CSS file with mobile-first, minimal layout and variables
- [x] 1.3 Add main JS file and ensure app runs when served via local server

## 2. Intake storage

- [x] 2.1 Implement getTodayKey() returning YYYY-MM-DD from local date
- [x] 2.2 Implement storage read: getEntries(dateKey) returning array of { calories, protein } or []
- [x] 2.3 Implement storage write: appendEntry(dateKey, entry) persisting to localStorage under a single store key
- [x] 2.4 Use consistent storage schema (object keyed by date, each value an array of entries)

## 3. Daily dashboard

- [x] 3.1 On load, get today's date key and load today's entries from storage
- [x] 3.2 Compute and display total calories and total protein for today
- [x] 3.3 Render list of today's entries (calories and protein per entry)
- [x] 3.4 Show empty state when today has no entries (no list items, 0 totals)

## 4. Add entry

- [x] 4.1 Add floating Add (+) button that opens the add-entry modal
- [x] 4.2 Add modal markup (hidden by default) with Calories (number, required) and Protein (number, optional) inputs and Add / Cancel buttons
- [x] 4.3 Validate: calories required and > 0; protein optional and >= 0; prevent submit when invalid
- [x] 4.4 On Add: save entry for today via storage, update dashboard (totals and list), close modal, clear form
- [x] 4.5 On Cancel: close modal without saving and without persisting

## 5. PWA and offline

- [x] 5.1 Add manifest.json with name, start_url, display, and icons so app is installable
- [x] 5.2 Register service worker that caches HTML, JS, CSS, and manifest (cache-first)
- [x] 5.3 Verify app loads and works offline after first successful load (add entry, view totals)
