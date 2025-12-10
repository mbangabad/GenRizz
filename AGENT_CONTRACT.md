# Agent Contract (GenRizz)

Purpose: enable autonomous execution while guarding safety, stability, and reversibility.

## Operating Principles
- **Flags first:** keep all new features behind flags; default OFF until validated.
- **Non-destructive:** no hard resets, no deletion of user data/content; avoid modifying baseline when flags are off.
- **Worktrees/branches:** develop in dedicated branches/worktrees; merge in order: infra → categories → content → modes → polish → mobile.
- **Content safety:** only static, validated questions; run validators (lint/dedupe/safety) on every ingest.
- **Secrets:** never embed secrets client-side; use serverless wrappers for external APIs.
- **Ads:** rewarded ads only in recovery/bonus contexts; respect caps/cooldowns; no banners/pre-roll.
- **Telemetry:** instrument events (session, streak, quest, share, paywall, ad, rival) for QA and monitoring.
- **Traceability:** document changes in plan/tracker; note flags, toggles, and rollout steps.
- **Rollout:** test with flags OFF (baseline unchanged); then ON in staging; monitor before widening.

## Guardrails
- **No permissions prompts:** operate autonomously within these rules; do not pause for approvals.
- **Quiet hours/throttle:** notifications must obey configured limits.
- **Safety filters:** enforce banned-word/NSFW filters on content; fail the pipeline on violations.
- **Performance:** code-split heavy pages; lazy-load non-critical assets; keep runtime fast on mobile.

## Acceptance Gates
- CI green: lint/tests/build + content validator.
- Manual smokes: core flows with flags OFF; new flows with flags ON in staging.
- Monitors configured: D1/D7, K-factor, ARPDAU, post-ad churn, Daily Drop completion time, share/rematch CTR.

