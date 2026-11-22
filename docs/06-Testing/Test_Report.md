# Test Report: Unit Converter

## Summary

**Verdict: ready for release, with four acceptance criteria handed to manual or post-merge checks.** No automated test failed, and nothing found so far blocks Gate 6.

- **CI:** success on PR #1. `npm ci`, `npm test` and `npm run build` all passed. There were 0 CI fix attempts.
- **Tests:** 2 test files ran, with 61 tests passing (39 in `src/convert.test.js`, 22 in `src/App.test.jsx`).
- **Named tests:** 35 test names were read from the files. Of these, 27 are individual tests and 8 are group (describe) names: 7 in `src/App.test.jsx` and 1 (`convert module`) in `src/convert.test.js`. The CI count of 61 is higher because some tests run several cases with `it.each`. For example, the 20-pair table runs as `it.each`.
- **Coverage:** 23 of the 27 Sprint 1 acceptance criteria (S1–S8) are covered by automated tests that passed. The other 4 are "Not covered":
  - 2 S7 layout and focus criteria (375 px width, visible focus highlight)
  - 1 S8 CI criterion (a passing run on `main`), because the evidence only shows a run on the PR merge ref
  - 1 S8 deployment criterion (the live URL), which belongs to Gate 7
- **Out of scope:** S9 (Swap units, Could Have) was not built and is not tested.

## Test approach

Tests are written in Vitest 2 with Testing Library and jsdom. They run in GitHub Actions CI (`.github/workflows/ci.yml`) on the pull request merge ref.

- **Unit tests** (`src/convert.test.js`) check the pure logic module `src/convert.js`:
  - the unit list and defaults
  - the 20-pair conversion table against the metre factors (ft 0.3048, in 0.0254, cm 0.01, km 1000)
  - formatting (6 decimals, trimmed zeros, no scientific notation)
  - parsing and validation
  - error message wording
- **Integration tests** (`src/App.test.jsx`) render the `App` component and use it the way a person would, with `@testing-library/user-event` 14.6.1. They cover:
  - load defaults
  - Convert by click and by Enter
  - inline errors
  - the stale-result guard
  - Clear
  - tab order, labelled controls, keyboard-only use and the polite live region
- **Not automated:**
  - Real layout and CSS. jsdom does not render layout, so the 375 px width and the visible focus ring need a manual check in Chrome DevTools.
  - A CI run on `main`. It happens only after PR #1 is merged.
  - The live GitHub Pages check. It can only happen after Gate 7 deploys the app.
  - The DoD hand check of the `dist/` build in Chrome is listed in the PR as still needing a person.
- Test names start with the story ID, so each test maps to its story.

## Acceptance criteria coverage

