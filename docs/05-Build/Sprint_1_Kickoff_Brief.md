# Sprint Kickoff Brief: Unit Converter

## Sprint goal

At https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/, the Admin enters `1`, converts foot to centimetre and sees `30.48 cm`; enters `-5` and sees `Length cannot be negative`; changes a unit and sees the result disappear; and clicks Clear to restore the defaults (empty, metre, centimetre). A green CI run shows all 20 unit-pair tests passing.

## Stories in this sprint

| ID | Story | MoSCoW | Points |
|---|---|---|---|
| S1 | Type a length and pick From/To units (defaults m → cm, five units, labelled input) | Must | 2 |
| S2 | Convert on click or Enter for all 20 unit pairs | Must | 3 |
| S3 | Show the result neatly with its unit (max 6 decimals, no scientific notation) | Must | 2 |
| S4 | Inline error messages for empty, non-numeric and negative input | Must | 3 |
| S5 | Clear a stale result when the input or a unit changes | Must | 2 |
| S6 | One Clear button that resets everything | Must | 1 |
| S7 | Keyboard use and 375 px mobile layout | Should | 2 |
| S8 | Automated tests in CI and a live GitHub Pages link | Must | 3 |
| **Total** | | | **18** |

Capacity is 20 points, so 18 points leaves a 2-point buffer for formatting edge cases and CI fixes.

## How it will be built

- **Components:** `src/App.jsx` holds the form state with `useState` (`inputValue`, `fromUnit`, `toUnit`, `result`, `error`). `src/main.jsx` mounts it and imports `src/App.css`. `index.html` gets the title "Unit Converter" and `lang="en"`. `vite.config.js` sets `base: '/sdlc-unit-converter-r5/'`.
- **Pure logic:** `src/convert.js` exports `UNITS`, `DEFAULTS`, `MESSAGES`, `parseLength`, `convertLength` and `formatResult`. It uses metre factors ft 0.3048, in 0.0254, cm 0.01, m 1 and km 1000, and has no React, DOM or storage code.
- **Formatting:** `toFixed(6)`, then trim trailing zeros and a trailing `.`, map `-0` to `0`, and append the unit symbol after a space (ADR-3).
- **Events:** Convert and Enter both submit one `<form>`. Every input or unit `onChange` sets `result` to `null`, which is the stale guard. Errors render in a `role="alert"` element linked to the input with `aria-describedby`. The result renders in `<output aria-live="polite">`.
- **Storage contract:** none. The app uses no localStorage, sessionStorage, IndexedDB, cookies or network calls, and needs no environment variables (ADR-2, NFR-05).
- **Styling:** plain CSS with custom properties as design tokens, a system font stack, a visible focus ring, contrast of at least 4.5:1 and a single column below 480 px. Token names and component names follow the approved mockup's Design notes and the SDD (`App`, `convert`).
- **Tests:**
  - `src/convert.test.js` runs `it.each` over all 20 pairs and covers formatting and parsing.
  - `src/App.test.jsx` covers defaults, click and Enter, errors, the stale guard, Clear, labels and tab order.
  - Test names start with the story ID, for example `S2: converts 1 ft to 30.48 cm`.
  - The 375 px layout and the focus ring are checked by hand in Chrome DevTools.
- **CI:** the template `ci.yml` (`npm ci`, `npm test`, `npm run build`) and `deploy-pages.yml` stay unchanged.

## Definition of Done

- [ ] Code is merged to `main` in github.com/sdlc-demo-apps/sdlc-unit-converter-r5 through a pull request with a code review.
- [ ] Conversion and formatting logic lives in a pure module separate from the React UI (NFR-07).
- [ ] Every acceptance criterion of the story has at least one Vitest test (unit or Testing Library integration test in jsdom), named so it maps to the story ID.
- [ ] The GitHub Actions CI workflow (`.github/workflows/ci.yml`) passes on the pull request and on `main`: `npm ci`, `npm test` (Vitest) and `npm run build` all succeed.
- [ ] No browser storage, network calls, external fonts or secrets are added (NFR-05).
- [ ] Controls touched by the story have visible labels, keyboard access and a visible focus indicator (NFR-01).
- [ ] Local check: the `npm run build` output in `dist/` loads, and the story's acceptance criteria are confirmed by hand in the latest Chrome.
- [ ] After Gate 7, the `deploy-pages.yml` workflow publishes `dist/`, and the story is checked by hand at https://sdlc-demo-apps.github.io/sdlc-unit-converter-r5/ (including the `30.48 cm` smoke check and a 375 px width view).
- [ ] The Jira story is updated to Done with its points, and the backlog status reads "Done | Sprint 1".

## Risks and assumptions

- **Risk: floating-point noise.** Results such as 30.479999… or 0.000025 could display wrongly. Mitigation: `toFixed(6)` with zero trimming, plus explicit expected strings for all 20 pairs in the tests.
- **Risk: jsdom has no layout.** The 375 px layout and the focus ring cannot be tested automatically. Mitigation: a manual DevTools check in the DoD.
- **Assumption: valid number format.** Only dot decimals are accepted. `1,5` is treated as invalid, and values below 0.0000005 display as `0`, as the SDD states.
- **Assumption: template unchanged.** The template's CI and Pages workflows work as provided, so only the Vite `base` needs setting.

## Not in this sprint

- **S9 Swap units (Could, 1 point):** stays "Backlog | Could Have". It is picked up only if all 18 planned points are Done; its design and test are ready.
- **Out of scope per the BRD:** extra units or measurement types, conversion history, persistence, live conversion, scientific notation or configurable precision, locale number formats, localisation, PWA or offline support, accounts and servers, and any production monitoring, SLA or formal WCAG audit.