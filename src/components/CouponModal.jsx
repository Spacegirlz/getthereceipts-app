import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { redeemCoupon } from '@/lib/services/couponService';
import { useToast } from '@/components/ui/use-toast';
import { Gift, Sparkles, X } from 'lucide-react';

const CouponModal = ({ isOpen, onClose }) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRedeem = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!couponCode.trim()) {
      setErrorMessage("Please enter a valid coupon code.");
      return;
    }

    if (!user) {
      setErrorMessage("You need to be signed in to redeem coupons.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await redeemCoupon(couponCode.trim(), user.id);
      
      if (result.success) {
        setSuccessMessage(`🎉 Success! You got ${result.receiptsCount} ${result.isPremium ? 'premium' : 'basic'} receipts from ${result.couponName}!`);
        
        // Also show toast for success
        toast({
          title: "🎉 Coupon Redeemed!",
          description: `You got ${result.receiptsCount} ${result.isPremium ? 'premium' : 'basic'} receipts from ${result.couponName}!`,
        });
        
        // Close modal and reset form after a delay
        setTimeout(() => {
          setCouponCode('');
          setSuccessMessage('');
          onClose();
          // Refresh the page to update credits display
          window.location.reload();
        }, 2000);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Coupon redemption error:', error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setCouponCode('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md relative z-[100]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Gift className="h-6 w-6 text-purple-500" />
            Redeem Coupon Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter your coupon code to get free receipts!
            </p>
          </div>
          
          {/* Error Message - Above form */}
          {errorMessage && (
            <div className="bg-red-500/20 border-2 border-red-500/40 rounded-lg p-4 text-red-300 text-center font-medium mb-4">
              {errorMessage}
            </div>
          )}
          
          {/* Success Message - Above form */}
          {successMessage && (
            <div className="bg-green-500/20 border-2 border-green-500/40 rounded-lg p-4 text-green-300 text-center font-medium mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleRedeem} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter coupon code (e.g., VIPVILLA5)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Redeeming...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Redeem Coupon
                </div>
              )}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>💡 Follow us on social media for exclusive coupon drops!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponModal;
