import React from 'react';

const SmartCharacterCounter = ({ count, limit = 10000 }) => {
  const percentage = (count / limit) * 100;
  const MIN_LENGTH = 300; // Minimum required for analysis
  const OPTIMAL_MIN = 500; // Optimal minimum
  const OPTIMAL_MAX = 10000; // Maximum limit (processing handles up to 10k)

  // Only show when approaching limit (90%+) or always show if >0
  const shouldShow = count > 0;

  if (!shouldShow) return null;

  const getColorClass = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  const getTextColorClass = () => {
    if (percentage >= 100) return 'text-red-400 font-medium';
    if (percentage >= 90) return 'text-yellow-400';
    return 'text-gray-400';
  };

  // Get feedback message based on character count
  const getFeedbackMessage = () => {
    if (count < MIN_LENGTH) {
      return {
        text: `Minimum ${MIN_LENGTH} characters required`,
        color: 'text-orange-400'
      };
    } else if (count >= MIN_LENGTH && count < OPTIMAL_MIN) {
      return {
        text: `A good range is between ${OPTIMAL_MIN.toLocaleString()}-${OPTIMAL_MAX.toLocaleString()} characters`,
        color: 'text-cyan-400'
      };
    } else if (count >= OPTIMAL_MIN && count <= OPTIMAL_MAX) {
      return {
        text: `A good range is between ${OPTIMAL_MIN.toLocaleString()}-${OPTIMAL_MAX.toLocaleString()} characters`,
        color: 'text-green-400'
      };
    } else {
      return null; // Will show limit warnings instead
    }
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className={getTextColorClass()}>
          {count.toLocaleString()} / {limit.toLocaleString()} characters
          {percentage >= 100 && ' (limit reached)'}
          {percentage >= 90 && percentage < 100 && ' (approaching limit)'}
        </span>
      </div>

      {/* Dynamic feedback message */}
      {feedback && (
        <div className={`text-xs mt-1 ${feedback.color} transition-colors duration-200`}>
          {feedback.text}
        </div>
      )}

      {percentage >= 70 && (
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getColorClass()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default SmartCharacterCounter;
