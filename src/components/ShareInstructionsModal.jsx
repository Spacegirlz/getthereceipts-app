import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function ShareInstructionsModal({ isOpen, onClose, platform = 'general' }) {
  const instructions = {
    general: {
      title: "✅ Receipt Saved!",
      subtitle: "Now share it with the world",
      steps: [
        { icon: "📱", text: "Open Instagram, TikTok, or your favorite app" },
        { icon: "➕", text: "Create a new post or Story" },
        { icon: "🖼️", text: "Select the receipt from your camera roll" },
        { icon: "✨", text: "Add your reaction and post!" }
      ],
      cta: "Got it!"
    },
    instagram: {
      title: "📸 Share to Instagram Stories",
      subtitle: "Your receipt is ready",
      steps: [
        { icon: "1️⃣", text: "Open Instagram app" },
        { icon: "2️⃣", text: "Tap your profile picture (+ button) to add Story" },
        { icon: "3️⃣", text: "Select the receipt from your camera roll" },
        { icon: "4️⃣", text: "Add text, stickers, or your hot take" },
        { icon: "5️⃣", text: "Share to your Story!" }
      ],
      cta: "Open Instagram",
      ctaLink: "instagram://story-camera"
    },
    tiktok: {
      title: "🎵 Share to TikTok",
      subtitle: "Time to go viral",
      steps: [
        { icon: "1️⃣", text: "Open TikTok app" },
        { icon: "2️⃣", text: "Tap + to create" },
        { icon: "3️⃣", text: "Select 'Photo' mode" },
        { icon: "4️⃣", text: "Choose the receipt from camera roll" },
        { icon: "5️⃣", text: "Add your voiceover/reaction" },
        { icon: "6️⃣", text: "Use #GetTheReceipts and post!" }
      ],
      cta: "Open TikTok",
      ctaLink: "tiktok://"
    }
  };

  const config = instructions[platform] || instructions.general;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{config.title}</DialogTitle>
          {config.subtitle && (
            <p className="text-center text-muted-foreground">{config.subtitle}</p>
          )}
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {config.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{step.icon}</span>
              <p className="text-sm pt-1">{step.text}</p>
            </div>
          ))}
        </div>

        {config.ctaLink ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={() => {
                window.location.href = config.ctaLink;
                setTimeout(() => onClose(), 500);
              }}
              className="flex-1"
            >
              {config.cta}
            </Button>
          </div>
        ) : (
          <Button onClick={onClose} className="w-full">
            {config.cta}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
