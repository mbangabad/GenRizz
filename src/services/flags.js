import { FEATURE_FLAGS } from '@/config/featureFlags'

// This module allows a single initialization call and accessors for feature flags.
// It keeps defaults OFF; env overrides are applied via FEATURE_FLAGS.

let initialized = false
let flags = { ...FEATURE_FLAGS }
const OVERRIDE_KEY = 'featureFlagOverrides'

const readOverrides = () => {
  try {
    const raw = localStorage.getItem(OVERRIDE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

const persistOverrides = (overrides) => {
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides))
  } catch {
    /* ignore */
  }
}

export function initializeFlags() {
  if (initialized) return
  flags = { ...FEATURE_FLAGS, ...readOverrides() }
  initialized = true
}

export function isFlagEnabled(key) {
  return Boolean(flags[key])
}

export function getFlags() {
  return { ...flags }
}

export function setFlagOverride(key, value) {
  const overrides = { ...readOverrides(), [key]: Boolean(value) }
  persistOverrides(overrides)
  flags = { ...FEATURE_FLAGS, ...overrides }
  return getFlags()
}

export function clearFlagOverride(key) {
  const overrides = readOverrides()
  delete overrides[key]
  persistOverrides(overrides)
  flags = { ...FEATURE_FLAGS, ...overrides }
  return getFlags()
}

export function clearAllFlagOverrides() {
  persistOverrides({})
  flags = { ...FEATURE_FLAGS }
  return getFlags()
}

export function getFlagOverrides() {
  return readOverrides()
}
