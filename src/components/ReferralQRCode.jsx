import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Sparkles, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const ReferralQRCode = ({ referralLink, className = "" }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Download QR code as image
  const downloadQRCode = async () => {
    if (!referralLink) return;
    
    setIsGenerating(true);
    
    try {
      // First, create an SVG QR code to get the actual QR data
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Create QR code SVG element
      const qrSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      qrSvg.setAttribute('width', '220');
      qrSvg.setAttribute('height', '220');
      
      // Generate QR code using qrcode library manually
      const QRCode = await import('qrcode');
      const qrDataURL = await QRCode.toDataURL(referralLink, {
        width: 220,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });
      
      // Create image from QR data URL
      const qrImage = new Image();
      qrImage.src = qrDataURL;
      
      await new Promise((resolve) => {
        qrImage.onload = resolve;
      });
      
      // Create a temporary canvas to render the complete design
      const canvas = document.createElement('canvas');
      const size = 500;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Luxe background
      const bgGradient = ctx.createLinearGradient(0, 0, size, size);
      bgGradient.addColorStop(0, '#0F0C29');
      bgGradient.addColorStop(0.3, '#24243e');
      bgGradient.addColorStop(0.7, '#302B63');
      bgGradient.addColorStop(1, '#0F0C29');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, size, size);
      
      // Add luxury border
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, size - 6, size - 6);
      
      // Header section
      const headerGradient = ctx.createLinearGradient(0, 0, size, 0);
      headerGradient.addColorStop(0, '#8B5CF6');
      headerGradient.addColorStop(0.5, '#3B82F6');
      headerGradient.addColorStop(1, '#8B5CF6');
      ctx.fillStyle = headerGradient;
      ctx.fillRect(25, 25, size - 50, 80);
      
      // Logo text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Get The Receipts', size / 2, 65);
      
      // Tagline
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#F3F4F6';
      ctx.fillText('Stop second-guessing their texts', size / 2, 90);
      
      // QR Code area
      const qrSize = 220;
      const qrX = (size - qrSize) / 2;
      const qrY = 130;
      
      // QR background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      
      // QR border
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 4;
      ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
      
      // Draw the actual QR code image
      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
      
      // Call to action
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
      
      // Cleanup
      document.body.removeChild(tempDiv);
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'get-the-receipts-qr-code.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Share QR code
  const shareQRCode = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Get The Receipts - Referral QR Code',
          text: 'Scan this QR code to sign up and get 3 free credits!',
          url: referralLink
        });
      } else {
        // Fallback to download
        downloadQRCode();
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      downloadQRCode();
    }
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
        <div className="relative bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30 rounded-3xl p-8 border border-purple-500/30 shadow-2xl backdrop-blur-sm">
          {/* Sparkle effects */}
          <div className="absolute top-4 right-4">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-8 left-6">
            <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Share Your QR Code
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </h3>
          
          {/* QR Code Preview with luxury styling */}
          <div className="mb-8">
            <div className="inline-block p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border-4 border-purple-500/30">
              <QRCodeSVG
                value={referralLink}
                size={200}
                level="H"
                includeMargin={true}
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
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              {isGenerating ? 'Generating...' : 'Download your QR Code'}
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

        </div>
      </motion.div>

    </div>
  );
};

export default ReferralQRCode;