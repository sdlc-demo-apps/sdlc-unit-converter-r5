# Retrospective: Unit Converter

## The run in numbers

| Phase | Minutes | Minutes waiting for the Admin | Cost | Automatic revisions |
|---|---|---|---|---|
| 0 Discovery | 4.1 | 1.8 | $0.51 | 0 |
| 2 Backlog & planning | 7.2 | 1.0 | $0.45 | 0 |
| 3 Solution design | 40.6 | 39.1 | $0.58 | 0 |
| 4 UI design | 2.5 | 0.4 | $0.66 | 1 |
| 5 Build | 403.6 | 74.7 | $0.62 | 0 |
| 6 Testing | 321.2 | 319.3 | $0.61 | 1 |
| 7 Deployment | 2.2 | 0.5 | $0.37 | 1 |
| 8 Retrospective | 0.0 (in progress) | 0.0 | $0.00 | 0 |

- **Total time:** 458.0 minutes on the run clock. The per-phase minutes add up to 781.4, more than the run clock. The facts do not explain the difference, so treat the phase figures as durations, not a sum.
- **Waiting for the Admin:** 436.8 minutes across phases. Phase 6 alone accounts for 319.3 of them.
- **Cost:** $3.80 of a $7.00 cap (54%). The cap was raised 0 times.
- **Other counts:** 12 decisions, 13 Jira issues, 15 files changed, 2 test files, 0 CI fix attempts, 0 failed steps, 0 Admin change requests, 0 edited questionnaire answers.

## What went well

1. **The early documents passed first time.** The Project Charter (7/7), BRD (11/11), Product Backlog (8/8) and SDD (12/12) each needed 1 version, and Phases 0 and 2 had 0 automatic revisions. Discovery and planning together took 11.3 minutes and cost $0.96.
2. **The build was green on the first try.** There were 0 CI fix attempts and 0 failed steps. CI run 44996940904 passed `npm ci`, `npm test` and `npm run build`, with 61 tests passing across 2 files.
3. **The approved scope held.** The Admin made 0 change requests and edited 0 questionnaire answers. 23 of 27 Sprint 1 acceptance criteria are covered by passing tests, and S9 stayed in the backlog as planned.
4. **Deployment worked first time.** The deployment record shows the site live at 2026-11-22 13:48 UTC, commit `1422b37`, returning HTTP 200. Phase 7 took 2.2 minutes.
5. **The run stayed cheap.** It cost $3.80, with no phase above $0.66 and no cap raise.

## What didn't go well

1. **Long idle waits at gates.** The run spent 436.8 minutes waiting for the Admin. Phase 6 accounts for 319.3 of its 321.2 minutes, Phase 5 for 74.7 and Phase 3 for 39.1.
2. **Phase 5 was slow even without waiting.** Phase 5 recorded 403.6 minutes, of which 328.9 were not spent waiting for the Admin, for a 15-file change with 0 CI fixes.
3. **The late documents needed revisions.** The Test Report scored 4/7 at first review (2 versions, final 7/7). The Release Notes scored 3/6 at first review (3 versions, final 6/6). The Hi-Fi Mockups scored 8/9 at first review (2 versions).
4. **The code review never reached full marks.** Code scored 6/7 at both first and final review. The failing check was AC coverage: the S7 375 px and visible-focus criteria have no tests.
5. **Open items carried into release.** The Release Notes list 7 known issues. They include 5 untriaged dependency vulnerabilities (2 critical) and an unverified `BASE_PATH` base path. The deploy's HTTP 200 shows the site answers, but not that the assets load.

## Root causes

- **Gate waits:** gates are approved only when the Admin returns, and nothing prompts the Admin when a gate is ready. The 319.3-minute wait in Phase 6 is the clearest case.
- **Phase 5 duration:** the facts do not split the 328.9 non-waiting minutes by step. Assumption: most of it was CI queueing and polling, not generation, because the build cost only $0.62 and needed 0 fixes.
- **Test Report and Release Notes revisions:** these documents are written from evidence that is still incomplete. Examples are a CI run only on the PR merge ref and a live URL that comes only after Gate 7. First drafts likely overstated or left gaps that the review caught (4/7, 3/6).
- **Uncovered S7 criteria:** the backlog accepted layout and focus criteria that jsdom cannot test. No browser-level check exists in the template.
- **Vulnerabilities and base path:** the CI pipeline does not fail on `npm audit`. The Developer agent left `vite.config.js` unchanged, contrary to the SDD.

## Action items

| Action | Owner | Due |
|---|---|---|
| Run `npm audit` on the demo repo, triage the 2 critical and 1 high vulnerabilities, and pin fixes in the starter template | Developer agent | Before the next run |
| Open the live URL, confirm a conversion of `1` ft gives `30.48 cm`, then check the focus ring and the 375 px layout by hand | Admin | Before the next run |
| Confirm a green `ci.yml` run on `main` and record it against S8 | Admin | Before the next run |
| Make the deploy check fetch a JS asset as well as the index page, to verify the base path | Deployment agent | Before the next run |
| Add per-step timing inside Phase 5 (generation, CI queue, review) to the run facts, and explain how phase minutes relate to the run clock | Orchestrator | Before the next run |
| Notify the Admin when a gate is waiting for approval | Orchestrator | Before the next run |

## Process improvements for the next project

1. **Gate readiness alerts.** Send a notification when a gate is ready, and show the wait time on the dashboard. The target is to cut the 436.8 waiting minutes.
2. **Testable acceptance criteria at backlog time.** The Product Backlog agent should flag any criterion that jsdom cannot verify, such as layout or CSS focus. It should either reword the criterion or label it "manual check" before Gate 2, so code review can reach 7/7.
3. **Evidence-aware prompts for Phases 6 and 7.** Give the Test Report and Release Notes agents a fixed list of "pending until later gate" items, such as the CI run on `main` and the live URL. This should help them pass review on the first version, compared with 4/7 and 3/6 this time.
4. **Stricter build checks.** Add an `npm audit --audit-level=high` step to CI. Add a reviewer check that the `vite.config.js` base path matches the SDD.
5. **A browser smoke test in the template.** A single Playwright check at 375 px width after deployment would cover layout criteria that jsdom cannot test.
