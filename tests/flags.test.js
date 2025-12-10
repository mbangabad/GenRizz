import { describe, it, expect, beforeEach } from 'vitest'
import { initializeFlags, setFlagOverride, clearFlagOverride, clearAllFlagOverrides, getFlags } from '@/services/flags'

describe('feature flags overrides', () => {
  beforeEach(() => {
    clearAllFlagOverrides()
    initializeFlags()
  })

  it('sets and reads an override', () => {
    setFlagOverride('BLITZ', true)
    const flags = getFlags()
    expect(flags.BLITZ).toBe(true)
  })

  it('clears a single override', () => {
    setFlagOverride('BLITZ', true)
    clearFlagOverride('BLITZ')
    const flags = getFlags()
    expect(flags.BLITZ).toBe(false)
  })

  it('clears all overrides', () => {
    setFlagOverride('BLITZ', true)
    setFlagOverride('REMATCH', true)
    clearAllFlagOverrides()
    const flags = getFlags()
    expect(flags.BLITZ).toBe(false)
    expect(flags.REMATCH).toBe(false)
  })
})
