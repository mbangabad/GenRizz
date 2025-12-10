import { supabase } from '@/lib/supabase'
import { isFlagEnabled } from './flags'
import mockSpotlight from '@/components/constants/events/mockSpotlight.json'
import mockDailyDrop from '@/components/constants/events/mockDailyDrop.json'

const TABLE = import.meta.env.VITE_EVENTS_TABLE || 'events_playlist'

const canUseRemote = () => Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)

export const fetchSpotlightPlaylists = async () => {
  if (!isFlagEnabled('EVENTS')) return []
  if (!canUseRemote()) return mockSpotlight
  try {
    const { data, error } = await supabase.from(TABLE).select('*').eq('active', true).order('start_date', { ascending: false })
    if (error) throw error
    return (data && data.length ? data : mockSpotlight) || []
  } catch (e) {
    console.warn('Spotlight fetch failed:', e.message)
    return mockSpotlight
  }
}

export const fetchDailyDropConfig = async () => {
  if (!isFlagEnabled('DAILY_DROP')) return null
  if (!canUseRemote()) return mockDailyDrop
  try {
    const { data, error } = await supabase.from('daily_drop').select('*').eq('active', true).limit(1).maybeSingle?.()
    // fallback if maybeSingle unavailable in mock
    const record = data?.[0] || data
    if (error) throw error
    return record || mockDailyDrop
  } catch (e) {
    console.warn('Daily Drop fetch failed:', e.message)
    return mockDailyDrop
  }
}
