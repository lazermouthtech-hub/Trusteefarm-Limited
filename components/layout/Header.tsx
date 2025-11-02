

import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { Page } from '../../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  adminName: string;
  currentPage: Page;
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Header = ({ adminName, currentPage, onMenuClick, theme, setTheme }: HeaderProps) => {
  const pageTitles: Partial<Record<Page, string>> = {
    dashboard: 'Dashboard Overview',
    farmers: 'Farmer Management',
    admin_marketplace: 'Marketplace Moderation',
    admin_contacts: 'Contact Management',
    bulk_upload: 'CSV Bulk Upload',
    admin_ocr: 'OCR Bulk Upload',
    admin_blog: 'Blog Management',
    admin_cms: 'Content Management System',
    admin_analytics: 'Platform Analytics',
    apis: 'API Management',
    admin_settings: 'System Settings',
  };

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-20 px-4 md:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden mr-4 p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 truncate">{pageTitles[currentPage] || 'Admin Portal'}</h1>
      </div>
      <div className="flex items-center">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <button className="ml-2 p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700">
          <Bell className="h-6 w-6" />
        </button>
        <div className="ml-2 md:ml-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-gray-700 dark:text-gray-300"/>
            </div>
          <div className="ml-2 hidden md:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{adminName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;