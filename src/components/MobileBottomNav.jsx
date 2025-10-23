import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Gift, BarChart3 } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/receipts',
      icon: Home,
      label: 'Home',
      isActive: location.pathname === '/receipts' || location.pathname.startsWith('/receipts/')
    },
    {
      path: '/new-receipt',
      icon: MessageSquare,
      label: 'New Receipt',
      isActive: location.pathname === '/new-receipt' || location.pathname === '/luxe-chat-input' || location.pathname === '/chat-input'
    },
    {
      path: '/pricing',
      icon: Gift,
      label: 'Pricing',
      isActive: location.pathname === '/pricing'
    },
    {
      path: '/dashboard',
      icon: BarChart3,
      label: 'Dashboard',
      isActive: location.pathname === '/dashboard'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl shadow-black/10">
        <div className="flex items-center justify-around px-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-all duration-200 ${
                  item.isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                {typeof Icon === 'string' ? (
                  <span className="text-lg mb-0.5">{Icon}</span>
                ) : (
                  <Icon className={`h-4 w-4 mb-0.5 ${item.isActive ? 'text-white' : ''}`} />
                )}
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNav;
