# Release Notes: Unit Converter 1.0.0

## Release

| Version | Planned deployment date | Live URL | Pull request |
|---|---|---|---|
| 1.0.0 | 2026-11-22 | https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/ | [#1](https://github.com/sdlc-demo-apps/sdlc-unit-converter-r5/pull/1) |

This is the Sprint 1 release of a proof of concept for an internal demo. It is not a production system.

## What's new

**E1: Conversion core**
- S1: Type a length and pick From and To units from five options (ft, in, cm, m, km). The defaults are metre to centimetre.
- S2: Click Convert or press Enter to convert between any of the 20 unit pairs, for example `1` ft gives `30.48 cm`.
- S3: Results show with their unit, at most 6 decimals, trailing zeros trimmed and no scientific notation (`0.000025 km`).

**E2: Input safety and reset**
- S4: Empty or non-numeric input shows `Please enter a valid number`. Negative input shows `Length cannot be negative`. No result is shown while an error is present.
- S5: The result clears when you edit the value or change either unit, so a stale result is never shown.
- S6: Clear resets the input and output to empty, the units to metre and centimetre, and removes any error.

**E3: Quality, access and delivery**
- S7: All controls are labelled and can be used by keyboard, in the order input, From, To, Convert, Clear.
- S8: Automated tests run in CI. The app will be published on GitHub Pages after Gate 7 approval.

Not in this release: S9 (Swap units, Could Have) stays in the backlog.

## How it was verified

CI run [44996940904](https://github.com/sdlc-demo-apps/sdlc-unit-converter-r5/actions/runs/44996940904/job/137129901667) on the PR #1 merge ref (commit 709dd5a) passed `npm ci`, `npm test` and `npm run build`, with 0 fix attempts. 61 Vitest tests passed: 39 unit tests in `src/convert.test.js`, including all 20 unit pairs, and 22 integration tests in `src/App.test.jsx`. These tests cover 23 of the 27 Sprint 1 acceptance criteria. The Gate 5 code review passed every check except AC coverage, which it marked "Needs attention" because the S7 375 px and visible-focus criteria have no tests; these are recorded as Not covered with a manual check. The Admin's Gate 6 approval of the Test Report is the acceptance (UAT) sign-off.

## Known issues

1. **S7 visible focus highlight:** no automated test. Check by hand that the 3 px amber focus ring shows in Chrome.
2. **S7 375 px width:** no automated test. Check in Chrome DevTools, locally and on the live site.
3. **S8 CI on `main`:** the only CI run in the evidence is on the PR merge ref. Confirm a green `ci.yml` run on `main` after the merge.
4. **S8 live URL:** this is confirmed by the deployment record after Gate 7, including the `30.48 cm` smoke check.
5. **Base path:** `vite.config.js` was not changed. The Pages workflow is said to set `/sdlc-unit-converter-r5/` through `BASE_PATH`. This is unverified until the live check.
6. **Dependency audit:** `npm ci` reported 5 vulnerabilities (2 moderate, 1 high, 2 critical). They have not been triaged yet. Run `npm audit`.
7. **S9 Swap units:** not built. It stays "Backlog | Could Have".

## Dependencies and environment changes

- **Runtime:** React 18, bundled by Vite 5 into static files. The JS bundle is 145.72 kB (46.96 kB gzip).
- **Dev only:** Vitest 2, Testing Library, jsdom, and the newly added `@testing-library/user-event` 14.6.1 (pinned).
- **Hosting:** GitHub Pages free tier, deployed by `deploy-pages.yml`. Availability is best effort, with no SLA or monitoring. To roll back, redeploy the previous commit.
- **Browsers:** targeted at the latest desktop Chrome, Edge and Firefox, and at mobile width. Unverified: tests ran only in jsdom, the manual checks reference Chrome only, and the 375 px layout is Not covered. Edge, Firefox and mobile width have not been checked.
- **Data:** nothing is stored. The app uses no browser storage, makes no network calls and loads no external fonts.
- **No server, database, sign-in or secrets.** The CI and Pages workflow files are unchanged.

## Go-live sign-off

| Role | Name | Decision | Date | Version |
|---|---|---|---|---|
| Approver (Sponsor and Product Owner) | Admin | Pending gate approval | Pending | 1.0.0 |

Status: **Pending gate approval** (Gate 7: Go-live sign-off). Approving this gate deploys version 1.0.0 to GitHub Pages. The app then adds the deployment record.

## Deployment record

| Live URL | Deployed (UTC) | Workflow run | Commit | Check |
|---|---|---|---|---|
| https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/ | 2026-11-22 13:48 | [run](https://github.com/sdlc-demo-apps/sdlc-unit-converter-r5/actions/runs/45029310347) | `1422b37` | HTTP 200 |
