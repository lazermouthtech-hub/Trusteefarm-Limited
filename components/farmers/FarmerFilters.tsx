
import React from 'react';
import { Search } from 'lucide-react';
import { GradingBadge } from '../../types';

interface FarmerFiltersProps {
    filters: {
        search: string;
        location: string;
        grade: string;
    };
    onFilterChange: (key: 'search' | 'location' | 'grade', value: string) => void;
    onReset: () => void;
    locations: string[];
}

const FarmerFilters = ({ filters, onFilterChange, onReset, locations }: FarmerFiltersProps) => {
    const grades = ['all', ...Object.values(GradingBadge)];
    
    const inputBaseStyle = "w-full text-base bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500";

    return (
        <div className="p-4 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                {/* Search */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Name/Phone</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={filters.search}
                            onChange={(e) => onFilterChange('search', e.target.value)}
                            placeholder="e.g., Kwame Mensah or +233..."
                            className={`${inputBaseStyle} pl-10 pr-4 py-2 placeholder-gray-400 dark:placeholder-gray-400`}
                        />
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <select
                        id="location"
                        name="location"
                        value={filters.location}
                        onChange={(e) => onFilterChange('location', e.target.value)}
                        className={`${inputBaseStyle} py-2 pl-3 pr-10`}
                    >
                        <option value="all">All Locations</option>
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>

                {/* Grade Filter */}
                <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
                    <select
                        id="grade"
                        name="grade"
                        value={filters.grade}
                        onChange={(e) => onFilterChange('grade', e.target.value)}
                        className={`${inputBaseStyle} py-2 pl-3 pr-10`}
                    >
                        {grades.map(grade => <option key={grade} value={grade}>{grade === 'all' ? 'All Grades' : grade}</option>)}
                    </select>
                </div>
                
                {/* Reset Button */}
                <div>
                    <button
                        onClick={onReset}
                        className="w-full bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FarmerFilters;
