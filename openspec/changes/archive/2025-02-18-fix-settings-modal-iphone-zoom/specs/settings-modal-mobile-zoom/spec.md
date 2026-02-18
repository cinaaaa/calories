## ADDED Requirements

### Requirement: Settings modal inputs do not cause persistent zoom on mobile
The system SHALL ensure that focusing or editing the inputs (daily allowance, protein goal) in the Settings modal does not cause the viewport to remain zoomed in on mobile browsers (notably iOS Safari) after the user blurs the input or closes the modal. The system MAY prevent zoom on focus or restore the viewport scale on blur/close.

#### Scenario: Focus input on iOS
- **WHEN** the user focuses a number input in the Settings modal on a mobile device (e.g. iPhone Safari)
- **THEN** the system SHALL either prevent the browser from zooming in, or SHALL restore the viewport scale when the input loses focus or the modal is closed

#### Scenario: Close modal after editing
- **WHEN** the user has focused an input in the Settings modal and then closes the modal (Save or Close)
- **THEN** the viewport SHALL not remain zoomed in; the main page SHALL appear at normal scale

#### Scenario: Blur input without closing modal
- **WHEN** the user focuses an input in the Settings modal and then blurs it (e.g. taps outside the input)
- **THEN** the viewport SHALL not remain zoomed in; the modal SHALL remain visible at normal scale
