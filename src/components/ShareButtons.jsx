import React from 'react';
import domtoimage from 'dom-to-image-more';
import { motion } from 'framer-motion';

const ShareButtons = ({ results, sharing, setSharing }) => {
  const shareResults = async () => {
    setSharing(true);
    
    const shareText = 
      `THE RECEIPTS 🧾\n\n` +
      `Interest Level: ${results.interest}%\n` +
      `Manipulation: ${results.manipulation}%\n` +
      `Verdict: "${results.verdict}"\n\n` +
      `Get your receipts: getthereceipts.com`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Receipts 🧾', text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Results copied! Share them anywhere 📤');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
    
    setSharing(false);
  };

  const generateScreenshot = async () => {
    const element = document.getElementById('receipt-card-shareable');
    if (!element) return;

    try {
      const dataUrl = await domtoimage.toPng(element, { 
        pixelRatio: 2,
        quality: 1.0,
        bgcolor: '#000000'
      });
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      const file = new File([blob], 'receipts.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'My Text Message Receipts' });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'receipts.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Screenshot generation failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '16px', maxWidth: '400px', margin: '24px auto', padding: '0 16px' }}>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(118, 75, 162, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={shareResults}
        disabled={sharing}
        style={{
          flex: 1, padding: '16px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)', transition: 'all 0.3s ease',
          fontSize: '16px'
        }}
      >
        {sharing ? 'Sharing...' : '📤 Share Results'}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(245, 87, 108, 0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={generateScreenshot}
        style={{
          flex: 1, padding: '16px 24px', background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)', transition: 'all 0.3s ease',
          fontSize: '16px'
        }}
      >
        📸 Save Receipt
      </motion.button>
    </div>
  );
};

export default ShareButtons;