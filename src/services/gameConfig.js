import { supabase } from '@/lib/supabase'
import { GAMES } from '@/components/constants/games'

const canUseSupabase = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

let cache = null

export const fetchGameConfigs = async () => {
  if (!canUseSupabase()) return {}
  try {
    const { data, error } = await supabase.from('game_configs').select('*').eq('active', true)
    if (error) throw error
    cache = data || []
    return data.reduce((map, row) => {
      map[row.game_id] = row.config || {}
      return map
    }, {})
  } catch (e) {
    console.warn('game_configs fetch failed', e.message)
    return {}
  }
}

export const mergeGameConfig = (gameId) => {
  const overrides = cache?.find?.((c) => c.game_id === gameId)?.config
  if (!overrides) return GAMES[gameId]
  return { ...GAMES[gameId], ...overrides }
}
