import { useCallback, useState } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useToast } from '@/components/ui/use-toast';

// Captures a fixed-size element (1080x1920) by id at scale=1.0
// Shows success/error toasts and downloads via file-saver
export function useSocialExport() {
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsPlatform, setInstructionsPlatform] = useState('general');

  const captureById = useCallback(async (elementId, filenamePrefix = 'Sage', useShareAPI = true) => {
    try {
      const el = document.getElementById(elementId);
      console.log(`🔍 Looking for element: #${elementId}`, el);
      
      if (!el) {
        console.error(`❌ Element #${elementId} not found in DOM`);
        toast({ title: 'Error', description: `Element #${elementId} not found`, variant: 'destructive' });
        return;
      }

      console.log(`✅ Found element:`, {
        id: el.id,
        position: el.style.position,
        top: el.style.top,
        left: el.style.left,
        width: el.offsetWidth,
        height: el.offsetHeight
      });

      // Ensure expected size (Instagram Stories format)
      const expectedWidth = 1080;
      const expectedHeight = 1920;
      const width = el.offsetWidth || expectedWidth;
      const height = el.offsetHeight || expectedHeight;

      // Warn if element size is off; still proceed
      if (width !== expectedWidth || height !== expectedHeight) {
        console.warn(`⚠️ Social export element size ${width}x${height} differs from expected 1080x1920`);
      }

      // Temporarily move element to viewport for capture (html2canvas has issues with off-screen elements)
      const originalPosition = el.style.position;
      const originalTop = el.style.top;
      const originalLeft = el.style.left;
      const originalZIndex = el.style.zIndex;

      console.log(`📸 Moving element to viewport for capture...`);
      el.style.position = 'fixed';
      el.style.top = '0px';
      el.style.left = '0px';
      el.style.zIndex = '9999';

      // Small delay to ensure DOM update
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 1.0,
        width: expectedWidth,
        height: expectedHeight,
        removeContainer: true,
        logging: false,
        foreignObjectRendering: false
      });

      console.log(`📸 Captured canvas: ${canvas.width}x${canvas.height}`);

      // Restore original position
      el.style.position = originalPosition;
      el.style.top = originalTop;
      el.style.left = originalLeft;
      el.style.zIndex = originalZIndex;

      let outCanvas = canvas;
      if (canvas.width !== expectedWidth || canvas.height !== expectedHeight) {
        // Resize to exact 1080x1920 as a safe fallback while keeping scale=1.0 capture
        const resized = document.createElement('canvas');
        resized.width = expectedWidth;
        resized.height = expectedHeight;
        const ctx = resized.getContext('2d');
        ctx.fillStyle = '#14142e';
        ctx.fillRect(0, 0, expectedWidth, expectedHeight);
        ctx.drawImage(canvas, 0, 0, expectedWidth, expectedHeight);
        outCanvas = resized;
      }

      outCanvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('❌ Failed to create image blob');
          toast({ 
            title: '😵 Oops!', 
            description: 'Couldn\'t create the image. Try again?', 
            variant: 'destructive' 
          });
          return;
        }
        
        const timestamp = Date.now();
        const safePrefix = filenamePrefix || 'Sage';
        const filename = `${safePrefix}-${timestamp}.png`;
        const file = new File([blob], filename, { type: 'image/png' });
        
        console.log(`💾 Generated file: ${filename} (${blob.size} bytes)`);
        
        // Try Web Share API first (mobile devices) - only if useShareAPI is true
        if (useShareAPI && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            console.log('📱 Using Web Share API');
            // Get share texts based on content type
            const getShareTexts = (prefix) => {
              if (prefix === 'Sage-Receipt') {
                return [
                  'Sage AI just read my texts and I\'m not okay 💀\n#getthereceipts #sageknows',
                  'This AI called me out on my own messages and I\'m deceased ☠️\n#getthereceipts #sageknows',
                  'Sage just analyzed my texts and I need therapy now 🫠\n#getthereceipts #sageknows',
                  'This AI read my messages and absolutely destroyed me 💀\n#getthereceipts #sageknows',
                  'Sage just exposed my text game and I\'m crying 😭\n#getthereceipts #sageknows',
                  'Sage AI decoded my entire life in 30 seconds 💀\n#getthereceipts #sageknows',
                  'Sage gets it 🔥\n#getthereceipts #sageknows',
                  'I wasn\'t ready for this 💀\n#getthereceipts #sageknows',
                  'Well damn 😭\n#getthereceipts #sageknows',
                  'the way this app just EXPOSED me 💀\n#getthereceipts #sageknows',
                  'not sage calling out my entire texting strategy ☠️\n#getthereceipts #sageknows',
                  'this app is too accurate and I\'m uncomfy 😭\n#getthereceipts #sageknows'
                ];
              } else if (prefix === 'Sage-Playbook') {
                return [
                  'This AI just read my entire situation and I\'m not okay 💀\n#getthereceipts #sageknows',
                  'Sage just exposed my whole game and I\'m deceased ☠️\n#getthereceipts #sageknows',
                  'This playbook called me out and I\'m actually crying 😭\n#getthereceipts #sageknows',
                  'Sage just decoded my entire strategy in 30 seconds 🔥\n#getthereceipts #sageknows',
                  'This AI read my patterns and served the tea 🫖\n#getthereceipts #sageknows',
                  'Sage just gave me the blueprint and I\'m not mad 💀\n#getthereceipts #sageknows',
                  'This playbook gets it 🔥\n#getthereceipts #sageknows',
                  'I wasn\'t ready for this level of accuracy 💀\n#getthereceipts #sageknows',
                  'Well damn, this hits different 😭\n#getthereceipts #sageknows',
                  'sage really said "let me read you for filth" 💀\n#getthereceipts #sageknows',
                  'not the AI giving me a whole strategy guide ☠️\n#getthereceipts #sageknows'
                ];
              } else if (prefix === 'Sage-Immunity') {
                return [
                  'This AI just read my entire situation and I\'m not okay 💀\n#getthereceipts #sageknows',
                  'Sage just exposed my whole game and I\'m deceased ☠️\n#getthereceipts #sageknows',
                  'This immunity training called me out and I\'m actually crying 😭\n#getthereceipts #sageknows',
                  'Sage just decoded my entire defense strategy in 30 seconds 🔥\n#getthereceipts #sageknows',
                  'This AI read my patterns and served the protection tea 🫖\n#getthereceipts #sageknows',
                  'Sage just gave me the blueprint and I\'m not mad 💀\n#getthereceipts #sageknows',
                  'This immunity training gets it 🔥\n#getthereceipts #sageknows',
                  'I wasn\'t ready for this level of accuracy 💀\n#getthereceipts #sageknows',
                  'Well damn, this hits different 😭\n#getthereceipts #sageknows',
                  'sage really said "bestie, you need this" 💀\n#getthereceipts #sageknows',
                  'immunity training but make it personal 😭\n#getthereceipts #sageknows'
                ];
              } else {
                // Default fallback
                return [
                  'Sage AI just read my texts and I\'m not okay 💀\n#getthereceipts #sageknows',
                  'This AI called me out on my own messages and I\'m deceased ☠️\n#getthereceipts #sageknows',
                  'Sage just analyzed my texts and I need therapy now 🫠\n#getthereceipts #sageknows'
                ];
              }
            };
            
            const shareTexts = getShareTexts(safePrefix);
            
            const randomText = shareTexts[Math.floor(Math.random() * shareTexts.length)];
            
            // Get appropriate title based on content type
            const getShareTitle = (prefix) => {
              if (prefix === 'Sage-Receipt') return 'My Sage Receipt';
              if (prefix === 'Sage-Playbook') return 'My Sage Playbook';
              if (prefix === 'Sage-Immunity') return 'My Sage Immunity Training';
              return 'My Sage Analysis';
            };
            
            await navigator.share({
              files: [file],
              title: getShareTitle(safePrefix),
              text: randomText
            });
            
            // Show helpful guidance after share menu opens
            toast({ 
              title: '✨ Pro tip', 
              description: 'Choose "Save to Photos" to keep your receipt, or share directly to Stories!',
              duration: 4000 // Show for 4 seconds
            });
            return;
          } catch (shareError) {
            if (shareError.name === 'AbortError') {
              console.log('📱 Share cancelled by user');
              toast({ title: 'Share cancelled', description: 'No worries, try again when ready!' });
              return;
            }
            console.warn('📱 Web Share API failed, falling back to download:', shareError);
          }
        }
        
        // Fallback: Download + Show Instructions
        console.log('💾 Using traditional download');
        saveAs(blob, filename);
        
        // Show instructions modal for desktop users (only once)
        const hasSeenInstructions = localStorage.getItem('gtr_share_instructions_seen');
        if (!hasSeenInstructions) {
          setInstructionsPlatform('general');
          setShowInstructions(true);
          localStorage.setItem('gtr_share_instructions_seen', 'true');
        }
        
        toast({ 
          title: '💾 Receipt Saved!', 
          description: 'Now: Open Instagram/TikTok on your phone → Upload from Photos → Share!',
          duration: 6000
        });
      }, 'image/png');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Social export error:', err);
      toast({ 
        title: '😵 Oops!', 
        description: 'Something went wrong. Try again?', 
        variant: 'destructive' 
      });
    }
  }, [toast]);

  const resetInstructions = () => {
    localStorage.removeItem('gtr_share_instructions_seen');
    setShowInstructions(true);
  };

  return { 
    captureById,
    showInstructions,
    setShowInstructions,
    instructionsPlatform,
    resetInstructions
  };
}

export default useSocialExport;


