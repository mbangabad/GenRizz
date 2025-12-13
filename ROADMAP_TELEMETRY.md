# Telemetry & Analytics Roadmap / TODO

## Remaining instrumentation
- Gameplay
  - Emit `question_answered` (correct/incorrect, timeRemaining, questionId, type) for finer funnel and timing analysis.
  - Emit `powerup_used` events (type, questionIndex) when power-ups triggered.
  - Emit `share/rematch` success/failure for post-game actions.
- Daily Drop
  - Emit `daily_drop_complete` from Home pack flow (currently only from Gameplay when `daily` flag present).
  - Emit `daily_drop_impression` when shown in hero and `daily_drop_cta` when opened.
- Battle Arena
  - Emit `battle_arena_result` with outcome (win/lose/draw), duration, accuracy.
- Invites/Referrals
  - Emit `invite_link_copy`, `invite_link_share`, `invite_link_open`, `invite_link_signup` (wire to auth flow), and `referral_reward_claimed`.
- Spotlight/Events
  - Emit `spotlight_card_click` per card; add `events_playlist_refresh` events when playlists update.
- Ads/Monetization
  - Emit `ad_request`, `ad_show`, `ad_error` with placement/reason; extend `purchase_intent` and `purchase_cancel` events.
- Social
  - Emit `challenge_sent`, `challenge_accepted`, `challenge_result`; `friend_request_sent/accepted` already covered as invites.

## Backend & rollups
- Add materialized views for:
  - Retention cohorts (D1/D7/D30) based on `screen_view`/`game_start` events.
  - ARPDAU/ARPpu and conversion funnel (intent → complete) from `events` + `purchases`.
  - Mode usage (quiz/blitz/swipe/rematch/daily_drop/battle_arena) from `events.props`.
- Add scheduled jobs to refresh views nightly.

## Admin/Analytics UI
- Add retention/ARPDAU charts to Analytics tab (fetch from views).
- Add event explorer with preset filters (e.g., `game_complete`, `daily_drop_complete`, `battle_arena_result`).
- Add errors widget (last 10 from `errors`) and link to full log.
- Add audit log search/filter by action/user.

## Error logging
- Pipe ErrorBoundary errors already; extend to network fetch failures and Supabase RPC errors with page/meta.

## Config/Flags
- Apply `game_configs` overrides on client (already loading); surface a “Config” tab in GameManager to edit values and test toggles.

## Beta access / invite codes
- Use existing Admin > Invites to generate codes; add CTA to bulk-generate N codes and export CSV.
