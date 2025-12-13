## Pre-Beta Checklist (current)

- [x] Phase 0 safety checkpoint (branch pushed, rollback SHA recorded)
- [x] A11y sweep (Home via `npm run test:a11y`) → 0 violations
- [x] LHCI autorun (Home, Gameplay, Profile) → reports in `.lighthouseci/`
- [x] Playwright smoke (chromium, PORT=5180) → all passing
- [ ] Performance tuning for LCP/FCP (pending)
- [ ] Manual device checks (iOS Safari, Android Chrome, PWA install) — requires manual verification
- [ ] Final PR packaging after perf/device passes
