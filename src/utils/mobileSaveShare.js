/**
 * Mobile Save/Share Utility
 * Handles mobile-specific save/share functionality with fallbacks
 */

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export const isMobile = () => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const hasWebShareAPI = () => {
  return navigator.share && typeof navigator.share === 'function';
};

export const canShareFiles = () => {
  return navigator.canShare && typeof navigator.canShare === 'function';
};

export const generateReceiptImage = async (elementId, options = {}) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const defaultOptions = {
    useCORS: true,
    allowTaint: true,
    backgroundColor: 'transparent',
    scale: 2,
    width: element.offsetWidth,
    height: Math.max(element.offsetHeight, element.scrollHeight, element.clientHeight)
  };

  const canvas = await html2canvas(element, { ...defaultOptions, ...options });
  return canvas;
};

export const saveReceiptImage = async (elementId, filename = 'receipt.png') => {
  try {
    const canvas = await generateReceiptImage(elementId);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const timestamp = Date.now();
        const finalFilename = filename.includes('.') ? filename : `${filename}-${timestamp}.png`;
        saveAs(blob, finalFilename);
        return { success: true, filename: finalFilename };
      } else {
        throw new Error('Failed to create blob from canvas');
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Save receipt error:', error);
    return { success: false, error: error.message };
  }
};

export const shareReceiptImage = async (elementId, shareOptions = {}) => {
  try {
    const canvas = await generateReceiptImage(elementId);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }

        const file = new File([blob], 'receipt.png', { type: 'image/png' });
        
        const defaultShareOptions = {
          files: [file],
          title: "Sage's Receipt",
          text: "Check out my truth receipt! #GetTheReceipts",
          url: 'https://getthereceipts.com'
        };

        const finalShareOptions = { ...defaultShareOptions, ...shareOptions };

        // Check if Web Share API is available and can share files
        if (hasWebShareAPI() && canShareFiles() && navigator.canShare(finalShareOptions)) {
          try {
            await navigator.share(finalShareOptions);
            resolve({ success: true, method: 'web-share' });
          } catch (shareError) {
            if (shareError.name === 'AbortError') {
              resolve({ success: false, method: 'web-share', error: 'User cancelled share' });
            } else {
              reject(shareError);
            }
          }
        } else {
          // Fallback: download the image
          const timestamp = Date.now();
          saveAs(blob, `receipt-${timestamp}.png`);
          resolve({ 
            success: true, 
            method: 'download-fallback',
            message: 'Web Share not available. Image downloaded instead.'
          });
        }
      });
    });
  } catch (error) {
    console.error('Share receipt error:', error);
    return { success: false, error: error.message };
  }
};

export const testMobileCapabilities = () => {
  const capabilities = {
    isMobile: isMobile(),
    hasWebShareAPI: hasWebShareAPI(),
    canShareFiles: canShareFiles(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };

  console.log('Mobile Capabilities:', capabilities);
  return capabilities;
};

export const getMobileSaveShareStrategy = () => {
  const capabilities = testMobileCapabilities();
  
  if (capabilities.isMobile && capabilities.hasWebShareAPI && capabilities.canShareFiles) {
    return 'web-share';
  } else if (capabilities.isMobile) {
    return 'download-mobile';
  } else {
    return 'download-desktop';
  }
};

// Enhanced mobile save/share with better error handling
export const mobileSaveShare = async (elementId, options = {}) => {
  const { 
    action = 'both', // 'save', 'share', or 'both'
    filename = 'receipt.png',
    shareText = "Check out my truth receipt! #GetTheReceipts",
    onSuccess = () => {},
    onError = () => {},
    onProgress = () => {}
  } = options;

  try {
    onProgress('Generating image...');
    const canvas = await generateReceiptImage(elementId);
    
    onProgress('Processing image...');
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      });
    });

    const results = {};

    // Handle save action
    if (action === 'save' || action === 'both') {
      onProgress('Saving image...');
      const timestamp = Date.now();
      const finalFilename = filename.includes('.') ? filename : `${filename}-${timestamp}.png`;
      saveAs(blob, finalFilename);
      results.save = { success: true, filename: finalFilename };
    }

    // Handle share action
    if (action === 'share' || action === 'both') {
      onProgress('Sharing image...');
      const file = new File([blob], 'receipt.png', { type: 'image/png' });
      
      if (hasWebShareAPI() && canShareFiles() && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Sage's Receipt",
            text: shareText,
            url: 'https://getthereceipts.com'
          });
          results.share = { success: true, method: 'web-share' };
        } catch (shareError) {
          if (shareError.name === 'AbortError') {
            results.share = { success: false, method: 'web-share', error: 'User cancelled' };
          } else {
            // Fallback to download
            const timestamp = Date.now();
            saveAs(blob, `receipt-${timestamp}.png`);
            results.share = { 
              success: true, 
              method: 'download-fallback',
              message: 'Web Share failed, downloaded instead'
            };
          }
        }
      } else {
        // Fallback to download
        const timestamp = Date.now();
        saveAs(blob, `receipt-${timestamp}.png`);
        results.share = { 
          success: true, 
          method: 'download-fallback',
          message: 'Web Share not available, downloaded instead'
        };
      }
    }

    onSuccess(results);
    return results;

  } catch (error) {
    console.error('Mobile save/share error:', error);
    onError(error);
    return { success: false, error: error.message };
  }
};


