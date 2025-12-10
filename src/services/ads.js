import { isFlagEnabled } from './flags'

const EXPOSURE_LIMIT = 3
const COOLDOWN_MINUTES = 15
const STORAGE_KEY = 'adsRecoveryMeta'
let recoveryAdProvider = null

const readMeta = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { count: 0, lastShown: 0 }
  } catch {
    return { count: 0, lastShown: 0 }
  }
}

const writeMeta = (meta) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
  } catch {
    /* ignore */
  }
}

export const canShowRecoveryAd = () => {
  if (!isFlagEnabled('ADS_RECOVERY_ONLY')) return false
  const meta = readMeta()
  const now = Date.now()
  const minutesSince = (now - (meta.lastShown || 0)) / 1000 / 60
  if (meta.count >= EXPOSURE_LIMIT && minutesSince < 24 * 60) return false
  if (minutesSince < COOLDOWN_MINUTES) return false
  return true
}

export const recordRecoveryAdShown = () => {
  const meta = readMeta()
  const now = Date.now()
  const minutesSince = (now - (meta.lastShown || 0)) / 1000 / 60
  const sameDayCount = minutesSince < 24 * 60 ? (meta.count || 0) + 1 : 1
  writeMeta({ count: sameDayCount, lastShown: now })
}

export const getRecoveryAdStatus = () => {
  const meta = readMeta()
  const now = Date.now()
  const minutesSince = (now - (meta.lastShown || 0)) / 1000 / 60
  const withinDay = minutesSince < 24 * 60
  const dailyUsed = withinDay ? meta.count || 0 : 0
  const cooldownRemaining = Math.max(0, COOLDOWN_MINUTES - minutesSince)
  const dailyRemaining = Math.max(EXPOSURE_LIMIT - dailyUsed, 0)

  return {
    enabled: isFlagEnabled('ADS_RECOVERY_ONLY'),
    cooldownMinutesRemaining: Math.ceil(cooldownRemaining),
    dailyRemaining,
    lastShown: meta.lastShown || 0,
    limit: EXPOSURE_LIMIT,
  }
}

// Stub placement guard to wrap any ad SDK call
export const showRecoveryAdIfAllowed = async (showAdFn) => {
  if (!canShowRecoveryAd()) {
    return { shown: false, reason: 'guard_blocked' }
  }
  try {
    await showAdFn()
    recordRecoveryAdShown()
    return { shown: true }
  } catch (e) {
    return { shown: false, reason: e?.message || 'ad_error' }
  }
}

export const registerRecoveryAdHandler = (handler) => {
  recoveryAdProvider = handler
}

export const requestRecoveryAd = async () => {
  return showRecoveryAdIfAllowed(async () => {
    if (recoveryAdProvider) {
      await recoveryAdProvider()
    } else {
      // fallback mock to avoid crashes during dev
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  })
}
