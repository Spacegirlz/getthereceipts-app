import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const MainHeader = () => {
  const { user, signOut, loading } = useAuth();
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

  // Always render a consistent header on all routes

  return (
    <motion.header 
      className="py-4 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300"
      animate={{ 
        backgroundColor: scrolled ? 'rgba(16, 24, 36, 0.8)' : 'rgba(16, 24, 36, 0)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-black"
          onClick={() => {
            // Set flag to indicate user clicked logo intentionally
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('navigatedFromLogo', 'true');
            }
          }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)', // purple → blue
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}
          >
            GetTheReceipts
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/chat-input" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">New Receipt</Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</Link>
            {user ? (
              <>
                <Link to="/refer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Refer and Earn</Link>
                <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</Link>
                <Link to="/refer" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Refer and Earn</Link>
              </>
            )}
          </nav>
          {!loading && user ? (
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={handleSignOut}>
              <LogOut className="h-4 w-4"/>
            </Button>
          ) : !loading ? (
            <Button className="viral-button-popular" onClick={() => openModal('sign_in')}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
          ) : (
            <div style={{ width: 88, height: 36 }} />
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default MainHeader;