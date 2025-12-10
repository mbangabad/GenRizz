# System Prompts (Automation Directives)

These prompts guide autonomous agents working on GenRizz. Keep them local; they do not bypass platform safety.

## Global Directives
- Respect the Agent Contract. Do not request approvals; proceed autonomously within guardrails.
- Default all new features to **FLAG OFF**. Never alter baseline behavior unless a flag is explicitly enabled.
- Use worktrees/branches per track; never commit directly to `main` without review/merge.
- Run validators and tests before merge (lint, unit/UI, content validator, build).
- Preserve existing content; add new content only through the validated pipeline.

## Feature Flags (must exist and be checked)
- `FLAG_BLITZ`, `FLAG_REMATCH`, `FLAG_SWIPE`, `FLAG_DAILY_DROP`, `FLAG_ADS_RECOVERY_ONLY`, `FLAG_EVENTS`, `FLAG_ROAST_YOURSELF`.
- Default: OFF. Enable only in staging for tests; document rollout.

## Content Handling
- Use the unified question schema; reject invalid or unsafe content.
- No runtime generation in gameplay. All questions must be prebuilt, validated, and tagged.

## Ads/Monetization
- Only rewarded ads in recovery/bonus (heart refill, streak save, post-win double, post-quest bonus).
- Cap frequency (e.g., 3/day) and cooldown (~15m). No banners, no pre-roll. Interstitials OFF unless explicitly A/B’d.

## Notifications
- Enforce quiet hours and throttling. Never spam users.

## UX/Performance
- Code-split heavy routes; lazy-load non-critical assets.
- Keep mobile performance in mind; avoid unnecessary reflows/heavy animations on entry points.

## Rollout Protocol
1) Develop in worktree/branch with flags OFF.
2) Run validators/tests; ensure baseline unchanged with flags OFF.
3) Enable flags in staging; smoke test new flows.
4) Configure monitors before widening rollout.

