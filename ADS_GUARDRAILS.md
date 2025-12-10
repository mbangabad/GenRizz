# Ads Guardrails (rewarded only)

- Ads must only show in recovery/bonus contexts: heart refill, streak save, post-win double, post-quest bonus.
- No banners, no pre-roll/interstitial; no ads during gameplay flow.
- Cap exposures: ~3/day/user; cooldown ~15 minutes between rewarded placements.
- Controlled by `FLAG_ADS_RECOVERY_ONLY`; default OFF.
- When enabled, log placements and outcomes to monitor churn.

## Runtime guard (to implement)
- Allow ad calls only when `FLAG_ADS_RECOVERY_ONLY` is true.
- Enforce placement type: recovery/bonus only.
- Track count per day and cooldown window; block if exceeded.
