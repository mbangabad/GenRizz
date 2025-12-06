/**
 * Haptic Feedback Utility
 * Provides vibration feedback for mobile devices
 * Works with PWA (Vibration API) and can be enhanced with Capacitor
 */

// Check if vibration is supported
const isVibrationSupported = () => {
  return 'vibrate' in navigator;
};

// Check if device is mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Play haptic feedback
 * @param {string} type - 'success', 'error', 'warning', 'light', 'medium', 'heavy', 'selection'
 * @param {number} duration - Custom duration in ms (optional)
 */
export const haptic = (type = 'light', duration = null) => {
  if (!isMobile() || !isVibrationSupported()) {
    return; // Silently fail on desktop
  }

  // Get haptic preference from localStorage
  const hapticEnabled = localStorage.getItem('genrizz-haptic') !== 'false';
  if (!hapticEnabled) return;

  try {
    let pattern;

    switch (type) {
      case 'success':
      case 'correct':
        // Short double pulse - feels like a success
        pattern = [10, 50, 10];
        break;
      
      case 'error':
      case 'incorrect':
        // Longer single pulse - feels like an error
        pattern = [50];
        break;
      
      case 'warning':
        // Medium pulse
        pattern = [30];
        break;
      
      case 'light':
        // Very light tap
        pattern = [10];
        break;
      
      case 'medium':
        // Medium tap
        pattern = [20];
        break;
      
      case 'heavy':
        // Strong tap
        pattern = [40];
        break;
      
      case 'selection':
        // Quick tap for UI selection
        pattern = [5];
        break;
      
      case 'streak':
        // Celebration pattern - multiple pulses
        pattern = [10, 30, 10, 30, 10];
        break;
      
      case 'levelUp':
        // Long celebration pattern
        pattern = [20, 50, 20, 50, 20, 50];
        break;
      
      default:
        pattern = duration || [10];
    }

    // Use custom duration if provided
    if (duration && typeof duration === 'number') {
      pattern = [duration];
    }

    navigator.vibrate(pattern);
  } catch (error) {
    // Silently fail if vibration is not available
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Enhanced haptic with Capacitor (if available)
 * Falls back to Vibration API if Capacitor is not installed
 */
export const hapticImpact = async (style = 'light') => {
  // Try Capacitor first (for native apps)
  if (window.Capacitor?.Plugins?.Haptics) {
    try {
      const { Haptics } = window.Capacitor.Plugins;
      const ImpactStyle = {
        light: 'Light',
        medium: 'Medium',
        heavy: 'Heavy',
      };
      
      await Haptics.impact({
        style: ImpactStyle[style] || 'Light',
      });
      return;
    } catch (error) {
      console.debug('Capacitor haptics not available, falling back to Vibration API');
    }
  }

  // Fallback to Vibration API
  haptic(style);
};

/**
 * Haptic notification
 */
export const hapticNotification = async (type = 'success') => {
  // Try Capacitor first
  if (window.Capacitor?.Plugins?.Haptics) {
    try {
      const { Haptics } = window.Capacitor.Plugins;
      const NotificationType = {
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
      };
      
      await Haptics.notification({
        type: NotificationType[type] || 'Success',
      });
      return;
    } catch (error) {
      console.debug('Capacitor haptics not available, falling back to Vibration API');
    }
  }

  // Fallback to Vibration API
  haptic(type);
};

/**
 * Toggle haptic feedback
 */
export const toggleHaptic = () => {
  const current = localStorage.getItem('genrizz-haptic');
  const newValue = current === 'false' ? 'true' : 'false';
  localStorage.setItem('genrizz-haptic', newValue);
  return newValue === 'true';
};

/**
 * Check if haptic is enabled
 */
export const isHapticEnabled = () => {
  return localStorage.getItem('genrizz-haptic') !== 'false';
};

// Export convenience functions
export const hapticSuccess = () => haptic('success');
export const hapticError = () => haptic('error');
export const hapticWarning = () => haptic('warning');
export const hapticLight = () => haptic('light');
export const hapticMedium = () => haptic('medium');
export const hapticHeavy = () => haptic('heavy');
export const hapticSelection = () => haptic('selection');
export const hapticStreak = () => haptic('streak');
export const hapticLevelUp = () => haptic('levelUp');

