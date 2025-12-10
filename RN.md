# React Native consumption (shared core/catalogs)

- Use the JSON catalogs in `src/components/constants/questions/json/` as the source of truth; bundle or fetch them as static assets in RN.
- Reuse `src/game-core` (types/registry/mechanics) to map `gameMode` → renderer; register RN renderers similarly to web.
- Keep feature flags consistent: mirror `src/config/featureFlags.js` in RN; expose a tiny JS module for overrides if needed.
- Wire the same schema fields: `id, game_id, category, type, prompt, options, correct_index, difficulty, tags, explanation, source, family_safe`.
- For Daily Drop/Spotlight, use the same mock JSON structure (or Supabase later) to keep parity.
- Ship a thin SDK: export helpers to fetch questions by game, by difficulty, and to compute tiers/scores using `src/game-core/mechanics.js`.
- Mode → renderer mapping (web):
  - quiz → `Gameplay` default renderer
  - opinion → opinion renderer (swipe/tap)
  - timeline → `TimelineRenderer`
  - connection → `ConnectionRenderer`
  - personality → `PersonalityGameplay`
  Mirror this mapping in RN renderers to stay in sync.
