// Comprehensive Error Handling for Referral System

// Error types and their user-friendly messages
export const REFERRAL_ERRORS = {
  INVALID_CODE: {
    code: 'INVALID_REFERRAL_CODE',
    title: 'Invalid Referral Code',
    message: 'The referral code you entered is not valid. Please check and try again.',
    emoji: '❌'
  },
  ALREADY_REFERRED: {
    code: 'ALREADY_REFERRED',
    title: 'Already Referred',
    message: 'You already have a referrer. Each user can only be referred once.',
    emoji: '⚠️'
  },
  SELF_REFERRAL: {
    code: 'SELF_REFERRAL',
    title: 'Cannot Refer Yourself',
    message: 'You cannot use your own referral code. Share it with friends instead!',
    emoji: '🤔'
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    title: 'Connection Error',
    message: 'Unable to process referral. Please check your connection and try again.',
    emoji: '📡'
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    title: 'System Error',
    message: 'Something went wrong on our end. Please try again in a moment.',
    emoji: '🔧'
  },
  RATE_LIMIT: {
    code: 'RATE_LIMIT',
    title: 'Too Many Requests',
    message: 'Please wait a moment before trying again.',
    emoji: '⏳'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    title: 'Authentication Required',
    message: 'Please sign in to use referral codes.',
    emoji: '🔐'
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Please try again.',
    emoji: '🤷‍♂️'
  }
};

// Map backend error messages to user-friendly errors
export const mapBackendError = (errorMessage) => {
  const message = errorMessage?.toLowerCase() || '';
  
  if (message.includes('invalid referral code') || message.includes('not found')) {
    return REFERRAL_ERRORS.INVALID_CODE;
  }
  
  if (message.includes('already has a referrer') || message.includes('already referred')) {
    return REFERRAL_ERRORS.ALREADY_REFERRED;
  }
  
  if (message.includes('cannot refer yourself') || message.includes('self-referral')) {
    return REFERRAL_ERRORS.SELF_REFERRAL;
  }
  
  if (message.includes('network') || message.includes('connection') || message.includes('fetch')) {
    return REFERRAL_ERRORS.NETWORK_ERROR;
  }
  
  if (message.includes('database') || message.includes('sql') || message.includes('constraint')) {
    return REFERRAL_ERRORS.DATABASE_ERROR;
  }
  
  if (message.includes('rate limit') || message.includes('too many')) {
    return REFERRAL_ERRORS.RATE_LIMIT;
  }
  
  if (message.includes('unauthorized') || message.includes('authentication')) {
    return REFERRAL_ERRORS.UNAUTHORIZED;
  }
  
  return REFERRAL_ERRORS.UNKNOWN_ERROR;
};

// Handle referral processing errors
export const handleReferralError = (error, toast) => {
  console.error('Referral error:', error);
  
  let errorInfo;
  
  // Handle different error types
  if (error?.code) {
    // Supabase error
    switch (error.code) {
      case 'PGRST116':
        errorInfo = REFERRAL_ERRORS.INVALID_CODE;
        break;
      case 'PGRST204':
        errorInfo = REFERRAL_ERRORS.DATABASE_ERROR;
        break;
      case 'PGRST301':
        errorInfo = REFERRAL_ERRORS.UNAUTHORIZED;
        break;
      default:
        errorInfo = mapBackendError(error.message);
    }
  } else if (error?.message) {
    // Generic error with message
    errorInfo = mapBackendError(error.message);
  } else if (typeof error === 'string') {
    // String error
    errorInfo = mapBackendError(error);
  } else {
    // Unknown error
    errorInfo = REFERRAL_ERRORS.UNKNOWN_ERROR;
  }
  
  // Show user-friendly error toast
  toast({
    variant: "destructive",
    title: `${errorInfo.emoji} ${errorInfo.title}`,
    description: errorInfo.message,
    duration: 5000
  });
  
  return errorInfo;
};

// Handle referral success with different scenarios
export const handleReferralSuccess = (result, toast) => {
  const { creditsGiven, currentReferralCount, milestone10Reached, milestone50Reached, milestone10Coupon, milestone50Coupon } = result;
  
  // Always show the basic success message
  toast({
    title: "🎉 Referral Bonus!",
    description: `You earned ${creditsGiven} credits! Total: ${currentReferralCount} referrals`,
    duration: 5000
  });
  
  // Show milestone notifications
  if (milestone10Reached && milestone10Coupon) {
    setTimeout(() => {
      toast({
        title: "🏆 Milestone Reached!",
        description: "You've earned a free Premium month! Check your dashboard for the coupon.",
        duration: 8000
      });
    }, 1000);
  }
  
  if (milestone50Reached && milestone50Coupon) {
    setTimeout(() => {
      toast({
        title: "👑 OG Founders Pass!",
        description: "You've unlocked the OG Founders Pass! Check your dashboard for the coupon.",
        duration: 8000
      });
    }, 2000);
  }
};

// Validate referral code format
export const validateReferralCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Referral code is required' };
  }
  
  const trimmedCode = code.trim();
  
  if (trimmedCode.length < 6 || trimmedCode.length > 20) {
    return { valid: false, error: 'Referral code must be 6-20 characters long' };
  }
  
  if (!/^[A-Z0-9]+$/.test(trimmedCode)) {
    return { valid: false, error: 'Referral code can only contain letters and numbers' };
  }
  
  return { valid: true, code: trimmedCode };
};

// Retry logic for failed requests
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry certain errors
      if (error?.code === 'INVALID_REFERRAL_CODE' || 
          error?.code === 'ALREADY_REFERRED' || 
          error?.code === 'SELF_REFERRAL') {
        throw error;
      }
      
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

// Safe referral processing with comprehensive error handling
export const safeProcessReferral = async (referralCode, newUserId, processFn, toast) => {
  try {
    // Validate input
    const validation = validateReferralCode(referralCode);
    if (!validation.valid) {
      toast({
        variant: "destructive",
        title: "❌ Invalid Code",
        description: validation.error
      });
      return { success: false, error: validation.error };
    }
    
    if (!newUserId) {
      toast({
        variant: "destructive",
        title: "❌ Authentication Required",
        description: "Please sign in to use referral codes"
      });
      return { success: false, error: 'User ID required' };
    }
    
    // Process with retry logic
    const result = await withRetry(() => processFn(validation.code, newUserId));
    
    if (result.success) {
      handleReferralSuccess(result, toast);
      return result;
    } else {
      const errorInfo = mapBackendError(result.error);
      toast({
        variant: "destructive",
        title: `${errorInfo.emoji} ${errorInfo.title}`,
        description: errorInfo.message
      });
      return result;
    }
    
  } catch (error) {
    const errorInfo = handleReferralError(error, toast);
    return { success: false, error: errorInfo.message };
  }
};

// Error boundary for referral components (React component - use in .jsx files)
export const createReferralErrorBoundary = () => {
  return {
    hasError: false,
    error: null,
    resetError: () => {
      this.hasError = false;
      this.error = null;
    },
    logError: (error) => {
      console.error('Referral component error:', error);
      this.hasError = true;
      this.error = error;
    }
  };
};
