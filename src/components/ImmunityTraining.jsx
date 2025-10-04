import React, { memo, useMemo } from 'react';
import { Shield, AlertTriangle, Zap, Eye, LogOut, Crown, CheckCircle, Calendar, Target, TrendingUp, Clock, Mic, Activity, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';
import sageDarkCircle from '@/assets/sage-dark-circle.png';

const ImmunityTraining = memo(({ immunityData, archetypeName = "The Gaslighter", isCrisisSituation = false, isPremium = false, originalMessage, context, analysisData }) => {
  const { toast } = useToast();
  
  // Extract user names from analysis data
  const userName = analysisData?.userName || context?.userName || 'You';
  const otherName = analysisData?.otherName || context?.otherName || 'Them';
  
  // Memoize debug logging to prevent excessive output
  useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ ImmunityTraining received:', immunityData);
      console.log('🛡️ Type:', typeof immunityData, 'Keys:', immunityData ? Object.keys(immunityData) : 'none');
      console.log('🆘 Crisis situation:', isCrisisSituation);
      console.log('🛡️ Original message:', originalMessage);
      console.log('🛡️ Context:', context);
      console.log('🛡️ Analysis data:', analysisData);
      console.log('🛡️ User names:', { userName: analysisData?.userName, otherName: analysisData?.otherName });
      console.log('🛡️ Extracted names:', { userName, otherName });
      console.log('🛡️ Available fields for characteristics:', {
        keyCharacteristics: immunityData?.keyCharacteristics,
        characteristics: immunityData?.characteristics,
        redFlagDrills: immunityData?.redFlagDrills,
        earlyWarnings: immunityData?.earlyWarnings,
        sketchySigns: immunityData?.sketchySigns,
        healthySigns: immunityData?.healthySigns
      });
    }
  }, [immunityData, isCrisisSituation]);

  // Crisis-specific content
  if (isCrisisSituation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Crisis Safety Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-full px-6 py-3 mb-4">
              <span className="text-2xl">🆘</span>
              <span className="text-lg font-bold text-red-300">CRISIS SAFETY GUIDANCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Your Safety Matters Most
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              This situation requires immediate attention and professional support. Here's how to protect yourself and others.
            </p>
          </div>

          {/* Crisis Resources Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Immediate Safety */}
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                <span>🚨</span> Immediate Safety
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">If you're in immediate danger, call 911 or your local emergency number</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">Get to a safe location away from the situation</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg">•</span>
                  <p className="text-gray-200">Contact a trusted friend or family member immediately</p>
                </div>
              </div>
            </div>

            {/* Professional Support */}
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                <span>🏥</span> Professional Support
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">National Suicide Prevention Lifeline: 988</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">RAINN Sexual Assault Hotline: 1-800-656-4673</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 text-lg">•</span>
                  <p className="text-gray-200">Crisis Text Line: Text HOME to 741741</p>
                </div>
              </div>
            </div>
          </div>

          {/* Universal Safety Principles */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <span>🛡️</span> Universal Safety Principles
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-200 mb-2">If You're Experiencing This:</h4>
                <ul className="space-y-2 text-gray-200">
                  <li>• Your feelings are valid and real</li>
                  <li>• This is not your fault</li>
                  <li>• You deserve safety and support</li>
                  <li>• Professional help is available 24/7</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-200 mb-2">If You're Observing This:</h4>
                <ul className="space-y-2 text-gray-200">
                  <li>• Take the situation seriously</li>
                  <li>• Encourage professional help</li>
                  <li>• Don't try to handle it alone</li>
                  <li>• Report to authorities if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 text-center">
            <p className="text-yellow-200 text-lg font-medium">
              <span className="text-2xl mr-2">⚠️</span>
              This analysis is not a substitute for professional mental health care, medical attention, or emergency services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Better element detection using computed styles
  const fixGradientElements = (element) => {
    const allElements = element.querySelectorAll('*');
    const originalElements = [];
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.webkitBackgroundClip === 'text' || 
          computedStyle.backgroundClip === 'text' ||
          computedStyle.webkitTextFillColor === 'transparent') {
        
        const originalHTML = el.outerHTML;
        originalElements.push({ element: el, originalHTML });
        
        // Create replacement with solid gold color
        const replacement = el.cloneNode(true);
        replacement.style.background = 'none';
        replacement.style.webkitBackgroundClip = 'initial';
        replacement.style.backgroundClip = 'initial';
        replacement.style.webkitTextFillColor = '#D4AF37';
        replacement.style.color = '#D4AF37';
        
        el.parentNode.replaceChild(replacement, el);
      }
    });
    
    return originalElements;
  };
  
  const restoreOriginalElements = (originalElements) => {
    originalElements.forEach(({ element, originalHTML }) => {
      const parent = element.parentNode || element.parentElement;
      if (parent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        const restoredElement = tempDiv.firstChild;
        parent.replaceChild(restoredElement, element);
      }
    });
  };

  const handleSaveBadge = async () => {
    const element = document.querySelector('[data-immunity-component]');
    if (!element) {
      toast({ 
        title: "Error", 
        description: "Could not find immunity training component to save.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const blob = await domtoimage.toBlob(element, {
        width: element.offsetWidth * 2,
        height: element.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        },
        bgcolor: '#1a1a2e',
        quality: 1,
        filter: (node) => {
          // Remove border styles from captured elements
          if (node.style) {
            node.style.border = 'none';
            node.style.borderTop = 'none';
            node.style.borderBottom = 'none';
            node.style.borderLeft = 'none';
            node.style.borderRight = 'none';
          }
          return true;
        }
      });
      
      const timestamp = Date.now();
      saveAs(blob, `Sage's Immunity #${timestamp}.png`);
      toast({ title: "Badge saved!", description: "Your immunity badge has been downloaded." });
    } catch (error) {
      console.error('Error saving badge:', error);
      toast({ 
        title: "Error", 
        description: "Could not save badge. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleShareTrophy = async () => {
    try {
      const element = document.querySelector('[data-immunity-component]');
      const shareText = `🛡️ Just completed my SAGE Immunity Training! Now I'm protected against ${archetypeName} tactics. Get your own protection at getthereceipts.com #GetTheReceipts #ImmunityTraining #SageSays`;
      
      if (element && navigator.share) {
        try {
          const blob = await domtoimage.toBlob(element, {
            width: element.offsetWidth * 2,
            height: element.offsetHeight * 2,
            style: {
              transform: 'scale(2)',
              transformOrigin: 'top left'
            },
            bgcolor: '#1a1a2e',
            quality: 1,
            filter: (node) => {
              // Remove border styles from captured elements
              if (node.style) {
                node.style.border = 'none';
                node.style.borderTop = 'none';
                node.style.borderBottom = 'none';
                node.style.borderLeft = 'none';
                node.style.borderRight = 'none';
              }
              return true;
            }
          });
          
          if (blob) {
            const file = new File([blob], `sages-immunity-${Date.now()}.png`, { type: 'image/png' });
            try {
              await navigator.share({
                title: 'SAGE Immunity Training Complete',
                text: shareText,
                url: 'https://getthereceipts.com',
                files: [file]
              });
            } catch (shareError) {
              // Fallback to text-only share
              await navigator.share({
                title: 'SAGE Immunity Training Complete',
                text: shareText,
                url: 'https://getthereceipts.com'
              });
            }
          }
        } catch (error) {
          copyToClipboard(shareText);
        }
      } else {
        copyToClipboard(shareText);
      }
    } catch (error) {
      console.log('Error in share function:', error);
      const shareText = `🛡️ Just completed my SAGE Immunity Training! Now I'm protected against ${archetypeName} tactics. Get your own protection at getthereceipts.com #GetTheReceipts #ImmunityTraining #SageSays`;
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Share text copied to clipboard." });
    }).catch(() => {
      toast({ 
        title: "Error", 
        description: "Could not copy to clipboard.", 
        variant: "destructive" 
      });
    });
  };
  
  // Save Immunity (Clean) using same mechanics as Truth Receipt
  const handleSaveImmunity = async () => {
    const element = document.querySelector('[data-immunity-component]');
    if (!element) {
      toast({ title: 'Error', description: 'Could not find immunity component to save.', variant: 'destructive' });
      return;
    }

    // Hide everything except: Header Pill, Pattern Verified, THE CYCLE, SEE BOTH SIDES, Your Training, SAGE'S BLESSING
    const nodesToHide = Array.from(element.querySelectorAll('[data-share-hide="true"]'));
    
    // Hide third items in See Both Sides for save/share (keep only 2 each)
    const thirdGreenFlags = Array.from(element.querySelectorAll('[data-green-flag="true"]'));
    const thirdRedFlags = Array.from(element.querySelectorAll('[data-red-flag="true"]'));

    // For clean share: show all training items (no longer limiting to 1)
    const allToHide = [...nodesToHide, ...thirdGreenFlags, ...thirdRedFlags];
    const previousDisplays = allToHide.map(n => n.style.display);

    try {
      // Hide unwanted sections
      allToHide.forEach(n => { n.style.display = 'none'; });

      // Force desktop cycle layout on all devices for export
      const mobileCycle = element.querySelector('[data-cycle-mobile]');
      const desktopCycle = element.querySelector('[data-cycle-desktop]');
      const prevMobileDisplay = mobileCycle ? mobileCycle.style.display : null;
      const prevDesktopDisplay = desktopCycle ? desktopCycle.style.display : null;
      if (mobileCycle) mobileCycle.style.display = 'none';
      if (desktopCycle) desktopCycle.style.display = 'block';

      // Ensure pill text stays on one line during export
      const immunityPill = element.querySelector('[data-immunity-pill]');
      const sageLogo = element.querySelector('[data-immunity-pill] img');
      const prevPillStyles = immunityPill ? {
        padding: immunityPill.style.padding,
        whiteSpace: immunityPill.style.whiteSpace,
        minWidth: immunityPill.style.minWidth,
        fontSize: immunityPill.style.fontSize
      } : null;
      const prevSageLogoStyles = sageLogo ? {
        width: sageLogo.style.width,
        height: sageLogo.style.height
      } : null;
      
      if (immunityPill) {
        immunityPill.style.padding = '6px 10px'; // Reduced by additional 20%
        immunityPill.style.whiteSpace = 'nowrap';
        immunityPill.style.minWidth = '170px'; // Reduced by additional 20%
        immunityPill.style.fontSize = '10px'; // Reduced by additional 20%
      }
      
      // Also reduce the Sage logo size within the pill
      if (sageLogo) {
        sageLogo.style.width = '64px'; // Increased for save/share download
        sageLogo.style.height = '64px'; // Increased for save/share download
      }

      // Reduce padding and remove borders for save/share export only
      const cycleSection = element.querySelector('[data-cycle-section]');
      const trainingSection = element.querySelector('[data-training-section]');
      const patternDnaSection = element.querySelector('[data-pattern-dna-section]');
      const seeBothSidesSection = element.querySelector('[data-see-both-sides-section]');
      const patternVerifiedSection = element.querySelector('[data-pattern-verified-section]');
      const sageContainer = element.querySelector('[data-sage-blessing-container]');
      const sageHeader = element.querySelector('[data-sage-blessing-header]');
      const sageContent = element.querySelector('[data-sage-blessing-content]');
      const sageText = element.querySelector('[data-sage-blessing-text]');
      
      // Store original styles for restoration
      const cycleInner = cycleSection?.querySelector('.bg-black\\/30');
      const cycleContent = cycleSection?.querySelector('.p-4');
      const cycleHeader = cycleSection?.querySelector('.px-4.py-3');
      const trainingInner = trainingSection?.querySelector('.bg-black\\/30');
      const trainingItems = trainingSection?.querySelectorAll('.space-y-3');
      const trainingCards = trainingSection?.querySelectorAll('.p-3');
      const trainingHeader = trainingSection?.querySelector('.px-4.py-3');
      const patternDnaInner = patternDnaSection?.querySelector('.bg-black\\/30');
      
      const prevStyles = {
        cycle: cycleSection ? {
          marginBottom: cycleSection.style.marginBottom,
          border: cycleSection.style.border,
          paddingBottom: cycleSection.style.paddingBottom
        } : null,
        cycleInner: cycleInner ? {
          padding: cycleInner.style.padding,
          border: cycleInner.style.border
        } : null,
        cycleContent: cycleContent ? {
          padding: cycleContent.style.padding
        } : null,
        cycleHeader: cycleHeader ? {
          padding: cycleHeader.style.padding
        } : null,
        training: trainingSection ? {
          marginBottom: trainingSection.style.marginBottom,
          border: trainingSection.style.border
        } : null,
        trainingInner: trainingInner ? {
          padding: trainingInner.style.padding,
          border: trainingInner.style.border
        } : null,
        trainingItems: trainingItems ? Array.from(trainingItems).map(item => ({
          gap: item.style.gap
        })) : null,
        trainingCards: trainingCards ? Array.from(trainingCards).map(card => ({
          padding: card.style.padding,
          textFontSize: card.querySelector('p.text-stone-200\\/90')?.style.fontSize
        })) : null,
        trainingHeader: trainingHeader ? {
          padding: trainingHeader.style.padding
        } : null,
        patternDna: patternDnaSection ? {
          marginBottom: patternDnaSection.style.marginBottom,
          border: patternDnaSection.style.border
        } : null,
        patternDnaInner: patternDnaInner ? {
          padding: patternDnaInner.style.padding,
          border: patternDnaInner.style.border
        } : null,
        seeBothSides: seeBothSidesSection ? {
          marginBottom: seeBothSidesSection.style.marginBottom,
          border: seeBothSidesSection.style.border
        } : null,
        patternVerified: patternVerifiedSection ? {
          marginTop: patternVerifiedSection.style.marginTop,
          marginBottom: patternVerifiedSection.style.marginBottom
        } : null,
        sage: {
          container: sageContainer ? {
            padding: sageContainer.style.padding,
            marginBottom: sageContainer.style.marginBottom,
            border: sageContainer.style.border
          } : null,
          header: sageHeader ? {
            marginBottom: sageHeader.style.marginBottom
          } : null,
          content: sageContent ? {
            padding: sageContent.style.padding,
            marginBottom: sageContent.style.marginBottom
          } : null,
          text: sageText ? {
            fontSize: sageText.style.fontSize
          } : null
        }
      };

      // Apply compact styles for save/share export
      if (cycleSection) {
        cycleSection.style.marginBottom = '6px';
        cycleSection.style.border = 'none';
      }
      if (trainingSection) {
        trainingSection.style.marginBottom = '4px'; // Further reduced from 6px
        trainingSection.style.border = 'none';
      }
      if (patternDnaSection) {
        patternDnaSection.style.marginBottom = '6px';
        patternDnaSection.style.border = 'none';
      }
      if (seeBothSidesSection) {
        seeBothSidesSection.style.marginBottom = '6px';
        seeBothSidesSection.style.border = 'none';
      }
      if (patternVerifiedSection) {
        patternVerifiedSection.style.marginTop = '4px'; // Reduced from mt-2 (8px)
        patternVerifiedSection.style.marginBottom = '12px'; // Reduced from mb-6 (24px)
      }
      
      // Also reduce padding in the inner containers
      
      if (cycleInner) {
        cycleInner.style.padding = '8px';
        cycleInner.style.border = 'none';
      }
      
      // Also reduce padding in the cycle content area specifically
      if (cycleContent) {
        cycleContent.style.padding = '6px 6px 2px 6px'; // Further reduce all padding
      }
      
      // Reduce padding in the cycle header area
      if (cycleHeader) {
        cycleHeader.style.padding = '6px 8px';
      }
      
      // Reduce bottom padding of the cycle section container
      if (cycleSection) {
        cycleSection.style.paddingBottom = '4px';
      }
      if (trainingInner) {
        trainingInner.style.padding = '4px'; // Further reduced from 6px
        trainingInner.style.border = 'none';
      }
      
      // Also reduce spacing between training items
      trainingItems.forEach(item => {
        if (item) {
          item.style.gap = '2px'; // Further reduced from 4px to 2px
        }
      });
      
      // Reduce padding within each training item
      trainingCards.forEach(card => {
        if (card) {
          card.style.padding = '4px'; // Further reduced from 6px
          // Also reduce font size of training text to 14px
          const trainingText = card.querySelector('p.text-stone-200\\/90');
          if (trainingText) {
            trainingText.style.fontSize = '14px';
          }
        }
      });
      
      // Reduce padding in the training header area
      if (trainingHeader) {
        trainingHeader.style.padding = '4px 6px'; // Further reduced from 6px 8px
      }
      if (patternDnaInner) {
        patternDnaInner.style.padding = '10px';
        patternDnaInner.style.border = 'none';
      }
      if (sageContainer) {
        sageContainer.style.padding = '12px';
        sageContainer.style.marginBottom = '6px';
        sageContainer.style.border = 'none';
      }
      if (sageHeader) {
        sageHeader.style.marginBottom = '8px';
      }
      if (sageContent) {
        sageContent.style.padding = '0 8px';
        sageContent.style.marginBottom = '8px';
      }
      if (sageText) {
        sageText.style.fontSize = '16px'; // Increased for better readability
      }

      // Add export-mode class to remove all borders (like Truth Receipt)
      element.classList.add('export-mode');

      // Ensure rounded outer corners render with transparency
      const prevRadius = element.style.borderRadius;
      const prevOverflow = element.style.overflow;
      const prevHeight = element.style.height;
      const prevMaxHeight = element.style.maxHeight;
      const prevOverflowY = element.style.overflowY;
      element.style.borderRadius = '24px';
      element.style.overflow = 'hidden';
      element.style.height = 'auto';
      element.style.maxHeight = 'none';
      element.style.overflowY = 'visible';

      // Use scroll size to capture full content like Truth/ShareComponent
      const targetWidth = element.scrollWidth || element.offsetWidth;
      const targetHeight = Math.max(element.scrollHeight, element.offsetHeight, element.clientHeight);

      const dataUrl = await domtoimage.toPng(element, {
        pixelRatio: 2.5,
        quality: 1.0,
        bgcolor: 'transparent',
        width: targetWidth,
        height: targetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'center'
        }
      });

      // Convert data URL to blob for consistent downloader
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const timestamp = Date.now();
      saveAs(blob, `Sage-Immunity-${timestamp}.png`);
      toast({ title: 'Saved!', description: 'Immunity image downloaded.' });
    } catch (err) {
      console.error('Save immunity error', err);
      toast({ title: 'Error', description: 'Could not save immunity.', variant: 'destructive' });
    } finally {
      // Restore hidden nodes
      allToHide.forEach((n, i) => { n.style.display = previousDisplays[i]; });
      // Restore forced layout
      if (mobileCycle && prevMobileDisplay !== null) mobileCycle.style.display = prevMobileDisplay;
      if (desktopCycle && prevDesktopDisplay !== null) desktopCycle.style.display = prevDesktopDisplay;
      
      // Restore pill styles
      if (immunityPill && prevPillStyles) {
        immunityPill.style.padding = prevPillStyles.padding;
        immunityPill.style.whiteSpace = prevPillStyles.whiteSpace;
        immunityPill.style.minWidth = prevPillStyles.minWidth;
        immunityPill.style.fontSize = prevPillStyles.fontSize;
      }
      if (sageLogo && prevSageLogoStyles) {
        sageLogo.style.width = prevSageLogoStyles.width;
        sageLogo.style.height = prevSageLogoStyles.height;
      }
      
      // Restore all modified styles
      if (cycleSection && prevStyles.cycle) {
        cycleSection.style.marginBottom = prevStyles.cycle.marginBottom;
        cycleSection.style.border = prevStyles.cycle.border;
        cycleSection.style.paddingBottom = prevStyles.cycle.paddingBottom;
      }
      if (cycleInner && prevStyles.cycleInner) {
        cycleInner.style.padding = prevStyles.cycleInner.padding;
        cycleInner.style.border = prevStyles.cycleInner.border;
      }
      if (cycleContent && prevStyles.cycleContent) {
        cycleContent.style.padding = prevStyles.cycleContent.padding;
      }
      if (cycleHeader && prevStyles.cycleHeader) {
        cycleHeader.style.padding = prevStyles.cycleHeader.padding;
      }
      if (trainingSection && prevStyles.training) {
        trainingSection.style.marginBottom = prevStyles.training.marginBottom;
        trainingSection.style.border = prevStyles.training.border;
      }
      if (trainingInner && prevStyles.trainingInner) {
        trainingInner.style.padding = prevStyles.trainingInner.padding;
        trainingInner.style.border = prevStyles.trainingInner.border;
      }
      if (trainingItems && prevStyles.trainingItems) {
        trainingItems.forEach((item, index) => {
          if (prevStyles.trainingItems[index]) {
            item.style.gap = prevStyles.trainingItems[index].gap;
          }
        });
      }
      if (trainingCards && prevStyles.trainingCards) {
        trainingCards.forEach((card, index) => {
          if (prevStyles.trainingCards[index]) {
            card.style.padding = prevStyles.trainingCards[index].padding;
            // Restore original font size
            const trainingText = card.querySelector('p.text-stone-200\\/90');
            if (trainingText && prevStyles.trainingCards[index].textFontSize) {
              trainingText.style.fontSize = prevStyles.trainingCards[index].textFontSize;
            }
          }
        });
      }
      if (trainingHeader && prevStyles.trainingHeader) {
        trainingHeader.style.padding = prevStyles.trainingHeader.padding;
      }
      if (patternDnaSection && prevStyles.patternDna) {
        patternDnaSection.style.marginBottom = prevStyles.patternDna.marginBottom;
        patternDnaSection.style.border = prevStyles.patternDna.border;
      }
      if (patternDnaInner && prevStyles.patternDnaInner) {
        patternDnaInner.style.padding = prevStyles.patternDnaInner.padding;
        patternDnaInner.style.border = prevStyles.patternDnaInner.border;
      }
      if (seeBothSidesSection && prevStyles.seeBothSides) {
        seeBothSidesSection.style.marginBottom = prevStyles.seeBothSides.marginBottom;
        seeBothSidesSection.style.border = prevStyles.seeBothSides.border;
      }
      if (patternVerifiedSection && prevStyles.patternVerified) {
        patternVerifiedSection.style.marginTop = prevStyles.patternVerified.marginTop;
        patternVerifiedSection.style.marginBottom = prevStyles.patternVerified.marginBottom;
      }
      if (sageContainer && prevStyles.sage.container) {
        sageContainer.style.padding = prevStyles.sage.container.padding;
        sageContainer.style.marginBottom = prevStyles.sage.container.marginBottom;
        sageContainer.style.border = prevStyles.sage.container.border;
      }
      if (sageHeader && prevStyles.sage.header) {
        sageHeader.style.marginBottom = prevStyles.sage.header.marginBottom;
      }
      if (sageContent && prevStyles.sage.content) {
        sageContent.style.padding = prevStyles.sage.content.padding;
        sageContent.style.marginBottom = prevStyles.sage.content.marginBottom;
      }
      if (sageText && prevStyles.sage.text) {
        sageText.style.fontSize = prevStyles.sage.text.fontSize;
      }
      
      // Remove export-mode class
      element.classList.remove('export-mode');
      // Restore rounded/size overrides
      element.style.borderRadius = prevRadius;
      element.style.overflow = prevOverflow;
      element.style.height = prevHeight;
      element.style.maxHeight = prevMaxHeight;
      element.style.overflowY = prevOverflowY;
    }
  };
  
  if (!immunityData || typeof immunityData !== 'object') {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-400/20 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full mb-4">
          <span className="text-2xl">🏗️</span>
        </div>
        <h3 className="text-emerald-300 font-bold text-lg mb-2">Your Immunity Training is Being Crafted</h3>
        <p className="text-stone-300/90 text-xl leading-relaxed">Sage is preparing your personalized protection strategies. This premium feature will be available soon.</p>
      </div>
    );
  }

  // Extract new schema data with fallbacks
  const {
    patternDNA,
    patternLoop = [],
    greenFlags = [],
    thisMessFlags = [],
    immunityTraining = [],
    immunityTest,
    sageBlessing,
    riskLevel = 'medium',
    safetyNote
  } = immunityData;

  
  // Determine risk level based on archetype
  const actualRiskLevel = archetypeName?.includes('Healthy Partner') || 
                         archetypeName?.includes('Green Flag') ||
                         archetypeName?.toLowerCase().includes('healthy') 
                         ? 'low' : riskLevel;

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-500/30 bg-green-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
      case 'high': return 'text-red-400 border-red-500/30 bg-red-900/20';
      default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    }
  };

  // Match Viral Receipt color coding: green (0-3), orange (4-6), red (7-10)
  const getHeaderArchetypeColor = () => {
    if (actualRiskLevel === 'low') return '#34D399'; // emerald-400
    if (actualRiskLevel === 'high') return '#F87171'; // red-400
    return '#FB923C'; // orange-400
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-0 pb-6">
      
      {/* Main Immunity Card - Mobile-optimized with max-width constraints */}
      <motion.div 
        data-immunity-component
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative rounded-[24px] p-3 sm:p-4 md:p-6 text-stone-200/90"
        style={{
          background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.15), 0 0 80px rgba(212, 175, 55, 0.06)'
        }}
      >
        {/* Premium dot pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Immunity Training Header - Matches Receipt pill header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-center mb-1 relative z-50">
            <div className="inline-flex items-center gap-3 bg-black/40 px-8 py-2 rounded-full border border-stone-400/20 mb-2 relative z-50" data-immunity-pill>
              <img
                src={sageDarkCircle}
                alt="Sage"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-teal-400/40 relative z-50"
            style={{ 
                  filter: 'brightness(1.2) contrast(1.1)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)'
                }}
              />
              <span className="text-sm sm:text-lg font-bold tracking-widest relative z-50"
                style={{
                  color: '#14B8A6',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(20, 184, 166, 0.4)'
                }}>
                IMMUNITY TRAINING
              </span>
            </div>
            {/* Pattern Verified subline */}
            <div className="mt-2 mb-6" data-pattern-verified-section>
              <h3
                className="heading-font font-extrabold text-lg sm:text-xl md:text-2xl leading-tight"
                style={{ color: getHeaderArchetypeColor(), textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              >
                Pattern Verified: {archetypeName?.replace(/^The /, '') || 'Pattern'}
            </h3>
            </div>
          </div>
        </motion.div>

        {/* Pattern DNA Formula - Central Visual */}
        {patternDNA && (
          <div className="mb-8" data-share-hide="true" data-pattern-dna-section>
            <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm">
              <div className="px-4 py-3 border-b border-transparent">
              <div className="flex items-center gap-2">
                  <span className="text-lg">🧬</span>
                  <h4 className="font-bold text-sm tracking-wide uppercase" style={{ color: '#14B8A6' }}>What This Looks Like</h4>
              </div>
            </div>
              <div className="p-6 text-center">
                <div className="text-lg sm:text-xl font-medium text-stone-200/90 leading-relaxed"
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6'
                  }}>
                  {patternDNA}
                  </div>
                </div>
            </div>
          </div>
        )}


        {/* The Cycle - Prominent & Animated */}
        {patternLoop.length > 0 && (
          <div className="mb-8" data-cycle-section>
            <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
            style={{
                border: '1px solid rgba(20, 184, 166, 0.35)',
                boxShadow: '0 0 0 1px rgba(20, 184, 166, 0.25), 0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              }}>
              <div className="px-4 py-3 border-b border-transparent">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg animate-pulse">🔄</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                    The Cycle
                  </h4>
              </div>
            </div>
            
              <div className="p-4">
                {/* Mobile: Circular Layout with Numbers */}
                <div className="sm:hidden" data-cycle-mobile>
                  <div className="relative flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs relative">
                      {patternLoop.slice(0, 4).map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + index * 0.1 }}
                          className="bg-cyan-900/30 text-cyan-300 px-2 py-2 rounded-xl text-xs font-medium text-center border border-cyan-500/20 hover:bg-cyan-800/40 transition-all duration-300 relative"
                          style={{
                            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                          }}
                        >
                          <div className="absolute -top-2 -left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                  </div>
                          {step}
                        </motion.div>
                      ))}
                  </div>
                </div>
                <div className="text-center mt-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 0.85,
                        color: actualRiskLevel === 'low'
                          ? ['#06B6D4', '#22D3EE', '#06B6D4']
                          : ['#FF6B6B', '#FF8E53', '#FF6B6B']
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-xs tracking-wide"
                    >
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                    </motion.span>
                </div>
              </div>
              
                {/* Desktop: Prominent Circular Flow */}
                <div className="hidden sm:block" data-cycle-desktop>
                  <div className="relative flex items-center justify-center">
                    <div className="flex items-center justify-center gap-3">
                      {patternLoop.slice(0, 4).map((step, index) => (
                    <React.Fragment key={step}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-cyan-900/30 text-cyan-300 px-3 py-2 rounded-xl text-sm font-medium text-center border border-cyan-500/20 hover:scale-105 hover:bg-cyan-800/40 transition-all duration-300 cursor-default min-w-[100px]"
                            style={{
                              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.15)'
                            }}
                          >
                        {step}
                          </motion.div>
                          {index < patternLoop.length - 1 && (
                            <span 
                              className="text-lg flex-shrink-0 z-10 relative"
                              style={{
                                color: '#FF6B6B',
                                textShadow: '0 0 8px rgba(255, 107, 107, 0.4)',
                                opacity: 1
                              }}
                            >
                              →
                            </span>
                      )}
                    </React.Fragment>
                      ))}
                    </div>
                </div>
                <div className="w-full flex justify-center mt-3">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 0.85,
                        color: actualRiskLevel === 'low'
                          ? ['#06B6D4', '#22D3EE', '#06B6D4']
                          : ['#FF6B6B', '#FF8E53', '#FF6B6B']
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-sm tracking-wide"
                    >
                    {actualRiskLevel === 'low' ? '↻ Healthy Cycle' : '↻ Endless Loop'}
                    </motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Immunity Test - Field Test */}
        {immunityTest && (
          <div className="mb-8" data-share-hide="true">
            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer">
              <div className="px-4 py-3 border-b border-white/10">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg animate-pulse">🧪</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                    Immunity Test
                  </h4>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed text-center font-medium" 
                  style={{ 
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6'
                  }}>
                  {immunityTest}
                </p>
              </div>
              
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(255,255,255,0.06)' }} />
            </div>
          </div>
        )}

        {/* Green Flags vs This Mess */}
        <div className="mb-8" data-see-both-sides-section>
          <div className="bg-black/30 rounded-xl border border-transparent overflow-hidden backdrop-blur-sm shadow-lg">
            {/* Main Header */}
            <div className="px-4 py-3 border-b border-transparent">
              <div className="flex items-center justify-start gap-2">
                <span className="text-lg">⚖️</span>
                <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>See Both Sides</h4>
              </div>
            </div>
            
            {/* Tab-style Headers */}
            <div className="grid grid-cols-2">
              <div className="px-4 py-3 bg-gradient-to-br from-emerald-500/15 to-green-500/10 border-r border-slate-600/30 relative">
                <div className="absolute inset-0 bg-emerald-400/5"></div>
                <h5 className="text-emerald-400 font-bold text-xs sm:text-sm text-center relative z-10">🟢 Healthy Version</h5>
              </div>
              <div className="px-4 py-3 bg-gradient-to-br from-rose-500/15 to-pink-500/10 relative">
                <div className="absolute inset-0 bg-rose-400/5"></div>
                <h5 className="text-rose-400 font-bold text-xs sm:text-sm text-center relative z-10">🔴 What You Got</h5>
              </div>
            </div>
            
            {/* Content - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-600/20">
              {/* Green Flags */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                <ul className="space-y-3">
                  {Array.isArray(greenFlags) && greenFlags.length > 0 ? greenFlags.slice(0, 3).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-green-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">{sign}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-emerald-200 text-sm leading-relaxed">No healthy signs detected</span>
                    </li>
                  )}
                </ul>
              </div>
              
              {/* This Mess Flags */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
                <ul className="space-y-3">
                  {Array.isArray(thisMessFlags) && thisMessFlags.length > 0 ? thisMessFlags.slice(0, 3).map((sign, index) => (
                    <li key={index} className={`flex items-start gap-3 ${index >= 2 ? 'hidden sm:flex' : ''}`} data-red-flag={index >= 2 ? "true" : undefined}>
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className="text-rose-200 text-sm leading-relaxed">{sign}</span>
                    </li>
                  )) : (
                    <li className="flex items-start gap-3">
                      <span className="text-rose-400 text-sm mt-0.5 flex-shrink-0">⚠</span>
                      <span className="text-rose-200 text-sm leading-relaxed">No red flags detected</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Your Training - Checkpoints */}
        {immunityTraining.length > 0 && (
          <div className="mb-8" data-training-section>
            <div className="bg-black/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-lg"
              style={{
                border: 'none',
                boxShadow: '0 8px 32px rgba(20, 184, 166, 0.12), 0 0 40px rgba(20, 184, 166, 0.08)',
                backgroundImage: 'linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(255,255,255,0.02) 100%)'
              }}>
              <div className="px-4 py-3 border-b border-transparent">
                <div className="flex items-center justify-start gap-2">
                  <span className="text-lg">🎯</span>
                  <h4 className="font-bold text-sm sm:text-base tracking-wide uppercase" style={{ color: '#14B8A6' }}>
                    Your Training
                  </h4>
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {immunityTraining.map((checkpoint, index) => (
                    <motion.div
                      key={index}
                      data-training-item={index > 0 ? "true" : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-transparent hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-transparent">
                        <span className="text-teal-300 text-sm font-bold">✓</span>
                      </div>
                      <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed font-medium">
                        {checkpoint}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Paywall - Show tease for free users */}
        {!isPremium && !isCrisisSituation ? (
          <div className="mb-8" data-share-hide="true">
            {/* Premium Tease */}
            <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-3xl p-6 sm:p-8 border border-amber-400/30 relative overflow-hidden backdrop-blur-sm shadow-lg">
              {/* Unlock Icon */}
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/40">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              
              {/* Content */}
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-amber-300 mb-3">Unlock Your Defense Training</h3>
                <p className="text-amber-200/90 text-lg leading-relaxed max-w-md mx-auto">
                  Get your personalized immunity checkpoints, field test, and Sage's blessing for {userName}.
                </p>
              </div>
              
              {/* Premium Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="text-amber-300 font-semibold">Training Checkpoints</h4>
                  </div>
                  <p className="text-amber-200/70 text-sm">3 specific "if this, then that" rules for your situation</p>
                </div>
                <div className="bg-amber-500/10 rounded-2xl p-4 border border-amber-400/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🧪</span>
                    <h4 className="text-amber-300 font-semibold">Field Test</h4>
                  </div>
                  <p className="text-amber-200/70 text-sm">One experiment to verify the pattern and test your immunity</p>
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="text-center">
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  ⚡ Unlock Training
                  <Crown className="w-5 h-5" />
                </button>
                <p className="text-amber-200/60 text-sm mt-3">Unlimited receipts • Full immunity training • Defense strategies</p>
              </div>
            </div>
          </div>
        ) : (
          <>


        {/* Sage's Blessing - Premium Sunset Treatment */}
        {sageBlessing && (
        <div className="mb-8">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 relative overflow-hidden" data-sage-blessing-container style={{
              background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(10px)',
            borderRadius: '24px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.12)'
          }}>
              <div className="text-center mb-6 sm:mb-8" data-sage-blessing-header>
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-4" style={{ color: '#F59E0B' }} />
              <h4 className="font-bold text-base sm:text-lg md:text-xl tracking-wide" 
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                SAGE'S BLESSING
              </h4>
            </div>
            
              <div className="px-4 sm:px-6 mb-8" data-sage-blessing-content>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-center leading-relaxed" data-sage-blessing-text
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.6'
                }}>
                  "{sageBlessing}"
              </p>
            </div>
            
              
              
              <p className="text-center text-white/60 text-xs" data-share-hide="true">Blessed by Sage 🔮</p>
          </div>
        </div>
        )}

            {/* DISCLAIMER */}
            <div className="text-center mt-4 mb-4" data-share-hide="true">
              <p className="text-xs text-stone-400/70 italic">
                For entertainment purposes - Sage calls it like she sees it
              </p>
            </div>
            
            {/* WATERMARK - moved below to render for all users */}
          </>
        )}
        {/* Global WATERMARK - visible for all users and included in save/share */}
            <div className="text-center mt-2 mb-6">
              <p className="text-xs text-stone-200/90/40 tracking-widest">
                www.getthereceipts.com
              </p>
            </div>
      </motion.div>

      {/* SEPARATE SAVE/SHARE BOX - Completely outside the immunity card */}
      <div className="w-full max-w-2xl mx-auto mt-12 mb-4">
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center p-6 backdrop-blur rounded-3xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
            border: '2px solid rgba(20, 184, 166, 0.4)',
            boxShadow: '0 8px 32px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.05)'
          }}
        >
          <button 
            onClick={handleSaveBadge}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <LogOut className="h-4 w-4" />
            Save Badge
          </button>
          
          <button 
            onClick={handleSaveImmunity}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              border: '1px solid rgba(20, 184, 166, 0.6)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Download className="h-4 w-4" />
            Save Immunity
          </button>
          
          <motion.button 
            animate={{ 
              scale: [1, 1.02, 1],
              boxShadow: [
                '0 0 20px rgba(212, 175, 55, 0.3)',
                '0 0 30px rgba(212, 175, 55, 0.5)', 
                '0 0 20px rgba(212, 175, 55, 0.3)'
              ]
            }}
            onClick={handleShareTrophy}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex items-center gap-2 text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
              border: '1px solid rgba(212, 175, 55, 0.9)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <Zap className="h-4 w-4" />
            Share Trophy
          </motion.button>
        </div>
        
        {/* Sage's Disclaimer */}
        <div className="mt-4 sm:mt-6 text-center px-4 sm:px-0">
          <p className="text-xs sm:text-sm text-stone-400/70 leading-relaxed max-w-sm sm:max-w-md mx-auto">
            <span className="text-amber-300/80">🔮</span> Look, we're really good at reading the room and serving up insights, but we're not your therapist, not licensed professionals, and for the love of all that's holy, don't take life changing advice from an AI with opinions and sass. For entertainment only. Think of us as your witty friends with someone else's lived experience. This service is intended for users 16+.
          </p>
        </div>
      </div>

    </div>
  );
});

ImmunityTraining.displayName = 'ImmunityTraining';

export default ImmunityTraining;