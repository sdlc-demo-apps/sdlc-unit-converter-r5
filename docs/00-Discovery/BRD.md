# Business Requirements (Lite BRD): Unit Converter

## Executive summary

Unit Converter is a small proof of concept (POC) web app for an internal demo. A user enters a length, picks a "From" unit and a "To" unit, and clicks Convert (or presses Enter) to see the result with its unit, for example `30.48 cm`. The app supports five length units: foot (ft), inch (in), centimetre (cm), metre (m) and kilometre (km). That gives 20 unit pairs, all converted through a single metre-based conversion table.

The app also has inline validation for empty, non-numeric and negative input, a Clear button that restores the defaults, and a guard that removes a stale result when the input or a unit changes. A swap-units button is a Could Have.

The app is a static front end with no server, database, sign-in or storage. It is built in one sprint, tested automatically with Vitest in GitHub Actions CI, and deployed to GitHub Pages. It is a demo, not a production system.

## Business objectives

| # | Objective | Success measure |
|---|---|---|
| OBJ-1 | Show that the app converts lengths correctly between the five supported units. | All 20 unit pairs match reference values in automated tests that pass in CI (20 of 20). |
| OBJ-2 | Keep the app simple enough to use without instructions. | In the demo, a first-time user converts a value in under 10 seconds without guidance. |
| OBJ-3 | Make input handling and reset predictable. | Automated tests for Clear, the validation messages and the stale-result guard all pass in CI. |
| OBJ-4 | Deliver a live demo within one sprint. | The app is deployed and reachable on GitHub Pages at the end of Sprint 1. |

## User personas

| Persona | Description | Goals | Context |
|---|---|---|---|
| P1: Demo presenter (Admin) | Runs the demo and approves each SDLC gate. Acts as Sponsor and Product Owner. | Show a working, correct converter quickly and reliably in front of stakeholders. | Desktop browser (latest Chrome, Edge or Firefox), keyboard and mouse. |
| P2: Internal stakeholder | A colleague watching or trying the demo. Has no training on the app. | Convert a length between common units with no help and trust the result. | Mostly desktop browser; may open the link on a phone. |

## Scope (in and out)

### In scope

- A length input field with a visible label. It accepts positive numbers, including decimals.
- "From" and "To" unit dropdowns with the same five units: foot (ft), inch (in), centimetre (cm), metre (m), kilometre (km). Defaults: From = metre, To = centimetre.
- Conversion on Convert button click or the Enter key, covering all 20 unit pairs (5 x 4) through a single base-unit (metre) conversion table.
- The result shown with its unit (for example `30.48 cm`), rounded to at most 6 decimal places, with trailing zeros trimmed and no scientific notation.
- Inline validation:
  - `Please enter a valid number` for empty or non-numeric input.
  - A separate error message for negative lengths.
  - No result is shown while an error is present.
- Stale-result guard: the output clears when the input value or either unit changes after a conversion.
- A Clear button that:
  - resets the input to empty and the output to empty;
  - resets the units to metre and centimetre;
  - removes any error message.
- Basic accessibility and responsive layout: labelled controls and full keyboard use. The app is usable in the latest desktop Chrome, Edge and Firefox and at mobile width.
- Automated Vitest unit and integration tests, run in CI, that check:
  - all 20 unit pairs against reference values;
  - the Clear, validation and stale-output behaviour.
- Deployment to GitHub Pages.
- Could Have: a swap-units button that exchanges the From and To units and clears the output.

### Out of scope

- Units beyond the five listed (for example miles, yards, millimetres, nautical miles), and other measurement types such as weight, temperature or volume.
- Conversion history or a list of past results.
- Persistence of values or settings between sessions (no localStorage or other storage).
- Live or automatic conversion as the user types or changes units.
- Scientific notation or user-configurable precision.
- Special handling of zero beyond normal numeric conversion.
- Locale-specific number formats (for example comma decimal separators).
- User accounts, sign-in, or any server, API, database or secrets.
- Production concerns: scale or concurrency targets, uptime SLA, monitoring, analytics, or a formal accessibility (WCAG) audit.
- Localisation or multiple languages.
- Native mobile apps or offline/PWA support.

## Business requirements

