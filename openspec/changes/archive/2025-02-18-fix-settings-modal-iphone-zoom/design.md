## Context

The app uses a standard viewport meta (`width=device-width, initial-scale=1`) and does not restrict user scaling. The Settings modal (`SettingsModal.svelte`) contains two number inputs (daily allowance, protein goal). On iOS Safari, inputs with a computed font-size below 16px trigger an automatic zoom when focused; the zoom often persists after blur or closing the modal. The modal inputs inherit from `.field-input` and may be smaller than 16px on small viewports.

## Goals / Non-Goals

**Goals:**
- Prevent or eliminate persistent zoom when using Settings modal inputs on iOS (and similar mobile browsers).
- Keep implementation minimal: no new dependencies, no global viewport hacks that affect accessibility (e.g. disabling pinch-zoom site-wide).

**Non-Goals:**
- Changing zoom behavior in other modals (Add Entry, Import/Export) in this change; can be addressed later with the same pattern if desired.
- Changing viewport meta globally (e.g. `maximum-scale=1`) to avoid harming accessibility.

## Decisions

**1. Use font-size ≥ 16px on Settings modal inputs**

- **Choice:** Ensure the number inputs in the Settings modal have a computed font-size of at least 16px (e.g. via a class or scoped style in `SettingsModal.svelte`).
- **Rationale:** iOS Safari (and some other mobile browsers) do not auto-zoom when the focused input’s font-size is 16px or larger. This is a well-known, zero-JS approach that preserves user pinch-zoom and does not require viewport or meta changes.
- **Alternatives considered:**
  - Setting `maximum-scale=1` on the viewport meta: Rejected because it disables user pinch-zoom and harms accessibility.
  - Dynamically changing viewport meta or scale on focus/blur: Rejected as more fragile and JS-dependent when a simple CSS rule suffices.

**2. Scope the fix to Settings modal only**

- **Choice:** Apply the minimum font-size only to the inputs inside the Settings modal (e.g. `.modal .field-input` or a dedicated class within the component).
- **Rationale:** Matches the spec scope; other modals can adopt the same pattern in a follow-up if needed.

## Risks / Trade-offs

- **Risk:** Inputs may look slightly larger on very small screens. **Mitigation:** 16px is a common minimum for body/input text; visual impact is small and improves readability.
- **Trade-off:** Other modals (Add Entry, etc.) are unchanged; if they exhibit the same zoom issue, the same approach can be applied there in a separate change.

## Migration Plan

- No data or API changes. Deploy as a normal front-end release. No rollback beyond reverting the commit.

## Open Questions

- None. Pattern is established; extending to other modals is optional and can be done when needed.
