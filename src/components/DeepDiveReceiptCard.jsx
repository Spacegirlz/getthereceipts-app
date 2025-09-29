import React, { memo } from 'react';
import { Copy } from 'lucide-react';

const DeepDiveReceiptCard = memo(({ receipt, index, total, onCopy }) => {
  if (!receipt) return null;

  const handleCopy = () => {
    if (onCopy) onCopy(receipt.quote);
  };

  return (
    <div
      className="min-w-full snap-center relative rounded-2xl p-6 border border-white/[0.12] shadow-lg transition-all duration-300 cursor-pointer group bg-black/80 backdrop-blur-sm"
      onClick={handleCopy}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <Copy className="absolute top-4 right-4 w-4 h-4 text-white/30 group-hover:text-[#D4AF37] transition-colors duration-300" />
      {typeof index === 'number' && typeof total === 'number' && (
        <div className="absolute top-4 left-4 text-xs text-white/40 font-mono">{`Message ${index + 1} of ${total}`}</div>
      )}

      <div className="text-white/95 text-[16px] sm:text-lg mb-4 font-medium italic leading-relaxed pr-8">
        "{receipt.quote}"
      </div>

      <div className="text-center text-white/40 text-xs mb-3">↓ Sage decodes ↓</div>

      <div className="text-[#F5E6D3]/90 text-[14px] sm:text-base leading-relaxed font-medium">
        {receipt.cost}
      </div>

      <div className="mt-4 inline-block px-3 py-1.5 bg-gradient-to-r from-[#D4AF37]/20 to-[#F5E6D3]/20 text-[#D4AF37] rounded-full text-sm font-semibold border border-[#D4AF37]/30">
        {receipt.pattern}
      </div>
    </div>
  );
});

export default DeepDiveReceiptCard;


