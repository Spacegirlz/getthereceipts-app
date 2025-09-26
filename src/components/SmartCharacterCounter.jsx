import React from 'react';

const SmartCharacterCounter = ({ count, limit = 5000 }) => {
  const percentage = (count / limit) * 100;
  
  // Only show when approaching limit
  if (percentage < 70) return null;
  
  const getColorClass = () => {
    if (percentage > 95) return 'bg-red-500';
    if (percentage > 85) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="mt-2">
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColorClass()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {percentage > 95 && (
        <p className="text-xs text-red-400 mt-1 text-right">
          {Math.max(0, limit - count)} characters left
        </p>
      )}
    </div>
  );
};

export default SmartCharacterCounter;
