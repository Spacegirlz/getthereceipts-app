import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ReferralQRCode = ({ referralLink, className = "" }) => {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate luxe branded QR code
  const generateLuxeQR = async () => {
    if (!referralLink) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 500; // Larger for high-end feel
    canvas.width = size;
    canvas.height = size;

    // Luxe background with multiple gradients
    const bgGradient = ctx.createLinearGradient(0, 0, size, size);
    bgGradient.addColorStop(0, '#0F0C29');
    bgGradient.addColorStop(0.3, '#24243e');
    bgGradient.addColorStop(0.7, '#302B63');
    bgGradient.addColorStop(1, '#0F0C29');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, size, size);

    // Add luxury border with multiple layers
    const borderGradient = ctx.createLinearGradient(0, 0, size, size);
    borderGradient.addColorStop(0, '#FFD700');
    borderGradient.addColorStop(0.5, '#FFA500');
    borderGradient.addColorStop(1, '#FFD700');
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // Inner luxury border
    ctx.strokeStyle = '#E6E6FA';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, size - 24, size - 24);

    // Header section with luxury styling
    const headerGradient = ctx.createLinearGradient(0, 0, size, 0);
    headerGradient.addColorStop(0, '#8B5CF6');
    headerGradient.addColorStop(0.5, '#EC4899');
    headerGradient.addColorStop(1, '#8B5CF6');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(25, 25, size - 50, 80);

    // Add sparkle effect to header
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 8; i++) {
      const x = 25 + Math.random() * (size - 50);
      const y = 25 + Math.random() * 80;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Main logo text with luxury font styling
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText('Get The Receipts', size / 2, 65);

    // Tagline with elegant styling
    ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#F3F4F6';
    ctx.shadowBlur = 2;
    ctx.fillText('Stop second-guessing their texts', size / 2, 90);

    // QR Code section with luxury frame
    const qrSize = 220;
    const qrX = (size - qrSize) / 2;
    const qrY = 130;

    // QR code background with gradient
    const qrBgGradient = ctx.createLinearGradient(qrX, qrY, qrX + qrSize, qrY + qrSize);
    qrBgGradient.addColorStop(0, '#FFFFFF');
    qrBgGradient.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = qrBgGradient;
    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

    // QR code border with luxury styling
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 4;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

    // Inner QR border
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);

    // Generate QR code as data URL
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = qrSize;
    qrCanvas.height = qrSize;
    const qrCtx = qrCanvas.getContext('2d');
    
    // Create QR code
    const qrImg = new Image();
    qrImg.onload = () => {
      qrCtx.fillStyle = '#FFFFFF';
      qrCtx.fillRect(0, 0, qrSize, qrSize);
      qrCtx.drawImage(qrImg, 0, 0, qrSize, qrSize);
      
      // Draw QR code onto main canvas
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Call to action with luxury styling
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Scan to sign up', size / 2, qrY + qrSize + 40);

      // Incentive text
      ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#F3F4F6';
      ctx.fillText('Get 3 free credits when you join!', size / 2, qrY + qrSize + 65);

      // Website URL
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('www.getthereceipts.com', size / 2, qrY + qrSize + 90);

      // Referral code if available
      if (referralLink.includes('code=')) {
        const code = referralLink.split('code=')[1];
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(`Code: ${code}`, size / 2, qrY + qrSize + 110);
      }

      setIsGenerating(false);
    };

    // Create QR code using qrcode.react
    const qrDataURL = await new Promise((resolve) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = qrSize;
      tempCanvas.height = qrSize;
      
      // Use qrcode.react to generate QR code
      const qrElement = document.createElement('div');
      qrElement.innerHTML = `<QRCode value="${referralLink}" size={qrSize} level="H" />`;
      
      // For now, create a simple QR pattern
      tempCtx.fillStyle = '#000000';
      tempCtx.fillRect(0, 0, qrSize, qrSize);
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(10, 10, qrSize - 20, qrSize - 20);
      
      resolve(tempCanvas.toDataURL());
    });

    qrImg.src = qrDataURL;
  };

  // Download QR code
  const downloadQRCode = async () => {
    await generateLuxeQR();
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = 'get-the-receipts-luxe-qr.png';
      link.href = canvasRef.current.toDataURL('image/png', 1.0);
      link.click();
    }, 100);
  };

  // Share QR code
  const shareQRCode = async () => {
    await generateLuxeQR();
    
    setTimeout(async () => {
      try {
        const canvas = canvasRef.current;
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
        
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'luxe-qr-code.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: 'Get The Receipts - Luxe Referral QR Code',
            text: 'Scan this QR code to sign up and get 3 free credits!',
            files: [new File([blob], 'luxe-qr-code.png', { type: 'image/png' })]
          });
        } else {
          downloadQRCode();
        }
      } catch (error) {
        console.error('Error sharing QR code:', error);
        downloadQRCode();
      }
    }, 100);
  };

  if (!referralLink) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No referral link available</p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Luxe container with premium styling */}
        <div className="relative bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-indigo-900/30 rounded-3xl p-8 border border-purple-500/30 shadow-2xl backdrop-blur-sm">
          {/* Sparkle effects */}
          <div className="absolute top-4 right-4">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-8 left-6">
            <Sparkles className="h-4 w-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Share Your QR Code
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </h3>
          
          {/* QR Code Preview with luxury styling */}
          <div className="mb-8">
            <div className="inline-block p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-4 border-purple-500/30">
              <QRCode
                value={referralLink}
                size={200}
                level="H"
                includeMargin={true}
                renderAs="svg"
                imageSettings={{
                  src: '/logo.png', // Add your logo here
                  x: null,
                  y: null,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
                fgColor="#1a1a1a"
                bgColor="#ffffff"
              />
            </div>
          </div>

          {/* Action Buttons with luxury styling */}
          <div className="space-y-4">
            <Button
              onClick={downloadQRCode}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Luxe QR Code'}
            </Button>
            
            <Button
              onClick={shareQRCode}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-2 border-purple-400 text-purple-400 hover:bg-purple-500/20 hover:border-purple-300 font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share QR Code
            </Button>
          </div>

          <p className="text-sm text-gray-300 mt-6 font-medium">
            Perfect for social media, business cards, or print materials
          </p>
        </div>
      </motion.div>

      {/* Hidden canvas for generating luxe QR */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ReferralQRCode;