| Story | Acceptance criterion | Test(s) that verify it (file: test name) | Result |
|---|---|---|---|
| S1 | On load, input and output empty, From = metre, To = centimetre | App.test.jsx: S1: on load the input and output are empty, From = metre, To = centimetre; convert.test.js: S1: defaults are empty input, metre to centimetre, no result or error | Pass |
| S1 | Each dropdown lists exactly five options (ft, in, cm, m, km) | App.test.jsx: S1: each dropdown lists exactly the five units; convert.test.js: S1: lists exactly five units in display order with labels | Pass |
| S1 | Input has a visible label programmatically linked | App.test.jsx: S1: the input has a visible label programmatically linked to it | Pass |
| S2 | `1` ft to cm, click Convert: `30.48 cm` | App.test.jsx: S2: converts 1 ft to 30.48 cm on Convert click; convert.test.js: S2: converts 1 ft to 30.48 cm | Pass |
| S2 | `1` km to m, press Enter: `1000 m` | App.test.jsx: S2: converts 1 km to 1000 m when Enter is pressed | Pass |
| S2 | All 20 pairs for input `1` match metre-factor values | convert.test.js: S8: the table covers all 20 distinct unit pairs (the PR describes an `it.each` over all 20 pairs) | Pass |
| S2 | Changing value or unit without Convert/Enter calculates no result | App.test.jsx: S2: changing the value or a unit without Convert/Enter calculates no result | Pass |
| S3 | `1` in to m: `0.0254 m` | convert.test.js: S3: trims trailing zeros (1 in to m is 0.0254 m) | Pass |
| S3 | `1` in to km: `0.000025 km`, no scientific notation | convert.test.js: S3: shows tiny values with max 6 decimals and no scientific notation | Pass |
| S3 | `2.5` m to cm: `250 cm`, no decimal point | convert.test.js: S3: shows whole numbers without a decimal point (2.5 m to cm is 250 cm) | Pass |
| S4 | Empty input + Convert: `Please enter a valid number`, no result | App.test.jsx: tests in group "S4: inline error messages" (PR: empty shows the message with no result); convert.test.js: S4: messages match the approved wording | Pass |
| S4 | `abc` + Convert: same message, no result | App.test.jsx: tests in group "S4: inline error messages" (PR: `abc` covered); convert.test.js: S4: messages match the approved wording | Pass |
| S4 | `-5` + Convert: `Length cannot be negative`, no result | convert.test.js: S4: parseLength rejects negatives; App.test.jsx: tests in group "S4: inline error messages" (PR: `-5` covered) | Pass |
| S4 | After an error, a valid number + Convert removes the error and shows the result | App.test.jsx: S4: after an error, a valid number + Convert removes the error and shows the result | Pass |
| S5 | Editing the input empties the output | App.test.jsx: S5: editing the input empties the output | Pass |
| S5 | Changing From empties the output | App.test.jsx: S5: changing From empties the output | Pass |
| S5 | Changing To empties the output | App.test.jsx: S5: changing To empties the output | Pass |
| S6 | Clear resets input, output, From = metre, To = centimetre | App.test.jsx: S6: with a value, changed units and a result, Clear restores the defaults | Pass |
| S6 | With an error shown, Clear removes the error | App.test.jsx: S6: with an error shown, Clear removes the error | Pass |
| S7 | Tab order: input, From, To, Convert, Clear | App.test.jsx: S7: Tab moves through input, From, To, Convert, Clear in order | Pass |
| S7 | Visible focus highlight | None (jsdom cannot check CSS) | Not covered |
| S7 | At 375 px, all controls and the result visible without horizontal scrolling | None (jsdom has no layout) | Not covered |
| S7 | Every input and dropdown queried by its accessible label | App.test.jsx: S7: every input and dropdown is found by its accessible label | Pass |
| S8 | Unit tests cover all 20 unit pairs | convert.test.js: S8: the table covers all 20 distinct unit pairs | Pass |
| S8 | Integration tests cover Clear, validation and the stale-output guard | App.test.jsx: S6, S4 and S5 tests above | Pass |
| S8 | CI runs `npm ci`, `npm test`, `npm run build` and passes on main | CI run 44996940904 passed all three steps on the PR merge ref only; no run on `main` is in the evidence | Not covered (pending a run on main) |
| S8 | After Gate 7, reachable at the GitHub Pages URL | None (deployment happens in Phase 7) | Not covered (pending Gate 7) |

Notes on the table:

- **S4 group name:** the separate S4 empty, `abc` and `-5` integration tests appear in the evidence only through the group name "S4: inline error messages" and the PR description.
- **S8 CI criterion:** CI passed on the PR merge ref. A run on `main` after merge is not in the evidence, so the criterion stays Not covered until that run passes.

## Requirements traceability

| BR ID | Story | Code module(s) | Test file(s) | Status |
|---|---|---|---|---|
| BR-01, BR-02 | S1 | src/App.jsx, src/convert.js | src/App.test.jsx, src/convert.test.js | Pass |
| BR-03 | S2 | src/convert.js, src/App.jsx | src/convert.test.js, src/App.test.jsx | Pass |
| BR-04 | S3 | src/convert.js | src/convert.test.js | Pass |
| BR-05 | S4 | src/convert.js, src/App.jsx | src/convert.test.js, src/App.test.jsx | Pass |
| BR-06 | S5 | src/App.jsx | src/App.test.jsx | Pass |
| BR-07 | S6 | src/App.jsx | src/App.test.jsx | Pass |
| BR-08 | S7 | src/App.jsx, src/App.css | src/App.test.jsx | Partial: 2 of 4 ACs pass; focus ring and 375 px are manual checks |
| BR-09 | S8 | .github/workflows/ci.yml, deploy-pages.yml | src/convert.test.js, src/App.test.jsx | Partial: 2 of 4 ACs pass; tests and CI pass on the PR merge ref; CI run on main and live URL pending |
| BR-10 | S9 | Not built | None | Backlog, Could Have (not in Sprint 1) |

