// Anonymous User Tracking Service
// Tracks anonymous users and their analysis count using localStorage with fallbacks

const ANONYMOUS_USER_KEY = 'gtr_anonymous_user';
const ANONYMOUS_ANALYSIS_LIMIT = 3; // 3 free analyses (receipts) for anonymous users

// Fallback storage for when localStorage is unavailable
let fallbackStorage = {};

// Check if localStorage is available and working
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    // Test localStorage functionality with multiple attempts
    const testKey = '__localStorage_test__';
    const testValue = 'test_' + Date.now();
    
    // Try to set, get, and remove
    window.localStorage.setItem(testKey, testValue);
    const retrieved = window.localStorage.getItem(testKey);
    window.localStorage.removeItem(testKey);
    
    // Verify the value was actually stored and retrieved
    if (retrieved !== testValue) {
      console.warn('localStorage test failed: value mismatch');
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return false;
  }
};

// Safe localStorage operations with fallback
const safeGetItem = (key) => {
  if (isLocalStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed, using fallback:', error);
      return fallbackStorage[key] || null;
    }
  }
  return fallbackStorage[key] || null;
};

const safeSetItem = (key, value) => {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed, using fallback:', error);
      fallbackStorage[key] = value;
      return false;
    }
  }
  fallbackStorage[key] = value;
  return false;
};

const safeRemoveItem = (key) => {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
    }
  }
  delete fallbackStorage[key];
};

export const AnonymousUserService = {
  // Get anonymous user data with fallback support
  getAnonymousUser: () => {
    try {
      const data = safeGetItem(ANONYMOUS_USER_KEY);
      if (!data) {
        return {
          analysisCount: 0,
          firstAnalysisDate: null,
          hasUsedFreeAnalysis: false,
          storageType: isLocalStorageAvailable() ? 'localStorage' : 'fallback'
        };
      }
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        storageType: isLocalStorageAvailable() ? 'localStorage' : 'fallback'
      };
    } catch (error) {
      console.error('Error getting anonymous user data:', error);
      return {
        analysisCount: 0,
        firstAnalysisDate: null,
        hasUsedFreeAnalysis: false,
        storageType: 'fallback'
      };
    }
  },

  // Update anonymous user data with safe storage
  updateAnonymousUser: (updates) => {
    try {
      const currentData = AnonymousUserService.getAnonymousUser();
      const newData = {
        ...currentData,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      const success = safeSetItem(ANONYMOUS_USER_KEY, JSON.stringify(newData));
      if (!success) {
        console.warn('Using fallback storage for anonymous user data');
      }
      
      return newData;
    } catch (error) {
      console.error('Error updating anonymous user data:', error);
      return currentData;
    }
  },

  // Increment analysis count
  incrementAnalysisCount: () => {
    const currentData = AnonymousUserService.getAnonymousUser();
    const newCount = currentData.analysisCount + 1;
    
    return AnonymousUserService.updateAnonymousUser({
      analysisCount: newCount,
      firstAnalysisDate: currentData.firstAnalysisDate || new Date().toISOString(),
      hasUsedFreeAnalysis: true
    });
  },

  // Check if anonymous user can perform analysis
  canPerformAnalysis: () => {
    const userData = AnonymousUserService.getAnonymousUser();
    return userData.analysisCount < ANONYMOUS_ANALYSIS_LIMIT;
  },

  // Get remaining analyses for anonymous user
  getRemainingAnalyses: () => {
    const userData = AnonymousUserService.getAnonymousUser();
    return Math.max(0, ANONYMOUS_ANALYSIS_LIMIT - userData.analysisCount);
  },

  // Check if user has used their free analysis
  hasUsedFreeAnalysis: () => {
    const userData = AnonymousUserService.getAnonymousUser();
    return userData.hasUsedFreeAnalysis;
  },

  // Reset anonymous user data (for testing)
  resetAnonymousUser: () => {
    try {
      safeRemoveItem(ANONYMOUS_USER_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting anonymous user data:', error);
      return false;
    }
  },

  // Get anonymous user status for display
  getAnonymousUserStatus: () => {
    const userData = AnonymousUserService.getAnonymousUser();
    const remaining = AnonymousUserService.getRemainingAnalyses();
    
    return {
      analysisCount: userData.analysisCount,
      remainingAnalyses: remaining,
      hasUsedFreeAnalysis: userData.hasUsedFreeAnalysis,
      canPerformAnalysis: remaining > 0,
      firstAnalysisDate: userData.firstAnalysisDate,
      storageType: userData.storageType
    };
  },

  // Atomic operation to check and increment analysis count (prevents race conditions)
  checkAndIncrementAnalysis: () => {
    try {
      // Double-check localStorage availability before proceeding
      const storageAvailable = isLocalStorageAvailable();
      const currentData = AnonymousUserService.getAnonymousUser();
      
      // Check if user can perform analysis
      if (currentData.analysisCount >= ANONYMOUS_ANALYSIS_LIMIT) {
        return {
          success: false,
          reason: 'limit_reached',
          remainingAnalyses: 0,
          analysisCount: currentData.analysisCount,
          storageType: storageAvailable ? 'localStorage' : 'fallback'
        };
      }
      
      // Atomically increment the count
      const newData = AnonymousUserService.incrementAnalysisCount();
      
      return {
        success: true,
        reason: 'incremented',
        remainingAnalyses: Math.max(0, ANONYMOUS_ANALYSIS_LIMIT - newData.analysisCount),
        analysisCount: newData.analysisCount,
        storageType: newData.storageType
      };
    } catch (error) {
      console.error('Error in checkAndIncrementAnalysis:', error);
      return {
        success: false,
        reason: 'error',
        remainingAnalyses: 0,
        analysisCount: 0,
        storageType: 'fallback'
      };
    }
  },

  // Check if localStorage is working properly
  isStorageReliable: () => {
    return isLocalStorageAvailable();
  }
};

export default AnonymousUserService;
