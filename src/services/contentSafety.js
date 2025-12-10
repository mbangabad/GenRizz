import { HARD_BANNED_DEFAULT, SOFT_BANNED_DEFAULT, DEFAULT_WHITELIST } from '@/config/contentSafety'
import { supabase } from '@/lib/supabase'

const LOCAL_KEY = 'contentSafetyWhitelist'
const TABLE = import.meta.env.VITE_CONTENT_SAFETY_TABLE || 'content_safety_whitelist'

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const readLocalWhitelist = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const persistLocalWhitelist = (list) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list))
  } catch {
    /* ignore storage errors */
  }
}

export const getEffectiveSafetyLists = () => {
  const local = readLocalWhitelist()
  const whitelist = Array.from(new Set([...DEFAULT_WHITELIST, ...local]))
  return {
    hard: [...HARD_BANNED_DEFAULT],
    soft: [...SOFT_BANNED_DEFAULT],
    whitelist,
  }
}

export const syncWhitelistFromRemote = async () => {
  if (!canUseSupabase()) return { ok: false, source: 'local', whitelist: readLocalWhitelist(), message: 'Supabase env missing' }
  try {
    const { data, error } = await supabase.from(TABLE).select('term').eq('active', true)
    if (error) throw error
    const remote = (data || []).map((row) => String(row.term || '').toLowerCase()).filter(Boolean)
    persistLocalWhitelist(remote)
    const merged = getEffectiveSafetyLists()
    return { ok: true, source: 'supabase', whitelist: merged.whitelist }
  } catch (e) {
    console.warn('Whitelist remote fetch failed:', e)
    return { ok: false, source: 'local', whitelist: readLocalWhitelist(), message: e.message }
  }
}

export const syncWhitelistToRemote = async () => {
  if (!canUseSupabase()) return { ok: false, source: 'local', whitelist: readLocalWhitelist(), message: 'Supabase env missing' }
  try {
    const whitelist = readLocalWhitelist()
    // Upsert terms into table; expects schema { term: text, active: boolean }
    const rows = whitelist.map((term) => ({ term, active: true }))
    const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: 'term' })
    if (error) throw error
    return { ok: true, source: 'supabase', whitelist }
  } catch (e) {
    console.warn('Whitelist remote push failed:', e)
    return { ok: false, source: 'local', whitelist: readLocalWhitelist(), message: e.message }
  }
}

export const addWhitelistTerm = (term) => {
  if (!term) return getEffectiveSafetyLists()
  const trimmed = term.trim().toLowerCase()
  if (!trimmed) return getEffectiveSafetyLists()
  const local = readLocalWhitelist()
  if (!local.includes(trimmed)) {
    const updated = [...local, trimmed]
    persistLocalWhitelist(updated)
  }
  return getEffectiveSafetyLists()
}

export const removeWhitelistTerm = (term) => {
  const local = readLocalWhitelist().filter(t => t !== term)
  persistLocalWhitelist(local)
  return getEffectiveSafetyLists()
}