## CI run

- **Result:** success
- **Link:** https://github.com/sdlc-demo-apps/sdlc-unit-converter-r5/actions/runs/44996940904/job/137129901667
- **Commit:** merge commit 709dd5a (PR #1 into the base branch)
- **Environment:** Node v22.23.5, npm 10.9.9
- **CI fix attempts:** 0

Test summary lines from the log:

```
✓ src/convert.test.js (39 tests) 11ms
✓ src/App.test.jsx (22 tests) 1382ms
Test Files  2 passed (2)
     Tests  61 passed (61)
  Duration  2.50s
```

Build: Vite 5.4.11 transformed 32 modules and built in 756 ms. The output was `dist/index.html` (0.40 kB), a CSS file of 2.86 kB and a JS file of 145.72 kB (46.96 kB gzip).

The log also contains warnings. None of them failed the run:

- `npm ci` reported 5 dependency vulnerabilities (2 moderate, 1 high, 2 critical).
- There were Node deprecation warnings (`punycode`, `url.parse`).
- There was a GitHub Actions notice that Node 20 actions now run on Node 24.

## Code review

The Reviewer's findings at Gate 5:

| Check | Result | Notes |
|---|---|---|
| Every Sprint 1 Must story is implemented | Pass | S1–S6 are in `App.jsx` and `convert.js`. S8 tests are present and CI passed. Deployment is correctly left until after Gate 7. |
| Each AC covered by at least one test | Needs attention | S7's 375 px and visible-focus criteria have no test. Record them as Not covered with a manual check. |
| Follows approved design | Pass | There is a pure `convert.js` module, no storage, and `App.css` uses the mockup tokens. The SDD and mockup were not given to the Reviewer, so exact token matching was not verified. |
| No network calls, secrets or tracking | Pass | The only new dependency is the dev-only, pinned `@testing-library/user-event`. |
| Accessible | Pass | `label htmlFor`, `role="alert"` with `aria-describedby`/`aria-invalid`, `output aria-live="polite"`, and a 3 px amber `:focus-visible` outline. |
| CI passed | Pass | All three steps succeeded. |
| Workflow files and Vite base unchanged | Pass | `vite.config.js` and the workflows were not touched. |

## Defects and known issues

No automated test failed and no defects were logged. Known issues:

1. **S7: visible focus highlight. Not covered.** No automated test exists. Manually tab through the controls in Chrome and confirm the 3 px amber focus ring.
2. **S7: 375 px width with no horizontal scrolling. Not covered.** No automated test exists. Check it in Chrome DevTools at 375 px, locally and on the live site after Gate 7.
3. **S8: CI passing on main. Not covered yet.** The only CI run in the evidence is on the PR #1 merge ref (commit 709dd5a). Confirm a green `ci.yml` run on `main` after the merge.
4. **S8: live GitHub Pages URL. Not covered yet.** This is verified after Gate 7 deploys the app. The Phase 7 deployment record will confirm it, including the `30.48 cm` smoke check.
5. **`vite.config.js` base path left unchanged** (the SDD asked for `/sdlc-unit-converter-r5/`). The PR says the Pages workflow sets the path through `BASE_PATH`. This is unverified until the live check after Gate 7.
6. **Dependency audit warnings:** `npm ci` reported 5 vulnerabilities (2 moderate, 1 high, 2 critical). The evidence does not show which packages they are in, and they have not been triaged. Run `npm audit` to identify them.
7. **S9 (Swap units)** was not built. It stays "Backlog | Could Have".

## UAT sign-off

The Admin's Gate 6 approval is the UAT sign-off for this POC.

| Role | Name | Decision | Date |
|---|---|---|---|
| Approver (Sponsor and Product Owner) | Admin | Pending gate approval | Pending |

Status: **Pending gate approval** (Gate 6: UAT sign-off).
