import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, LogIn, Menu, X, Info, Gift, Settings, FileText, Shield, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MainHeader = () => {
  const { user, signOut, loading } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Always render a consistent header on all routes

  return (
    <motion.header 
      className="py-4 px-4 md:px-8 sticky top-0 z-50 transition-all duration-300"
      animate={{ 
        backgroundColor: scrolled ? 'rgba(15, 15, 15, 0.8)' : 'rgba(15, 15, 15, 0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
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
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-black">
            Get The Receipts
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/new-receipt" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">New Receipt</Link>
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex">
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

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => {
              console.log('Menu button clicked, current state:', mobileMenuOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden text-white hover:text-cyan-400 transition-colors p-2 relative z-[80]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Menu - Outside header container */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />

            {/* Slide-Out Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-white/10 shadow-2xl z-[70] md:hidden overflow-y-auto"
            >
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-black text-xl">
                      Get The Receipts
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors p-2"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Menu Items */}
                  <nav className="flex-1 p-4 space-y-2">
                    {/* Primary Links */}
                    <Link
                      to="/new-receipt"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="font-medium">New Receipt</span>
                    </Link>

                    <Link
                      to="/pricing"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Gift className="h-5 w-5" />
                      <span className="font-medium">Pricing</span>
                    </Link>

                    {user && (
                      <Link
                        to="/dashboard"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-white/10 my-4"></div>

                    {/* Secondary Links */}
                    {!user && (
                      <Link
                        to="/about"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Info className="h-5 w-5" />
                        <span className="font-medium">About</span>
                      </Link>
                    )}

                    <Link
                      to="/refer"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Gift className="h-5 w-5" />
                      <span className="font-medium">Refer and Earn</span>
                    </Link>

                    {user && (
                      <Link
                        to="/settings"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                      </Link>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-white/10 my-4"></div>

                    {/* Legal Links */}
                    <Link
                      to="/privacy-policy"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Privacy Policy</span>
                    </Link>

                    <Link
                      to="/terms-of-service"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Terms of Service</span>
                    </Link>
                  </nav>

                  {/* Menu Footer */}
                  <div className="p-4 border-t border-white/10">
                    {!loading && user ? (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    ) : !loading ? (
                      <Button
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
                        onClick={() => {
                          openModal('sign_in');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </motion.header>
  );
};

export default MainHeader;