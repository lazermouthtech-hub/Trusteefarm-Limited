
import React from 'react';
import { LayoutDashboard, ShoppingCart, LogOut, X } from 'lucide-react';
import { Page } from '../../types';
import { classNames } from '../../lib/utils';
import LogoIcon from './LogoIcon';

interface BuyerSidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const BuyerSidebar = ({ currentPage, setCurrentPage, onLogout, isSidebarOpen, setIsSidebarOpen }: BuyerSidebarProps) => {
  const navItems = [
    { id: 'buyer_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
  ] as const;

  const handleLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  }

  const SidebarContent = () => (
      <>
        <div className="flex items-center justify-between h-20 px-4 shadow-md flex-shrink-0 dark:bg-gray-800 dark:border-b dark:border-gray-700 dark:shadow-none">
            <div className="flex items-center">
                <LogoIcon />
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-300 ml-2">Trusteefarm</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                <X className="h-6 w-6" />
            </button>
        </div>
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
            <nav className="flex-1 px-4 py-4">
            {navItems.map((item) => (
                <a
                key={item.id}
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(item.id);
                }}
                className={classNames(
                    'flex items-center px-4 py-3 mt-2 text-gray-600 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                    currentPage === item.id ? 'bg-primary-100 text-primary-700 font-semibold dark:bg-gray-700 dark:text-white' : 'hover:bg-gray-100'
                )}
                >
                <item.icon className="h-5 w-5" />
                <span className="ml-4">{item.label}</span>
                </a>
            ))}
            </nav>
            <div className="px-4 py-4 border-t dark:border-gray-700">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center px-4 py-3 mt-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200 dark:text-gray-300 dark:hover:bg-red-900/50 dark:hover:text-red-300">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-4">Logout</span>
                </a>
            </div>
        </div>
      </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={classNames(
          "fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={classNames(
          "fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 flex flex-col z-50 transform transition-transform md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg dark:shadow-none dark:border-r dark:border-gray-700">
         <SidebarContent />
      </div>
    </>
  );
};

export default BuyerSidebar;
