## Known Issues / Pending Verification

- **Performance**: Lighthouse perf ~0.55 on dev (FCP/LCP/main-thread). Needs lazy-loading and bundle trim before beta.
- **Device/PWA**: Real iOS Safari, Android Chrome, and “Add to Home Screen” not yet exercised. Requires manual verification.
- **Content telemetry**: Supabase events/errors now gated by `VITE_ENABLE_REMOTE_TELEMETRY`; ensure it is set in prod to capture analytics.
- **Game category density**: E2E “Power user navigates categories” logs 0 categories (locator heuristic). Confirm real UI coverage in manual smoke.
