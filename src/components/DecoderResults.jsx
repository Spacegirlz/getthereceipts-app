import React, { useState, useEffect } from 'react';
import { generateResults } from '@/lib/analysis';
import ReceiptCard from '@/components/ReceiptCard';
import DetailedResults from '@/components/DetailedResults';
import ShareButtons from '@/components/ShareButtons';

const DecoderResults = ({ message, context }) => {
  const [results, setResults] = useState(null);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (message) {
      setResults(generateResults(message, context));
    }
  }, [message, context]);

  if (!results) {
    return (
        <div className="text-center text-white">
            <div className="text-2xl animate-spin mb-4">⚙️</div>
            <p>Analyzing the subtext...</p>
        </div>
    );
  }

  return (
    <div className="results-container w-full max-w-md"> {/* Add w-full max-w-md for consistent width */}
      <ReceiptCard results={results} />
      {/* DetailedResults and ShareButtons are now *below* the main shareable card */}
      <DetailedResults results={results} message={message} />
      <ShareButtons results={results} sharing={sharing} setSharing={setSharing} />
    </div>
  );
};

export default DecoderResults;