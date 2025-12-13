## Pre-Beta Audit Report (in-progress)

- **Branch**: `audit/pre-beta-20251213`
- **Pre-audit rollback SHA**: `e7cf792a0032763e97c1c69c135ebe5d9d4f81ca`
- **Latest commits**:
  - `a11y: fix home landmarks and add axe check dependency`
  - `perf: gate supabase telemetry to avoid local 404s`
  - `test: stabilize nav link click and allow custom playwright port`

### Lighthouse (dev, LHCI autorun)
- Home: Perf **0.55**, A11y **1.00**, BP **0.78**, SEO **0.92**, PWA **0.88**
- Gameplay (gen-z-fluency): Perf **0.55**, A11y **0.68**, BP **0.74**, SEO **0.92**, PWA **1.00**
- Profile: Perf **0.55**, A11y **0.77**, BP **0.74**, SEO **0.92**, PWA **1.00**
- Reports saved in `.lighthouseci/` on this branch.

### Automated a11y
- `npm run test:a11y` (Home) → **0 violations** after fixes (aria labels, landmarks, viewport zoom).

### Playwright smoke (chromium, PORT=5180)
- All tests now **pass** (Home→Gameplay flows, login route, atomic interactions, journeys).

### Open follow-ups
- Performance scores are still low (FCP/LCP/main-thread). Plan: lazy-load heavy blocks, defer non-critical scripts, and trim main bundle.
- Manual/device validation still needed (iOS Safari/Android Chrome/PWA install).
- Production telemetry now requires `VITE_ENABLE_REMOTE_TELEMETRY=true` to emit Supabase events.

### Next
- Implement perf quick wins and rerun LHCI.
- Add device/PWA checks (record results in `KNOWN_ISSUES.md` if deferred).
