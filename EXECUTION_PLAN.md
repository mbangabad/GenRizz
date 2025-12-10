# GenRizz Execution Plan (Mobile-First, Shared Core)

## Tracks (run in parallel where safe)
- **A. Core/Flags/Infra** (1–2 wks): extract `game-core` (types + mechanics), renderer registry, feature flags per game/mode, serverless wrappers for OpenAI/Resend, toasts, lazy routes, code-splitting.
- **B. Categories/Nav** (1 wk): add Daily (+ optional Events/Spotlight); move Link-Up/Timeline into Daily; keep Generational/Social/Personality/Comedy; stub Daily Drop + Roast Yourself.
- **C. Content Pipeline** (initial 2–3 wks, ongoing): unified question schema + validator; lint/dedupe/safety scripts; bulk static ingest to 18–36k items; weekly drip 500–1,000.
  - Optional: persist safety whitelist to Supabase (admin-managed) instead of localStorage/file if needed.
- **D. Modes/Overlays** (2–3 wks): Blitz, Rematch, Swipe/Hot Takes, Daily Drop (90–120s blended), capped rewarded ads (recovery/bonus only).
- **E. Polish/Events/Comedy** (1–2 wks): Roast Yourself (PG), weekly Events/Spotlight playlist (no pay-to-win booster), rival/share OG polish.
- **F. React Native App** (2–4 wks after A ready): RN client using shared core/catalogs; renderers (quiz/opinion/timeline/link-up); streak/quests/share/rematch/Daily Drop; Supabase/auth + thin API; minimal monetization parity.
  - RN consumption note: reuse JSON catalogs from `src/components/constants/questions/json/` and shared `game-core` helpers; expose a small JS SDK wrapper for question fetch/render mode mapping to keep RN parity with web.
  - See RN.md for quick pointers on consuming shared catalogs/core in RN.
- **G. QA/Release**: CI (lint/tests/content validator/build), manual smokes flags off/on, ads placement check, monitors (D1/D7, K-factor, ARPDAU, post-ad churn, Daily Drop completion, share/rematch CTR).

## Safety/Flags
- Flags: Blitz, Rematch, Swipe, Daily Drop, Ads, Events/Spotlight, Roast Yourself. **Default OFF.**
- Ads: rewarded only on recovery/bonus (heart refill, streak save, post-win double, post-quest bonus); cap ~3/day; cooldown ~15m; no banners/pre-roll; interstitial off by default. See ADS_GUARDRAILS.md; controlled by `FLAG_ADS_RECOVERY_ONLY` (default off); runtime guard in `src/services/ads.js`.
- Notifications: quiet hours + throttling.

## Content Targets
- Generational (5 games): ~12–15k.
- Social (3–4): ~4–5k.
- Personality/Comedy/Daily: ~3–5k.
- Daily Drop pool: 1–2k blended-eligible.
- Ongoing: +500–1,000/wk.
- Schema fields: id, game_id, category, type, prompt, options, correct_index, difficulty (1–20), tags, explanation, source, family_safe.

## Tone/Lexicon (apply globally)
- Positive: goated, based, valid, immaculate vibes, drip certified, aura immaculate.
- Friendly roast (PG): normie, mid, touch grass (jk), NPC energy, aura-farming, chronically online (lovingly), ok, normie!

## Worktrees/Branches (suggested)
- `infra-flags-core` (Track A)
- `categories-daily` (Track B)
- `content-pipeline` (Track C)
- `modes-overlays` (Track D)
- `polish-events-roast` (Track E)
- `mobile-rn` (Track F)
Merge order: A → B → C → D → E; RN in parallel after A.

## Immediate Next Steps
1) Create worktrees/branches for Tracks A/B (starting point main@HEAD).
2) Implement Track A: shared core/types + registry + flags + serverless wrappers + toasts/lazy routes (flags OFF).
3) Implement Track B: category metadata changes (Daily/Events), move Link-Up/Timeline, stub Daily Drop/Roast Yourself (flags OFF).
