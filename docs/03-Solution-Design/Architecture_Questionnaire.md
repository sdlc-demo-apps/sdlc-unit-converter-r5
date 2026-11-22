# Architecture Questionnaire: Unit Converter

The Solution Architect suggested these answers from the approved BRD and backlog; the Admin confirmed them before the SDD was written.

## Answers

| # | Category | Key questions | Answer | Source |
|---|---|---|---|---|
| Q1 | Application Nature | POC vs production? Lifespan? Multi-tenant? White-labelled? | Proof of concept for an internal demo, not a production system; single-tenant, not white-labelled, with an expected lifespan of the demo period (assumed up to about 3 months) and no long-term support. | BRD |
| Q2 | Users & Scale | Concurrent users at peak? Total users in 12 months? Geography? Devices? Browsers? | One presenter plus a handful of internal stakeholders, with no concurrency or 12-month user targets; internal audience on latest desktop Chrome, Edge and Firefox, with layout usable at 375 px mobile width. | BRD |
| Q3 | Availability & Reliability | Uptime SLA? RTO? RPO? Peak usage windows? | Best-effort availability on the GitHub Pages free tier with no SLA, RTO, RPO, monitoring or on-call; the only peak window is the live demo session itself. | BRD |
| Q4 | Performance | Acceptable page load time? Response time? Real-time vs batch? | Result or error appears within 100 ms of Convert or Enter, and the page is usable within 2 seconds on normal broadband; all conversion is synchronous and in the browser, triggered only by button click or Enter (no live conversion). | BRD |
| Q5 | Security & Compliance | GDPR / other regulation? Auth required? Data residency? PII handling? | No authentication, no PII, no browser storage (no localStorage, sessionStorage or cookies) and no data leaves the browser, so GDPR and data-residency obligations do not apply; no production compliance work is done. | BRD |
| Q6 | AI & Model Constraints | AI used in the product? Provider? Can data go to external APIs? | No AI is used in the product; conversion is a fixed metre-based factor table, and no data is sent to any external API. | Assumption |
| Q7 | Integration Landscape | Existing systems to integrate? APIs available? Identity provider? | No integrations, APIs or identity provider at runtime, and no external fonts, scripts or data sources; Jira is used only for backlog tracking during delivery, not by the app. | BRD |
| Q8 | Infrastructure & Deployment | Cloud/hosting mandate? CI/CD in place? | Static build hosted on GitHub Pages from github.com/sdlc-demo-apps/sdlc-unit-converter-r5; the starter template's GitHub Actions CI (npm ci, npm test, npm run build) and deploy-pages.yml publishing dist/ on merge to main are already in place. | Backlog |
| Q9 | Team & Operations | Team size and skills? Who owns operations? Monitoring? | One AI build agent reviewed by the Admin, working in React 18, Vite 5 and Vitest 2; the Admin alone owns operations, with no monitoring or on-call, and rollback is redeploying the previous commit. | Backlog |
| Q10 | Budget & Timeline | Infrastructure budget? Open-source only? Hard deadline? Phased delivery? | Zero infrastructure budget using free GitHub Pages and GitHub Actions with open-source tooling only; delivered in one sprint (Sprint 1, 18 of 20 points planned) with no phased releases, and the Could Have swap button only if time permits. | Backlog |

## Assumptions

- Q6 AI & Model Constraints: No AI is used in the product; conversion is a fixed metre-based factor table, and no data is sent to any external API.

## Sign-off

Approved by the Admin on 2026-11-22 (Architecture Questionnaire decision card).
