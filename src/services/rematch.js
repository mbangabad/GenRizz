import { createPageUrl } from '@/utils'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'rematchChallenges'
const REMATCH_TABLE = import.meta.env.VITE_REMATCH_TABLE || 'rematch_challenges'
const supabaseEnabled = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeStore = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

const generateChallengeId = () => `ch_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`

const sanitizeStore = (challenges = []) => {
  const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 14 // 14 days
  return challenges.filter((c) => (c.createdAt || 0) >= cutoff).slice(0, 50)
}

const persistRemoteChallenge = async (challenge) => {
  if (!supabaseEnabled) return
  try {
    await supabase.from(REMATCH_TABLE).upsert({
      id: challenge.id,
      game_id: challenge.gameId,
      challenger_id: challenge.challengerId,
      challenger_name: challenge.challengerName,
      challenger_score: challenge.challengerScore,
      status: challenge.status || 'pending',
      responses: challenge.responses || [],
    })
  } catch (e) {
    console.warn('Rematch remote upsert failed', e.message || e)
  }
}

const persistRemoteResponse = async ({ challengeId, response, gameId }) => {
  if (!supabaseEnabled || !challengeId) return
  try {
    const { data } = await supabase
      .from(REMATCH_TABLE)
      .select('responses')
      .eq('id', challengeId)
      .maybeSingle()
    const responses = Array.isArray(data?.responses) ? data.responses : []
    const nextResponses = [...responses, response].slice(-20)
    await supabase.from(REMATCH_TABLE).upsert({
      id: challengeId,
      game_id: gameId,
      responses: nextResponses,
      responder_id: response.responderId,
      responder_name: response.responderName,
      responder_score: response.responderScore,
      status: 'responded',
    })
  } catch (e) {
    console.warn('Rematch response upsert failed', e.message || e)
  }
}

export const buildRematchLink = ({ gameId, percentage, user, challengeId }) => {
  if (!gameId || !user) return null
  const base = import.meta.env.VITE_APP_URL || window.location.origin
  const cid = challengeId || generateChallengeId()
  return `${base}${createPageUrl('Gameplay')}?gameId=${gameId}&challengeId=${cid}&challengerId=${user.id}&challengerName=${encodeURIComponent(user.full_name || 'Friend')}&challengerScore=${percentage}`
}

export const createRematchChallenge = ({ gameId, percentage, user }) => {
  if (!gameId || !user) return null
  const challengeId = generateChallengeId()
  const link = buildRematchLink({ gameId, percentage, user, challengeId })
  const payload = {
    id: challengeId,
    gameId,
    challengerId: user.id,
    challengerName: user.full_name || 'Friend',
    challengerScore: percentage,
    createdAt: Date.now(),
    responses: [],
    status: 'pending',
  }

  const store = sanitizeStore(readStore())
  writeStore([payload, ...store.filter((c) => c.id !== challengeId)])
  persistRemoteChallenge(payload)

  return { link, challengeId, challenge: payload }
}

export const recordRematchResult = ({ challengeId, responderId, responderName, responderScore, gameId }) => {
  if (!challengeId) return null
  const store = sanitizeStore(readStore())
  const idx = store.findIndex((c) => c.id === challengeId)
  const result = {
    responderId: responderId || 'anon',
    responderName: responderName || 'Friend',
    responderScore: responderScore ?? null,
    respondedAt: Date.now(),
  }

  if (idx >= 0) {
    const existing = store[idx]
    const updated = {
      ...existing,
      gameId: existing.gameId || gameId,
      responses: [...(existing.responses || []), result],
      status: 'responded',
    }
    store[idx] = updated
    writeStore(store)
    persistRemoteResponse({ challengeId, response: result, gameId: updated.gameId })
    return updated
  }

  const payload = {
    id: challengeId,
    gameId,
    challengerId: null,
    challengerName: 'Friend',
    challengerScore: null,
    createdAt: Date.now(),
    responses: [result],
    status: 'responded',
  }
  writeStore([payload, ...store])
  persistRemoteResponse({ challengeId, response: result, gameId })
  return payload
}

export const listRematchChallenges = async (userId) => {
  if (supabaseEnabled && userId) {
    try {
      const { data, error } = await supabase
        .from(REMATCH_TABLE)
        .select('*')
        .or(`challenger_id.eq.${userId},responder_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(20)
      if (error) throw error
      const normalized = (data || []).map((row) => ({
        id: row.id,
        gameId: row.game_id,
        challengerId: row.challenger_id,
        challengerName: row.challenger_name,
        challengerScore: row.challenger_score,
        responderId: row.responder_id,
        responderName: row.responder_name,
        responderScore: row.responder_score,
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
        status: row.status || 'pending',
        responses: row.responses || [],
      }))
      return normalized
    } catch (e) {
      console.warn('Rematch history fetch failed, using local store', e.message || e)
    }
  }
  const local = sanitizeStore(readStore())
  if (!userId) return local
  return local.filter((c) => c.challengerId === userId || c.responses?.some((r) => r.responderId === userId))
}

export const parseRematchParams = () => {
  const usp = new URLSearchParams(window.location.search)
  const challengerId = usp.get('challengerId')
  const challengerName = usp.get('challengerName')
  const challengerScore = usp.get('challengerScore')
  const gameId = usp.get('gameId')
  const challengeId = usp.get('challengeId')
  if (!challengerId || !challengerScore || !gameId) return null
  return {
    challengerId,
    challengerName: challengerName || 'Friend',
    challengerScore: parseInt(challengerScore, 10),
    gameId,
    challengeId,
  }
}
