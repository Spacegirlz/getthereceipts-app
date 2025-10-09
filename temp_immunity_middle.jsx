  const handleShareTrophy = () => {
    // Use the new social export system for Immunity Training sharing - with share menu
    captureById('social-immunity-card', 'Sage-Immunity', true);
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
  const handleSaveImmunity = () => {
    // Use the new social export system for Immunity Training - direct download only
    captureById('social-immunity-card', 'Sage-Immunity', false);
  };
