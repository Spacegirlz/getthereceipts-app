import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const MainHeader = () => {
  const { user, signOut } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Hide header on landing page since it has its own navigation
  if (location.pathname === '/') {
    return null;
  }

  return (
    <motion.header 
      className="py-4 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300"
      animate={{ 
        backgroundColor: scrolled ? 'rgba(16, 24, 36, 0.8)' : 'rgba(16, 24, 36, 0)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black gradient-text">
          GetTheReceipts
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link to="/refer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Earn Rewards</Link>
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</Link>
          </nav>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <LayoutDashboard className="mr-2 h-4 w-4"/> Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleSignOut}>
                <LogOut className="h-4 w-4"/>
              </Button>
            </>
          ) : (
            <Button className="viral-button-popular" onClick={() => openModal('sign_in')}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default MainHeader;