## Native Beta Plan (iOS TestFlight / Android Internal Testing)

### Options
1) **Capacitor wrap around current web app (fastest)**
   - Pros: Reuse web code; minimal rewrite; quick to TestFlight/Play Internal; keeps PWA parity.
   - Cons: WebView performance; App Store review may scrutinize “wrapper” apps; push/notifications need native plugins; large JS bundle still impacts perf.
   - Steps:
     1. Add Capacitor to project, configure bundle id/app name/icons/splash.
     2. Build web assets (`npm run build`), copy to `ios/` and `android/`.
     3. Add minimal native config: status bar color, orientation, deeplinks.
     4. Implement native plugins as needed (push, share, file).
     5. iOS: open Xcode, set signing, archive → TestFlight internal test; Android: generate AAB, upload to Play Internal/Closed testing.

2) **Expo (React Native) shell with WebView (middle-ground)**
   - Pros: Easier build pipeline (EAS); OTA updates; can incrementally move UI native over time; better native module ecosystem than pure Capacitor.
   - Cons: Still a WebView for now; partial rewrite later if moving off web; EAS accounts/config needed.
   - Steps:
     1. Create Expo app; use `WebView` pointing to bundled build or remote URL with offline cache.
     2. Configure deeplinks, push (Expo Notifications), analytics.
     3. EAS build for iOS/Android; distribute via TestFlight / Play Internal.

3) **Full React Native / Flutter (rewrite)**
   - Pros: Best native UX/perf; full access to platform features; lighter bundles.
   - Cons: Largest lift; feature parity effort; content/game logic needs port.
   - Steps (RN): new RN app, reimplement screens/modes, reuse services in TS where possible; set up navigation, state, auth; build/distribute via TestFlight/Play.

### Recommended path (pragmatic)
- Start with **Capacitor** to ship TestFlight + Play Internal quickly.
- Keep PWA live for web; share core content and feature flags.
- If traction warrants, plan a staged RN/Flutter rebuild of the gameplay shell later.

### Minimal Capacitor action list
1) `npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
2) `npx cap init com.yourco.genrizz "GenRizz"`
3) Configure `capacitor.config.ts`: server URL (prod) or load local `dist` for offline, allowNavigation for your domains.
4) `npm run build && npx cap copy`
5) iOS: `npx cap open ios` → set signing/team → archive → TestFlight (Internal).
6) Android: `npx cap open android` → set appId/versionCode → build AAB → Play Console Internal testing.
7) Add splash/icons (adaptive) and review store metadata (age rating, privacy).
8) Implement deeplinks/rematch links via Capacitor config and native URL types/intent-filters.

### Android “TestFlight” equivalents
- Google Play **Internal testing** (up to 100 testers) or **Closed testing** (larger cohorts).
- Alternative: **Firebase App Distribution** for direct APK/AAB sharing (outside Play).

### Ongoing
- Use feature flags to keep experimental modes off in native if needed.
- Keep PWA install prompts for fast iteration; native builds for reach and push.
