import React from 'react';
import { LayoutDashboard, Users, ShoppingCart, UploadCloud, FileText, BarChart, Settings, LogOut, LayoutTemplate, X, Contact, ChevronDown, PlugZap } from 'lucide-react';
import { Page } from '../../types';
import { classNames } from '../../lib/utils';
import LogoIcon from './LogoIcon';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ currentPage, setCurrentPage, onLogout, isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (currentPage === 'bulk_upload' || currentPage === 'admin_ocr') {
      setIsBulkUploadOpen(true);
    }
  }, [currentPage]);
  
  const adminToolsNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farmers', label: 'Farmers', icon: Users },
    { id: 'admin_marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'admin_contacts', label: 'Contacts', icon: Contact },
    // bulk_upload is handled separately as a dropdown triggered by 'admin_contacts'
    { id: 'admin_blog', label: 'Blog Posts', icon: FileText },
    { id: 'admin_cms', label: 'CMS', icon: LayoutTemplate },
    { id: 'admin_analytics', label: 'Analytics', icon: BarChart },
  ] as const;

  const backendNav = [
    { id: 'apis', label: 'APIs', icon: PlugZap },
    { id: 'admin_settings', label: 'Settings', icon: Settings },
  ] as const;

  const handleLinkClick = (page: Page) => {
    setCurrentPage(page);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  }

  const SidebarContent = () => (
    <>
       <div className="flex items-center justify-between h-20 px-4 shadow-md bg-gray-900 flex-shrink-0">
        <div className="flex items-center">
          <LogoIcon />
          <h1 className="text-2xl font-bold ml-2 text-white">Trusteefarm</h1>
        </div>
         <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <nav className="flex-1 px-4 py-4">
          <p className="px-4 text-xs text-gray-400 uppercase tracking-wider">Admin Tools</p>
          {adminToolsNav.map((item) => {
            if (item.id === 'admin_contacts') { // Insert dropdown before this item
               const isBulkUploadActive = currentPage === 'bulk_upload' || currentPage === 'admin_ocr';
               return (
                <React.Fragment key="bulk-upload-fragment">
                   <a
                    key='admin_contacts'
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleLinkClick('admin_contacts'); }}
                    className={classNames('flex items-center px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200', currentPage === 'admin_contacts' ? 'bg-gray-700 text-white' : '')}
                  >
                    <Contact className="h-5 w-5" />
                    <span className="ml-4">Contacts</span>
                  </a>
                  <div key="bulk-upload-menu">
                    <button
                      onClick={() => setIsBulkUploadOpen(!isBulkUploadOpen)}
                      className={classNames(
                        'flex items-center justify-between w-full px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200',
                        isBulkUploadActive ? 'bg-gray-700 text-white' : ''
                      )}
                    >
                      <div className="flex items-center">
                        <UploadCloud className="h-5 w-5" />
                        <span className="ml-4">Bulk Upload</span>
                      </div>
                      <ChevronDown className={classNames("w-5 h-5 transform transition-transform", isBulkUploadOpen ? "rotate-180" : "")} />
                    </button>
                    {isBulkUploadOpen && (
                      <div className="pl-8 py-2 space-y-1">
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handleLinkClick('bulk_upload'); }}
                          className={classNames(
                            'flex items-center px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-600 hover:text-white',
                            currentPage === 'bulk_upload' ? 'bg-gray-600 text-white' : ''
                          )}
                        >
                          CSV Upload
                        </a>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); handleLinkClick('admin_ocr'); }}
                          className={classNames(
                            'flex items-center px-4 py-2 text-sm text-gray-400 rounded-lg hover:bg-gray-600 hover:text-white',
                            currentPage === 'admin_ocr' ? 'bg-gray-600 text-white' : ''
                          )}
                        >
                          OCR
                        </a>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              )
            }
            return (
              <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className={classNames(
                'flex items-center px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200',
                currentPage === item.id ? 'bg-gray-700 text-white' : ''
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-4">{item.label}</span>
            </a>
          )})}

          <p className="px-4 mt-6 pt-4 border-t border-gray-700 text-xs text-gray-400 uppercase tracking-wider">Backend</p>
           {backendNav.map((item) => (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className={classNames(
                'flex items-center px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200',
                currentPage === item.id ? 'bg-gray-700 text-white' : ''
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="ml-4">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
             <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="flex items-center px-4 py-3 mt-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">
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
          "fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col z-50 transform transition-transform md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 bg-gray-900 text-white">
         <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;