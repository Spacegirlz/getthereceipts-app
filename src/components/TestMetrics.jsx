import React from 'react';
import ViralMetrics from './ViralMetrics';

const TestMetrics = () => {
  // Test data that should work
  const testMetrics = {
    interest: 75,
    manipulation: 15,
    availability: 80
  };

  console.log('TestMetrics: Testing with hardcoded data:', testMetrics);

  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-white text-xl mb-4">Test Metrics Component</h2>
      <ViralMetrics metrics={testMetrics} />
    </div>
  );
};

export default TestMetrics;
