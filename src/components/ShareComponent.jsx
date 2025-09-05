
import React, { useState, useRef, useEffect, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';
import { Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import useSound from '@/hooks/useSound';

const ShareComponent = ({ shareTitle }) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [playShareSound] = useSound('/sounds/share.mp3', { volume: 0.5 });
  const [playTickSound] = useSound('/sounds/tick.mp3', { volume: 0.3 });

  // Define all functions at the top level
  console.log('ShareComponent: Functions being defined');
  
  const generateSoundbite = async () => {
    console.log('generateSoundbite called');
    setIsSharing(true);
    console.log('1. Set isSharing to true');
    playShareSound();
    console.log('2. Played sound');
    toast({ title: "Creating Sage soundbite...", description: "Turning that verdict into viral gold!" });
    console.log('3. Showed toast');

    try {
      console.log('4. Entering try block');
      // Get the verdict text from the receipt
      const element = document.getElementById('receipt-card-shareable');
      console.log('5. Looking for element:', element);
      if (!element) {
        console.log('5a. Element not found');
        toast({ title: "Error", description: "Could not find the receipt card.", variant: "destructive" });
        setIsSharing(false);
        return;
      }
      console.log('6. Element found successfully');

      // Extract verdict text
      const verdictElement = element.querySelector('[class*="verdict-text"]');
      console.log('7. Verdict element:', verdictElement);
      const verdictText = verdictElement ? verdictElement.textContent.replace(/"/g, '') : "Girl, they're keeping you at their length. Three hours to send a 'not +1s' text? You're not just friends; you're his optional plan.";
      console.log('8. Verdict text:', verdictText);
      
      // Create viral soundbite text with better formatting
      const soundbiteText = `${verdictText.trim()}\n\n🔥 Get your own receipt at getthereceipts.com\n\n#GetTheReceipts #DatingAdvice #SageSays #ViralSage`;
      console.log('9. Soundbite text created:', soundbiteText);
      
      // Copy to clipboard
      console.log('10. Attempting to copy to clipboard...');
      await navigator.clipboard.writeText(soundbiteText);
      console.log('11. Successfully copied to clipboard');
      
      toast({ 
        title: "🎤 Sage's Soundbite Copied!", 
        description: "Ready to paste! Perfect for Instagram, TikTok & Twitter!" 
      });
      
    } catch (error) {
      console.error("Soundbite failed:", error);
      toast({ title: "Soundbite Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  const generateAndSaveImage = async () => {
    console.log('generateAndSaveImage called');
    setIsSharing(true);
    playShareSound();
    toast({ title: "Saving your receipt...", description: "Just a moment, making it look perfect!" });

    const element = document.getElementById('receipt-card-shareable');
    if (!element) {
      toast({ title: "Error", description: "Could not find the receipt card to save.", variant: "destructive" });
      setIsSharing(false);
      return;
    }

    try {
      // Temporarily remove shimmer for cleaner screenshot
      element.classList.remove('shimmer-effect');
      
      // Add export-only class to remove borders
      element.classList.add('export-mode');
      
      // Temporarily remove height constraints
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      
      element.style.height = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';

      // Ensure we capture the full content height
      const targetWidth = element.scrollWidth;
      const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
      
      console.log('Save dimensions:', {
        width: targetWidth,
        height: targetHeight,
        scrollHeight: element.scrollHeight,
        offsetHeight: element.offsetHeight,
        clientHeight: element.clientHeight,
        ratio: (targetHeight / targetWidth).toFixed(2)
      });
      
      const dataUrl = await domtoimage.toPng(element, { 
        pixelRatio: 2.5,
        quality: 1.0,
        bgcolor: 'transparent',
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'center',
          position: 'relative',
          left: 'calc(50% - 5px)',
          marginLeft: `-${targetWidth / 2}px`
        }
      });
      
      // Add shimmer back after screenshot
      element.classList.add('shimmer-effect');
      
      // Remove export-only class
      element.classList.remove('export-mode');
      
      // Restore original height constraints
      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (!blob) {
        toast({ title: "Error", description: "Failed to create image blob.", variant: "destructive" });
        setIsSharing(false);
        return;
      }

      // Always download the image
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'receipt.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "💾 Receipt saved!", description: "Check your downloads folder!" });
      
    } catch (error) {
      console.error("Save failed:", error);
      toast({ title: "Save Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  const generateAndShareImage = async () => {
    console.log('generateAndShareImage called');
    setIsSharing(true);
    playShareSound();
    toast({ title: "Generating your shareable receipt...", description: "Just a moment, making it look perfect!" });

    const element = document.getElementById('receipt-card-shareable');
    if (!element) {
      toast({ title: "Error", description: "Could not find the receipt card to share.", variant: "destructive" });
      setIsSharing(false);
      return;
    }

    try {
      // Temporarily remove shimmer for cleaner screenshot
      element.classList.remove('shimmer-effect');
      
      // Add export-only class to remove borders
      element.classList.add('export-mode');
      
      // Temporarily remove height constraints
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;
      const originalOverflow = element.style.overflow;
      
      element.style.height = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflow = 'visible';

      // Ensure we capture the full content height
      const targetWidth = element.scrollWidth;
      const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
      
      console.log('Export dimensions:', {
        width: targetWidth,
        height: targetHeight,
        scrollHeight: element.scrollHeight,
        offsetHeight: element.offsetHeight,
        clientHeight: element.clientHeight,
        ratio: (targetHeight / targetWidth).toFixed(2)
      });
      
      const dataUrl = await domtoimage.toPng(element, { 
        pixelRatio: 2.5,
        quality: 1.0,
        bgcolor: 'transparent',
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'center',
          position: 'relative',
          left: 'calc(50% - 5px)',
          marginLeft: `-${targetWidth / 2}px`
        }
      });
      
      // Add shimmer back after screenshot
      element.classList.add('shimmer-effect');
      
      // Remove export-only class
      element.classList.remove('export-mode');
      
      // Restore original height constraints
      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (!blob) {
        toast({ title: "Error", description: "Failed to create image blob.", variant: "destructive" });
        setIsSharing(false);
        return;
      }

      try {
        const file = new File([blob], 'get-the-receipts.png', { type: 'image/png' });
        const shareData = {
          files: [file],
          title: shareTitle,
          text: `The verdict is in. Check out my receipt! #GetTheReceipts`,
        };

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share(shareData);
          toast({ title: "📤 Shared!", description: "Your receipt is out there!" });
        } else {
           // No sharing available - show message
           toast({ title: "Sharing not available", description: "Use 'Save to Phone' instead", variant: "destructive" });
        }
      } catch (shareError) {
        console.error('Share error:', shareError);
        // Don't auto-save, just show error
        toast({ title: "Share canceled", description: "Use 'Save to Phone' to download", variant: "destructive" });
      }
    } catch (error) {
      console.error("Sharing failed:", error);
      toast({ title: "Sharing Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  // Platform-specific share functions
  const shareToFacebook = async () => {
    console.log('Facebook share clicked');
    setIsSharing(true);
    playShareSound();
    try {
      const { imageBlob, soundbiteText } = await generateImageAndText();
      
      // Create file from blob
      const file = new File([imageBlob], 'sage-receipt.png', { type: 'image/png' });
      
      // Use Web Share API if available
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Sage\'s Receipt 💅',
          text: soundbiteText,
          url: 'https://getthereceipts.com'
        });
        toast({ title: "📘 Shared!", description: "Your receipt is out there!" });
      } else {
        // Fallback: download image and copy text
        await navigator.clipboard.writeText(soundbiteText);
        downloadImage(imageBlob);
        toast({ title: "📘 Ready to share!", description: "Image saved + text copied! Use your device's share button!" });
      }
    } catch (error) {
      console.error('Facebook share failed:', error);
      if (error.name === 'AbortError') {
        toast({ title: "Share canceled", description: "No worries, try again when ready!" });
      } else {
        toast({ title: "Share failed", description: "Try the general share button", variant: "destructive" });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const shareToInstagram = async () => {
    console.log('Instagram share clicked');
    setIsSharing(true);
    playShareSound();
    try {
      const { imageBlob, soundbiteText } = await generateImageAndText();
      
      // Instagram works best with image download + text copy
      await navigator.clipboard.writeText(soundbiteText);
      downloadImage(imageBlob);
      
      toast({ 
        title: "📷 Instagram ready!", 
        description: "Image saved + text copied! Paste in Instagram Stories/Posts!" 
      });
    } catch (error) {
      console.error('Instagram share failed:', error);
      toast({ title: "Share failed", description: "Try the general share button", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };



  const shareToTikTok = async () => {
    console.log('TikTok share clicked');
    setIsSharing(true);
    playShareSound();
    try {
      const { imageBlob, soundbiteText } = await generateImageAndText();
      
      // Create file from blob
      const file = new File([imageBlob], 'sage-receipt.png', { type: 'image/png' });
      
      // Use Web Share API if available
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Sage\'s Receipt 💅',
          text: soundbiteText,
          url: 'https://getthereceipts.com'
        });
        toast({ title: "🎵 Shared to TikTok!", description: "Your receipt is out there!" });
      } else {
        // Fallback: download image and copy text
        await navigator.clipboard.writeText(soundbiteText);
        downloadImage(imageBlob);
        toast({ title: "🎵 Ready for TikTok!", description: "Image saved + text copied! Use your device's share button!" });
      }
    } catch (error) {
      console.error('TikTok share failed:', error);
      if (error.name === 'AbortError') {
        toast({ title: "Share canceled", description: "No worries, try again when ready!" });
      } else {
        toast({ title: "Share failed", description: "Try the general share button", variant: "destructive" });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTwitter = async () => {
    console.log('Twitter share clicked');
    setIsSharing(true);
    playShareSound();
    try {
      const { imageBlob, soundbiteText } = await generateImageAndText();
      
      // Create file from blob
      const file = new File([imageBlob], 'sage-receipt.png', { type: 'image/png' });
      
      // Use Web Share API if available
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Sage\'s Receipt 💅',
          text: soundbiteText,
          url: 'https://getthereceipts.com'
        });
        toast({ title: "🐦 Tweeted!", description: "Your receipt is out there!" });
      } else {
        // Fallback: download image and copy text
        await navigator.clipboard.writeText(soundbiteText);
        downloadImage(imageBlob);
        toast({ title: "🐦 Ready to tweet!", description: "Image saved + text copied! Use your device's share button!" });
      }
    } catch (error) {
      console.error('Twitter share failed:', error);
      if (error.name === 'AbortError') {
        toast({ title: "Share canceled", description: "No worries, try again when ready!" });
      } else {
        toast({ title: "Share failed", description: "Try the general share button", variant: "destructive" });
      }
    } finally {
      setIsSharing(false);
    }
  };

  const shareToCustom = async () => {
    setIsSharing(true);
    playShareSound();
    try {
      const { imageBlob, soundbiteText } = await generateImageAndText();
      
      // Copy both image and text for maximum virality
      await navigator.clipboard.writeText(soundbiteText);
      downloadImage(imageBlob);
      
      toast({ 
        title: "💜 GetTheReceipts ready!", 
        description: "Share anywhere! Image saved + text copied!" 
      });
    } catch (error) {
      console.error('Custom share failed:', error);
      toast({ title: "Share failed", description: "Try the general share button", variant: "destructive" });
    } finally {
      setIsSharing(false);
    }
  };

  // Helper function to generate image and text
  const generateImageAndText = async () => {
    const element = document.getElementById('receipt-card-shareable');
    if (!element) {
      throw new Error('Receipt card not found');
    }

    // Generate image
    element.classList.remove('shimmer-effect');
    element.classList.add('export-mode');
    
    const originalHeight = element.style.height;
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;
    
    element.style.height = 'auto';
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    const targetWidth = element.scrollWidth;
    const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);
    
    const dataUrl = await domtoimage.toPng(element, { 
      pixelRatio: 2.5,
      quality: 1.0,
      bgcolor: 'transparent',
      width: targetWidth,
      height: targetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'center',
        position: 'relative',
        left: 'calc(50% - 5px)',
        marginLeft: `-${targetWidth / 2}px`
      }
    });
    
    element.classList.add('shimmer-effect');
    element.classList.remove('export-mode');
    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
    element.style.overflow = originalOverflow;

    const response = await fetch(dataUrl);
    const imageBlob = await response.blob();

    // Generate soundbite text
    const verdictElement = element.querySelector('[class*="verdict-text"]');
    const verdictText = verdictElement ? verdictElement.textContent.replace(/"/g, '') : "Girl, they're keeping you at their length. Three hours to send a 'not +1s' text? You're not just friends; you're his optional plan.";
    const soundbiteText = `${verdictText} 💅 Get your own receipts at getthereceipts.com #GetTheReceipts #SageSays #DatingAdvice`;

    return { imageBlob, soundbiteText };
  };

  // Helper function to download image
  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Debug useEffect - add after functions are defined
  useEffect(() => {
    console.log('ShareComponent mounted, functions available:', {
      generateSoundbite: typeof generateSoundbite,
      generateAndSaveImage: typeof generateAndSaveImage,
      generateAndShareImage: typeof generateAndShareImage
    });
  }, []);
  
  return (
    <div className="mt-8 flex flex-col items-center">
      {/* Share Button */}
      <button 
        onClick={(e) => {
          console.log('Share button clicked');
          e.preventDefault();
          generateAndShareImage();
        }} 
        disabled={isSharing} 
        className="group relative overflow-hidden rounded-2xl px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-base shadow-2xl hover:scale-[1.02] transition-all duration-300 hover:shadow-purple-500/50 mb-3"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {/* Button content */}
        <div className="relative flex items-center justify-center">
          {isSharing ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              <span>Brewing your receipt...</span>
            </>
          ) : (
            <>
              <span className="mr-2 text-lg">📸</span>
              <span>Share Your Receipt</span>
              <span className="ml-2 text-xs opacity-80">→</span>
            </>
          )}
        </div>
      </button>
      
      {/* Save Button */}
      <button 
        onClick={(e) => {
          console.log('Save button clicked');
          e.preventDefault();
          generateAndSaveImage();
        }} 
        disabled={isSharing} 
        className="group relative overflow-hidden rounded-xl px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-green-500/50"
      >
        {/* Button content */}
        <div className="relative flex items-center justify-center">
          {isSharing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span className="mr-2 text-base">💾</span>
              <span>Save to Phone/Desktop</span>
            </>
          )}
        </div>
      </button>
      
            {/* Single Row Platform Share Buttons */}
      <div className="mt-6 p-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl border border-pink-400/30">
        <p className="text-center text-white text-lg font-bold mb-4">Share Sage's Receipt</p>
        <div className="flex justify-center items-center gap-4">
          {/* Instagram */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              shareToInstagram();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
            title="Share to Instagram"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </button>

          {/* Facebook */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              shareToFacebook();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-blue-500/50"
            title="Share to Facebook"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          {/* TikTok */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              shareToTikTok();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-gray-500/50"
            title="Share to TikTok"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </button>

          {/* X/Twitter */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              shareToTwitter();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-gray-500/50"
            title="Share to X/Twitter"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          {/* Share */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              generateAndShareImage();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-purple-500/50"
            title="Share Your Receipt"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>

          {/* Save */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              generateAndSaveImage();
            }} 
            disabled={isSharing} 
            className="w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
            title="Save to Phone/Desktop"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Viral CTA */}
      <p className="mt-3 text-xs text-white/60 text-center max-w-xs">
        🔥 Perfect for Instagram, TikTok & Twitter
      </p>
      
                  {/* Soundbite Button */}
            <button
              onClick={(e) => {
                console.log('Soundbite button clicked');
                e.preventDefault();
                generateSoundbite();
              }}
              disabled={isSharing}
              className="group relative overflow-hidden rounded-xl px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm shadow-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-teal-500/50 mt-3"
            >
              {/* Button content */}
              <div className="relative flex items-center justify-center">
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Creating soundbite...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-base">🎤</span>
                    <span>Sage's Soundbites</span>
                  </>
                )}
              </div>
            </button>
    </div>
  );
};

export default ShareComponent;
