import { showRecoveryAdIfAllowed } from './ads'

// Example usage placeholder; wire actual ad SDK calls here.
export const tryShowRecoveryAd = async ({ placement }) => {
  return showRecoveryAdIfAllowed(async () => {
    // TODO: call real ad SDK for rewarded ad at placement
    console.log('Showing ad at placement:', placement)
  })
}
