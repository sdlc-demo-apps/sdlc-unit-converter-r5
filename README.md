# SDLC starter

Starter template for apps built by the **SDLC Orchestrator** (POC #13/14). For each run, the orchestrator
creates a new public repo from this template in this organization, its agents build the app as a pull
request, CI runs the tests, and the Phase 7 Deploy decision publishes it to GitHub Pages.

- React 18 + Vite 5, Vitest 2 + Testing Library + jsdom.
- `.github/workflows/ci.yml` runs `npm ci`, `npm test` and `npm run build` on every PR and push to `main`.
- `.github/workflows/deploy-pages.yml` deploys `dist/` to GitHub Pages, on demand only. It sets `BASE_PATH`
  to `/<repo name>/`, so the same starter works for any repo name.

Don't change this template during a demo: every new run starts from it.