| BR ID | Description | Persona | MoSCoW | Rationale |
|---|---|---|---|---|
| BR-01 | The app provides one labelled length input that accepts positive numbers, including decimals. | P1, P2 | Must | Minimal input is the core of the POC. |
| BR-02 | The app provides "From" and "To" unit dropdowns, each with ft, in, cm, m and km. Defaults are From = metre and To = centimetre. | P1, P2 | Must | Confirmed unit set and defaults. |
| BR-03 | The app converts the entered length on Convert click or the Enter key, for all 20 unit pairs, using one metre-based conversion table. | P1, P2 | Must | Core function. A single base table keeps the logic small and testable. |
| BR-04 | The app shows the result with its unit symbol (for example `30.48 cm`). The value is rounded to at most 6 decimal places, with trailing zeros trimmed and no scientific notation. | P2 | Must | A readable, unambiguous result builds trust in the demo. |
| BR-05 | The app shows inline errors: `Please enter a valid number` for empty or non-numeric input, and a separate message for negative input. No result is shown while an error is present. | P2 | Must | Prevents wrong or confusing output. |
| BR-06 | The app clears the output when the input value or either unit changes after a conversion. | P2 | Must | A stale result must never be shown. |
| BR-07 | A Clear button resets the input and output to empty, the units to metre and centimetre, and removes any error. | P1, P2 | Must | Gives a quick, predictable reset during the demo. |
| BR-08 | All controls are labelled and usable by keyboard. The layout works in the latest desktop Chrome, Edge and Firefox and at mobile width. | P1, P2 | Should | Basic accessibility, and stakeholders may open the link on a phone. |
| BR-09 | Automated Vitest tests check all 20 unit pairs against reference values plus the Clear, validation and stale-output behaviour. They run in GitHub Actions CI, and the app is deployed to GitHub Pages. | P1 | Must | Objective evidence for the success criteria and a live demo URL. |
| BR-10 | A swap-units button exchanges the From and To units and clears the output. | P2 | Could | A convenience feature; it is built only if time permits. |

## User stories

### US-01: Enter a length and choose units

As a stakeholder, I want to type a length and pick the units to convert from and to, so that I can set up a conversion quickly.

Serves: BR-01, BR-02

Acceptance criteria:
- Given the app has just loaded, then the input is empty, the output is empty, From shows metre (m) and To shows centimetre (cm).
- Given the From and To dropdowns, when I open either one, then it lists exactly five options: foot (ft), inch (in), centimetre (cm), metre (m) and kilometre (km).
- Given the input field, then it has a visible label that is programmatically linked to the field.

### US-02: Convert a length

As a stakeholder, I want to click Convert or press Enter, so that I get the converted length.

Serves: BR-03

Acceptance criteria:
- Given input `1` with From = foot and To = centimetre, when I click Convert, then the output shows `30.48 cm`.
- Given input `1` with From = kilometre and To = metre, when I press Enter in the input field, then the output shows `1000 m`.
- For each of the 20 From/To pairs, converting `1` produces the value derived from the reference factors (1 ft = 0.3048 m, 1 in = 0.0254 m, 1 cm = 0.01 m, 1 km = 1000 m), after the display rounding rule.
- Given a valid input, when I change the value or a unit without clicking Convert or pressing Enter, then no new result is calculated.

### US-03: Read a clear result

As a stakeholder, I want the result shown neatly with its unit, so that I can read it at a glance.

Serves: BR-04

Acceptance criteria:
- Given input `1` with From = inch and To = metre, when I convert, then the output shows `0.0254 m` (trailing zeros trimmed).
- Given input `1` with From = inch and To = kilometre, when I convert, then the output shows `0.000025 km` (at most 6 decimal places, no scientific notation).
- Given input `2.5` with From = metre and To = centimetre, when I convert, then the output shows `250 cm`, with no decimal point.

### US-04: See helpful input errors

As a stakeholder, I want clear error messages when my input is wrong, so that I know how to fix it and never see a wrong result.

Serves: BR-05

Acceptance criteria:
- Given the input is empty, when I click Convert, then the message `Please enter a valid number` appears next to the input and no result is shown.
- Given the input is `abc`, when I click Convert, then the message `Please enter a valid number` appears and no result is shown.
- Given the input is `-5`, when I click Convert, then the negative-length message (assumed: `Length cannot be negative`) appears and no result is shown.
- Given an error is shown, when I enter a valid number and convert, then the error disappears and the result is shown.

### US-05: Never see a stale result

As a stakeholder, I want the old result to disappear when I change the input or a unit, so that I never read a result that no longer matches the inputs.

Serves: BR-06

Acceptance criteria:
- Given a result is shown, when I edit the input value, then the output becomes empty.
- Given a result is shown, when I change the From unit, then the output becomes empty.
- Given a result is shown, when I change the To unit, then the output becomes empty.

### US-06: Clear everything

As a demo presenter, I want one Clear button that resets the app, so that I can start a new conversion cleanly.

Serves: BR-07

Acceptance criteria:
- Given a value, changed units and a result, when I click Clear, then the input is empty, the output is empty, From = metre and To = centimetre.
- Given an error message is shown, when I click Clear, then the error message is removed.

### US-07: Use the app by keyboard and on a small screen

As a stakeholder, I want to use the app with only a keyboard and on a phone-sized screen, so that I can try it however I open the link.

Serves: BR-08

Acceptance criteria:
- Given the page is loaded, when I press Tab repeatedly, then focus moves through the input, From, To, Convert and Clear in a logical order, and each focused control is visibly highlighted.
- Given a viewport 375 px wide, then all controls and the result are visible without horizontal scrolling.
- Every input and dropdown has an accessible name, which an automated test checks by querying it by its label.

