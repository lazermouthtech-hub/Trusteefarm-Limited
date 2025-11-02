
import React from 'react';
import { Page } from '../../types';
import { classNames } from '../../lib/utils';
import LogoIcon from './LogoIcon';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface PublicHeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onBuyerAuthClick: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const PublicHeader = ({ currentPage, setCurrentPage, onBuyerAuthClick, theme, setTheme }: PublicHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'blog', label: 'Blog' },
  ] as const;

  const handleMobileLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };
  
  const handleMobileAuthClick = () => {
    onBuyerAuthClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm w-full z-10 sticky top-0">
      <div className="container mx-auto px-6">
        <div className="h-20 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="flex items-center space-x-2">
            <LogoIcon />
            <span className="text-2xl font-bold text-green-800 dark:text-green-300">Trusteefarm</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                className={classNames(
                  'font-medium transition-colors text-lg',
                  currentPage === item.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <button 
              onClick={onBuyerAuthClick}
              className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-4 py-2"
            >
              Buyer Login / Sign Up
            </button>
            <button 
              onClick={() => setCurrentPage('farmer_register')}
              className="font-medium text-white bg-green-600 hover:bg-green-700 transition-colors px-5 py-2 rounded-md"
            >
              For Farmers
            </button>
             <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <button 
              onClick={() => setCurrentPage('admin_login')}
              className="font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-4 py-2 rounded-md"
            >
              Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <ThemeToggle theme={theme} setTheme={setTheme} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => { e.preventDefault(); handleMobileLinkClick(item.id); }}
                className={classNames(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  currentPage === item.id ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 space-y-1">
              <button onClick={handleMobileAuthClick} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Buyer Login / Sign Up</button>
              <button onClick={() => handleMobileLinkClick('farmer_register')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">For Farmers</button>
              <button onClick={() => handleMobileLinkClick('admin_login')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Admin</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
