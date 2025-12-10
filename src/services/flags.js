import { FEATURE_FLAGS } from '@/config/featureFlags'
import { supabase } from '@/lib/supabase'

// This module allows a single initialization call and accessors for feature flags.
// It keeps defaults OFF; env overrides are applied via FEATURE_FLAGS.

let initialized = false
let flags = { ...FEATURE_FLAGS }
const OVERRIDE_KEY = 'featureFlagOverrides'
const REMOTE_TABLE = import.meta.env.VITE_FEATURE_FLAGS_TABLE || 'feature_flags'

const canUseSupabase = () =>
  Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

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

/**
 * Remote flag helpers (Supabase). All operations are best-effort and fall back to local overrides.
 */
export async function fetchRemoteFlags() {
  if (!canUseSupabase()) return { ok: false, source: 'local', flags: getFlags(), message: 'Supabase env missing' }
  try {
    const { data, error } = await supabase.from(REMOTE_TABLE).select('key,value')
    if (error) throw error
    const remote = {}
    ;(data || []).forEach((row) => {
      if (row?.key) remote[row.key] = Boolean(row.value)
    })
    // Merge precedence: env defaults < remote < local overrides
    flags = { ...FEATURE_FLAGS, ...remote, ...readOverrides() }
    return { ok: true, source: 'supabase', flags: getFlags() }
  } catch (e) {
    console.warn('Flag fetch failed:', e.message)
    return { ok: false, source: 'local', flags: getFlags(), message: e.message }
  }
}

export async function pushRemoteFlags() {
  if (!canUseSupabase()) return { ok: false, source: 'local', flags: getFlags(), message: 'Supabase env missing' }
  try {
    const rows = Object.entries(getFlags()).map(([key, value]) => ({ key, value: Boolean(value) }))
    const { error } = await supabase.from(REMOTE_TABLE).upsert(rows, { onConflict: 'key' })
    if (error) throw error
    return { ok: true, source: 'supabase', flags: getFlags() }
  } catch (e) {
    console.warn('Flag push failed:', e.message)
    return { ok: false, source: 'local', flags: getFlags(), message: e.message }
  }
}
