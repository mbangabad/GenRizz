import { describe, it, expect, vi } from 'vitest'
import { fetchSpotlightPlaylists, fetchDailyDropConfig } from '@/services/events'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ order: () => ({ data: null, error: null }) }) }),
      maybeSingle: () => ({ data: null, error: null }),
    }),
  },
}))

describe('events service fallbacks', () => {
  it('returns mock spotlight when Supabase unavailable', async () => {
    const res = await fetchSpotlightPlaylists()
    expect(res.length).toBeGreaterThan(0)
  })

  it('returns mock daily drop when Supabase unavailable', async () => {
    const res = await fetchDailyDropConfig()
    expect(res).toBeTruthy()
  })
})
