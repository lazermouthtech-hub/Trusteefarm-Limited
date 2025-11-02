import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProduceCategory } from '../../types';
import { classNames } from '../../lib/utils';


interface FilterSidebarProps {
    filters: { category: string; status: string; search: string; location: string; produce: string; };
    setFilters: React.Dispatch<React.SetStateAction<{ category: string; status: string; search: string; location: string; produce: string; }>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    locations: string[];
    produces: string[];
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSidebar = ({ filters, setFilters, sortBy, setSortBy, locations, produces, isOpen, setIsOpen }: FilterSidebarProps) => {
    
    const handleFilterChange = (key: 'category' | 'status' | 'search' | 'location' | 'produce', value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClear = () => {
        setFilters({ category: 'all', status: 'all', search: '', location: 'all', produce: 'all' });
        setSortBy('newest');
    };

    const categories = ['all', ...Object.values(ProduceCategory)];
    const availability = [
        { id: 'all', label: 'All' },
        { id: 'ready', label: 'Ready Now' },
        { id: 'upcoming', label: 'Upcoming Harvest' },
    ];
    const sortOptions = [
        { id: 'newest', label: 'Newest Listings' },
        { id: 'harvest_date', label: 'Harvest Date (Soonest)' },
        { id: 'quantity', label: 'Quantity (Highest)' },
    ];

    const darkInputBaseStyle = "w-full bg-[#2D3748] border-transparent text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-primary-500 appearance-none";
    
    const HorizontalFilterBar = () => (
      <div className="hidden lg:block bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-6">
              <div className="flex items-center text-lg font-bold text-gray-800 flex-shrink-0">
                  <SlidersHorizontal className="h-5 w-5 mr-3 text-primary-600"/>
                  Filters
              </div>
              <div className="relative flex-grow">
                  <input
                      type="text"
                      placeholder="Search produce or farmer..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className={`${darkInputBaseStyle} pl-10 pr-4 py-2.5 placeholder-gray-400`}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
              <div className="flex items-end gap-4">
                  <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
                      <select 
                          value={filters.category} 
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                      >
                      {categories.map((cat: string) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Produces</label>
                      <select 
                          value={filters.produce} 
                          onChange={(e) => handleFilterChange('produce', e.target.value)}
                          className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                      >
                      {produces.map((prod: string) => <option key={prod} value={prod}>{prod === 'all' ? 'All Produces' : prod}</option>)}
                      </select>
                  </div>
                   <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Location</label>
                      <select 
                          value={filters.location} 
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                      >
                      {locations.map((loc: string) => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Availability</label>
                       <div className="flex rounded-lg overflow-hidden bg-gray-100 p-1">
                          {availability.slice(1).map(item => ( // Exclude 'All'
                              <button 
                                  key={item.id}
                                  onClick={() => handleFilterChange('status', item.id === filters.status ? 'all' : item.id)}
                                  className={classNames(
                                      'px-4 py-1.5 rounded-md text-sm transition-colors font-medium whitespace-nowrap',
                                      filters.status === item.id ? 'bg-primary-600 text-white shadow' : 'bg-transparent text-gray-800 hover:bg-gray-200'
                                  )}
                              >{item.label}</button>
                          ))}
                      </div>
                  </div>
                   <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</label>
                      <select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                      >
                      {sortOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                      </select>
                  </div>
              </div>
              <button 
                  onClick={handleClear}
                  className="text-center text-primary-600 font-semibold hover:text-primary-800 transition-colors"
              >
                  Clear All Filters
              </button>
          </div>
      </div>
    );
    
    return (
        <>
            {/* Desktop Horizontal Filters */}
            <HorizontalFilterBar />

            {/* Mobile Sidebar (Off-canvas) */}
            <div
                className={classNames("fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />
            <div
                className={classNames("fixed inset-y-0 left-0 w-72 bg-gray-800 text-white flex flex-col z-50 transform transition-transform lg:hidden", isOpen ? "translate-x-0" : "-translate-x-full")}
            >
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-lg font-bold">Filter Marketplace</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-6 p-4">
                     <div className="relative">
                        <input
                            type="text"
                            placeholder="Search produce or farmer..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className={`${darkInputBaseStyle} pl-10 pr-4 py-2.5 placeholder-gray-400`}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Category</h4>
                        <select 
                            value={filters.category} 
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                        >
                        {categories.map((cat: string) => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Produces</h4>
                        <select 
                            value={filters.produce} 
                            onChange={(e) => handleFilterChange('produce', e.target.value)}
                            className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                        >
                        {produces.map((prod: string) => <option key={prod} value={prod}>{prod === 'all' ? 'All Produces' : prod}</option>)}
                        </select>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Location</h4>
                        <select 
                            value={filters.location} 
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                        >
                        {locations.map((loc: string) => <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>)}
                        </select>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-3">Availability</h4>
                        <div className="space-y-2">
                            {availability.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => handleFilterChange('status', item.id)}
                                    className={classNames(
                                        'w-full text-left px-4 py-2 rounded-lg text-sm transition-colors font-medium',
                                        filters.status === item.id ? 'bg-primary-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                                    )}
                                >{item.label}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-200 mb-2">Sort By</h4>
                         <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className={`${darkInputBaseStyle} py-2.5 pl-3 pr-10`}
                        >
                        {sortOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-shrink-0 p-4 border-t border-gray-700 flex items-center gap-4">
                    <button onClick={() => { handleClear(); setIsOpen(false); }} className="w-1/2 text-center text-gray-200 font-semibold bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg transition-colors">
                        Clear
                    </button>
                    <button onClick={() => setIsOpen(false)} className="w-1/2 bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 font-semibold transition-colors">
                        Show Results
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterSidebar;