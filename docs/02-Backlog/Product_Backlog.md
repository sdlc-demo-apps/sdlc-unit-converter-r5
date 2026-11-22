# Product Backlog: Unit Converter

## Epic overview

| Epic ID | Epic | Goal | Stories |
|---|---|---|---|
| E1 | Conversion core | Let a user enter a length, pick units and get a correct, neatly formatted result for all 20 unit pairs. | S1, S2, S3 |
| E2 | Input safety and reset | Make input handling predictable: clear errors, no stale results, one-click reset, optional swap. | S4, S5, S6, S9 |
| E3 | Quality, access and delivery | Make the app keyboard- and mobile-friendly, prove it with automated tests in CI, and publish it on GitHub Pages. | S7, S8 |

## Stories

| ID | Epic | User story | Acceptance criteria | MoSCoW | T-shirt | Points | Sprint | Status | Depends on | BRD ref |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 | E1 | As a stakeholder, I want to type a length and pick the units to convert from and to, so that I can set up a conversion quickly. | On load, input and output are empty, From = metre (m), To = centimetre (cm).<br>Each dropdown lists exactly five options: foot (ft), inch (in), centimetre (cm), metre (m), kilometre (km).<br>The input has a visible label programmatically linked to it. | Must | S | 2 | Sprint 1 | Planned \| Sprint 1 | None | US-01 / BR-01, BR-02 |
| S2 | E1 | As a stakeholder, I want to click Convert or press Enter, so that I get the converted length. | Input `1`, ft to cm, click Convert: output `30.48 cm`.<br>Input `1`, km to m, press Enter: output `1000 m`.<br>All 20 pairs for input `1` match values from the metre factors (ft 0.3048, in 0.0254, cm 0.01, km 1000) after rounding.<br>Changing the value or a unit without Convert/Enter calculates no new result. | Must | M | 3 | Sprint 1 | Planned \| Sprint 1 | S1 | US-02 / BR-03 |
| S3 | E1 | As a stakeholder, I want the result shown neatly with its unit, so that I can read it at a glance. | Input `1`, in to m: output `0.0254 m`.<br>Input `1`, in to km: output `0.000025 km` (max 6 decimals, no scientific notation).<br>Input `2.5`, m to cm: output `250 cm`, no decimal point. | Must | S | 2 | Sprint 1 | Planned \| Sprint 1 | S2 | US-03 / BR-04 |
| S4 | E2 | As a stakeholder, I want clear error messages when my input is wrong, so that I know how to fix it and never see a wrong result. | Empty input + Convert: `Please enter a valid number` shown next to the input, no result.<br>Input `abc` + Convert: same message, no result.<br>Input `-5` + Convert: `Length cannot be negative` shown, no result.<br>After an error, a valid number + Convert removes the error and shows the result. | Must | M | 3 | Sprint 1 | Planned \| Sprint 1 | S2 | US-04 / BR-05 |
| S5 | E2 | As a stakeholder, I want the old result to disappear when I change the input or a unit, so that I never read a result that no longer matches the inputs. | With a result shown, editing the input empties the output.<br>With a result shown, changing From empties the output.<br>With a result shown, changing To empties the output. | Must | S | 2 | Sprint 1 | Planned \| Sprint 1 | S2 | US-05 / BR-06 |
| S6 | E2 | As a demo presenter, I want one Clear button that resets the app, so that I can start a new conversion cleanly. | With a value, changed units and a result, Clear sets input empty, output empty, From = metre, To = centimetre.<br>With an error shown, Clear removes the error. | Must | XS | 1 | Sprint 1 | Planned \| Sprint 1 | S1, S4 | US-06 / BR-07 |
| S7 | E3 | As a stakeholder, I want to use the app with only a keyboard and on a phone-sized screen, so that I can try it however I open the link. | Tab moves through input, From, To, Convert, Clear in order, with a visible focus highlight.<br>At 375 px width, all controls and the result are visible without horizontal scrolling.<br>A test queries every input and dropdown by its accessible label. | Should | S | 2 | Sprint 1 | Planned \| Sprint 1 | S1, S6 | US-07 / BR-08 |
| S8 | E3 | As a demo presenter, I want automated tests in CI and a live GitHub Pages link, so that I can show evidence that the converter works. | Unit tests cover all 20 unit pairs against reference values.<br>Integration tests cover Clear, validation messages and the stale-output guard.<br>CI runs `npm ci`, `npm test`, `npm run build` and passes on main.<br>After Gate 7, the app is reachable at https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/. | Must | M | 3 | Sprint 1 | Planned \| Sprint 1 | S2–S6 | US-08 / BR-09 |
| S9 | E2 | As a stakeholder, I want a button that swaps the From and To units, so that I can reverse a conversion in one click. | From = foot, To = metre, click Swap: From = metre, To = foot.<br>With a result shown, Swap empties the output.<br>Swap has the accessible name `Swap units` and works by keyboard. | Could | XS | 1 | Backlog | Backlog \| Could Have | S1, S5 | US-09 / BR-10 |

## Estimation

**Method.** Each story was T-shirt sized first, then given a Fibonacci estimate on the scale 1, 2, 3, 5, 8: XS = 1, S = 2, M = 3, L = 5, XL = 8. No story is larger than M, so none needs splitting.

| Story | T-shirt | Points | Reason |
|---|---|---|---|
| S1 | S | 2 | Static form with labelled input and two dropdowns. |
| S2 | M | 3 | Pure conversion module with a metre table, wired to click and Enter. |
| S3 | S | 2 | Formatting function: round to 6 decimals, trim zeros, avoid scientific notation for tiny values. |
| S4 | M | 3 | Parsing rules (trim, dot decimal, reject non-numeric and negative) plus accessible inline error. |
| S5 | S | 2 | Clear output on any input or unit change. |
| S6 | XS | 1 | Reset state to defaults. |
| S7 | S | 2 | Focus styles, tab order and responsive CSS at 375 px. |
| S8 | M | 3 | 20-pair table tests, integration tests, CI green; template already has CI and Pages workflows. |
| S9 | XS | 1 | Swap two state values and clear output. |

**Totals.** Planned (Must + Should): 18 points. Could Have: 1 point. Whole backlog: 19 points.

**Velocity assumption.** One sprint with one developer (an AI build agent reviewed by the Admin) on the starter template. Assumed capacity: 20 points for Sprint 1. No historical velocity exists, so this is a planning assumption, not a measured figure.

**Confidence level: High.** The scope is small and fully specified in the BRD, the reference values and expected outputs are given, there is no server, storage or external dependency, and CI and Pages deployment already exist in the template. The main risk is formatting edge cases (floating-point results such as 0.000025 shown without scientific notation), which is covered by explicit tests in S3 and S8.

## Sprint 1 plan

| Story | Epic | Points | Status |
|---|---|---|---|
| S1 | E1 | 2 | Planned \| Sprint 1 |
| S2 | E1 | 3 | Planned \| Sprint 1 |
| S3 | E1 | 2 | Planned \| Sprint 1 |
| S4 | E2 | 3 | Planned \| Sprint 1 |
| S5 | E2 | 2 | Planned \| Sprint 1 |
| S6 | E2 | 1 | Planned \| Sprint 1 |
| S7 | E3 | 2 | Planned \| Sprint 1 |
| S8 | E3 | 3 | Planned \| Sprint 1 |
| **Total** | | **18** | |

**Total points vs capacity:** 18 of 20 points (90%). The 2-point buffer covers formatting edge cases and CI fixes. S9 (Swap units, 1 point) is picked up only if all Planned stories are done; it stays "Backlog | Could Have" until then.

**Sequencing rationale:** S1 builds the form; S2 and S3 add the conversion and formatting logic; S4 and S5 protect the output; S6 resets it; S7 polishes access and layout once the controls exist; S8 completes the test suite and confirms CI, although tests are written alongside each story.

**Sprint goal (demonstrable):** At https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/, the Admin enters `1`, converts foot to centimetre and sees `30.48 cm`; enters `-5` and sees `Length cannot be negative`; changes a unit and sees the result disappear; clicks Clear and sees the defaults (empty, metre, centimetre) restored; and shows a green CI run with all 20 unit-pair tests passing.

## Definition of Done

A story is Done | Sprint 1 only when every item below is true:

- [ ] Code is merged to `main` in github.com/sdlc-demo-apps/sdlc-unit-converter-r5 through a pull request with a code review.
- [ ] Conversion and formatting logic lives in a pure module separate from the React UI (NFR-07).
- [ ] Every acceptance criterion of the story has at least one Vitest test (unit or Testing Library integration test in jsdom), named so it maps to the story ID.
- [ ] The GitHub Actions CI workflow (`.github/workflows/ci.yml`) passes on the pull request and on `main`: `npm ci`, `npm test` (Vitest) and `npm run build` all succeed.
- [ ] No browser storage, network calls, external fonts or secrets are added (NFR-05).
- [ ] Controls touched by the story have visible labels, keyboard access and a visible focus indicator (NFR-01).
- [ ] Local check: `npm run build` output in `dist/` loads and the story's acceptance criteria are confirmed by hand in the latest Chrome.
- [ ] After Gate 7, the `deploy-pages.yml` workflow publishes `dist/` and the story is checked by hand at https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/ (including the `30.48 cm` smoke check and a 375 px width view).
- [ ] The Jira story is updated to Done with its points, and the backlog status reads "Done | Sprint 1".

## Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor and Product Owner) | Admin | Pending gate approval | Pending |

Status: **Pending gate approval** (Gate 2: Backlog groomed).
