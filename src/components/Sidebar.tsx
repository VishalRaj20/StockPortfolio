'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  Briefcase,
  Newspaper,
  TrendingUp,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  activeView: 'dashboard' | 'portfolio' | 'news';
  onViewChange: (view: 'dashboard' | 'portfolio' | 'news') => void;
  portfolioCount: number;
  newsCount: number;
}
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onLogout,
  activeView,
  onViewChange,
  portfolioCount,
  newsCount
}) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: null, description: 'Overview & insights' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, count: portfolioCount, description: 'Manage your stocks' },
    { id: 'news', label: 'Market News', icon: Newspaper, count: newsCount, description: 'Latest market updates' }
  ];

  const secondaryItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <>
      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-sm sm:max-w-md bg-white z-50 shadow-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onViewChange(item.id as any);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">{item.label}</p>
                          <p className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.count !== null && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isActive
                              ? 'bg-white bg-opacity-20 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Market Summary */}
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <h3 className="font-medium text-gray-900">Market Summary</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sensex</span>
                    <span className="text-green-600 font-medium">+1.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nifty 50</span>
                    <span className="text-green-600 font-medium">+0.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Nifty</span>
                    <span className="text-red-600 font-medium">-0.3%</span>
                  </div>
                </div>
              </div>

              {/* Secondary Navigation */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={onClose}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                        onLogout();
                        onClose();
                      }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
