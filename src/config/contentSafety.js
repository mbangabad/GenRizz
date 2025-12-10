// Centralized content safety terms used across validator and admin UI.
// Keep language family-friendly; defaults err on caution.

export const HARD_BANNED_DEFAULT = ['fuck', 'porn', 'suicide', 'sex', 'shit', 'racist']
export const SOFT_BANNED_DEFAULT = [] // add lighter terms here if you want warn-only
export const DEFAULT_WHITELIST = [] // terms allowed even if they appear in hard/soft lists

export const getSafetyConfig = () => ({
  hard: [...HARD_BANNED_DEFAULT],
  soft: [...SOFT_BANNED_DEFAULT],
  whitelist: [...DEFAULT_WHITELIST],
})