### US-08: Trust the build through automated tests and a live link

As a demo presenter, I want automated tests in CI and a live GitHub Pages link, so that I can show evidence that the converter works.

Serves: BR-09

Acceptance criteria:
- The test suite includes unit tests for all 20 unit pairs, checked against reference values.
- The test suite includes integration tests for Clear, the validation messages and the stale-output guard.
- The CI workflow runs `npm ci`, `npm test` and `npm run build`, and passes on the main branch.
- After Gate 7 approval, the app is reachable at its GitHub Pages URL.

### US-09: Swap units (Could Have)

As a stakeholder, I want a button that swaps the From and To units, so that I can reverse a conversion in one click.

Serves: BR-10

Acceptance criteria:
- Given From = foot and To = metre, when I click Swap, then From = metre and To = foot.
- Given a result is shown, when I click Swap, then the output becomes empty.
- The Swap button has an accessible name (for example `Swap units`) and can be activated with the keyboard.

## Non-functional requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Accessibility | Basic accessibility following WCAG 2.1 AA practices for the controls in scope:<br>- visible labels linked to their inputs;<br>- full keyboard operation and a visible focus indicator;<br>- error messages announced to screen readers (for example `role="alert"`) and linked to the input;<br>- text colour contrast of at least 4.5:1.<br>No formal WCAG audit is done. |
| NFR-02 | Performance | The result or error appears within 100 ms of Convert or Enter on a typical desktop. The page is usable within 2 seconds on a normal broadband connection. These are demo targets, not production commitments. |
| NFR-03 | Browser and device support | Latest desktop Chrome, Edge and Firefox. The layout is usable at mobile width (375 px and above). Native apps and offline use are not supported. |
| NFR-04 | Accuracy | Conversion uses exact definitional factors relative to the metre (ft 0.3048, in 0.0254, cm 0.01, m 1, km 1000). Results are rounded to at most 6 decimal places for display only. |
| NFR-05 | Privacy and storage | The app uses no browser storage (no localStorage, sessionStorage or cookies). It collects, sends and stores no data. Nothing leaves the browser. |
| NFR-06 | Availability | The app is hosted on the GitHub Pages free tier with best-effort availability. There is no SLA, RTO, RPO, monitoring or on-call. |
| NFR-07 | Maintainability and testability | The conversion and formatting logic is kept in a pure module, separate from the UI, so that unit tests can cover all 20 pairs directly. |

## Assumptions and constraints

### Constraints

- The app is a static, front-end-only web app deployed to GitHub Pages: no server, database, sign-in, API or secrets.
- It is built in one sprint (Sprint 1) of about 5-10 user stories.
- It is built on the demo repo's starter template:
  - React 18 + Vite 5;
  - Vitest 2 + Testing Library + jsdom for tests;
  - GitHub Actions CI running `npm ci`, `npm test` and `npm run build`.
- It is a POC for a demo with one or a handful of demo users. There are no scale, uptime or compliance targets.
- The Admin is the single approver of every gate.

### Assumptions

- **Rounding:** the answers said "6 significant decimals" and the confirmed scope says "at most 6 decimal places". This BRD follows the confirmed scope: round to 6 decimal places, then trim trailing zeros. As a result, very small results (below 0.0000005 in the target unit) display as `0`.
- **Negative error text:** no wording was given for the negative-length error. The assumed text is `Length cannot be negative`.
- **Zero:** `0` is valid input and converts normally (for example `0 cm`). There is no special handling.
- **Accepted number format:** a plain decimal number with a dot as the decimal separator (for example `12`, `0.5`, `12.75`). Leading and trailing spaces are ignored. Other formats are treated as non-numeric.
- **Very large values:** demo values are of realistic size. Results are shown in plain decimal notation, and extremely large inputs are outside the tested range.
- **Same unit on both sides:** choosing the same unit for From and To is allowed and returns the input value unchanged. The 20 tested pairs are the distinct pairs.
- **Result format:** the result shows the unit symbol after the value, separated by a space (`ft`, `in`, `cm`, `m`, `km`). The dropdowns show the full name with the symbol (for example `metre (m)`).
- **Reference values:** reference values for the tests come from the exact definitions: 1 ft = 0.3048 m, 1 in = 0.0254 m.
- **Demo success check:** the "under 10 seconds without instructions" measure is checked by observation during the demo, not by an automated test.

## Dependencies

- The demo GitHub repository and its starter template (React 18, Vite 5, Vitest 2, Testing Library, jsdom).
- GitHub Actions for CI and the Pages deployment workflow.
- GitHub Pages enabled on the demo repository for hosting.
- The demo Jira project, for creating the backlog in Phase 2.
- The Admin's availability to approve each phase gate (Gates 0 to 8).
- No external APIs, fonts, data sources or third-party services at runtime.

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor and Product Owner) | Admin | Pending gate approval | Pending |

Status: **Pending gate approval** (Gate 0: Charter and Lite BRD sign-off).
