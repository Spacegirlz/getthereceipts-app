import React, { memo } from 'react';
import DeepDiveReceiptCard from '@/components/DeepDiveReceiptCard';

const DeepDiveReceiptCarousel = memo(({ receipts = [], onCopy }) => {
  if (!receipts || receipts.length === 0) return null;

  return (
    <div>
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4">
        {receipts.map((r, i) => (
          <DeepDiveReceiptCard key={i} receipt={r} index={i} total={receipts.length} onCopy={onCopy} />
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {receipts.slice(0, 6).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
        ))}
      </div>
    </div>
  );
});

export default DeepDiveReceiptCarousel;


