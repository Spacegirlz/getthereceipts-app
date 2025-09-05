import { useState, useEffect } from 'react';

const AGE_VERIFICATION_KEY = 'sage-age-verified';

export const useAgeVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already been verified
    const verified = localStorage.getItem(AGE_VERIFICATION_KEY);
    if (verified === 'true') {
      setIsVerified(true);
      setShowModal(false);
    } else {
      setIsVerified(false);
      setShowModal(false); // Don't show modal immediately, let the parent component control this
    }
    setIsLoading(false);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
    setIsVerified(true);
    setShowModal(false);
  };

  const handleDecline = () => {
    // Don't store anything, just close modal
    setShowModal(false);
    // Redirect to homepage or show age-appropriate message
    window.location.href = '/';
  };

  const requestVerification = () => {
    if (!isVerified) {
      setShowModal(true);
    }
  };

  const resetVerification = () => {
    localStorage.removeItem(AGE_VERIFICATION_KEY);
    setIsVerified(false);
  };

  return {
    isVerified,
    showModal,
    isLoading,
    handleConfirm,
    handleDecline,
    requestVerification,
    resetVerification
  };
};