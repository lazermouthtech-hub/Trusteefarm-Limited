
import React from 'react';
import { Farmer, FarmerStatus } from '../types';
import { calculateFarmerGrade, classNames } from '../lib/utils';
import FarmerFilters from '../components/farmers/FarmerFilters';
import FarmerList from '../components/farmers/FarmerList';
import EditFarmerModal from '../components/farmers/EditFarmerModal';
import Pagination from '../components/farmers/Pagination';

interface FarmersProps {
  farmers: Farmer[];
  onUpdateFarmer: (farmer: Farmer) => void;
}

const ITEMS_PER_PAGE = 10;

const Farmers = ({ farmers, onUpdateFarmer }: FarmersProps) => {
  const [filters, setFilters] = React.useState({
    search: '',
    location: 'all',
    grade: 'all',
  });
  const [activeStatus, setActiveStatus] = React.useState<FarmerStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [editingFarmer, setEditingFarmer] = React.useState<Farmer | null>(null);

  const locations = React.useMemo(() => {
    const allLocations = farmers.map(f => f.location);
    return [...new Set(allLocations)].sort();
  }, [farmers]);

  const handleFilterChange = (key: 'search' | 'location' | 'grade', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleStatusChange = (status: FarmerStatus | 'all') => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ search: '', location: 'all', grade: 'all' });
    setActiveStatus('all');
    setCurrentPage(1);
  };
  
  const statusCounts = React.useMemo(() => {
    return {
      all: farmers.length,
      [FarmerStatus.Active]: farmers.filter(f => f.status === FarmerStatus.Active).length,
      [FarmerStatus.PendingReview]: farmers.filter(f => f.status === FarmerStatus.PendingReview).length,
      [FarmerStatus.Rejected]: farmers.filter(f => f.status === FarmerStatus.Rejected).length,
    };
  }, [farmers]);

  const filteredFarmers = React.useMemo(() => {
    return farmers.filter(farmer => {
      const searchLower = filters.search.toLowerCase();
      const grade = calculateFarmerGrade(farmer).badge;

      const matchesSearch =
        !filters.search ||
        farmer.name.toLowerCase().includes(searchLower) ||
        farmer.phone.includes(searchLower);
      
      const matchesLocation =
        filters.location === 'all' || farmer.location === filters.location;
      
      const matchesGrade =
        filters.grade === 'all' || grade === filters.grade;

      const matchesStatus = activeStatus === 'all' || farmer.status === activeStatus;

      return matchesSearch && matchesLocation && matchesGrade && matchesStatus;
    });
  }, [farmers, filters, activeStatus]);
  
  // Effect to prevent blank screen on page overflow after filtering/updates
  React.useEffect(() => {
    const newTotalPages = Math.ceil(filteredFarmers.length / ITEMS_PER_PAGE);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredFarmers.length, currentPage]);

  const paginatedFarmers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFarmers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFarmers, currentPage]);

  const handleEditFarmer = (farmer: Farmer) => {
    setEditingFarmer(farmer);
  };

  const handleCloseModal = () => {
    setEditingFarmer(null);
  };

  const handleSaveChanges = (updatedFarmer: Farmer) => {
    onUpdateFarmer(updatedFarmer);
    setEditingFarmer(null);
  };

  const tabs = [
    { name: 'All Farmers', status: 'all' as const, count: statusCounts.all },
    { name: 'Pending Approval', status: FarmerStatus.PendingReview, count: statusCounts[FarmerStatus.PendingReview] },
    { name: 'Active', status: FarmerStatus.Active, count: statusCounts[FarmerStatus.Active] },
    { name: 'Rejected', status: FarmerStatus.Rejected, count: statusCounts[FarmerStatus.Rejected] },
  ];

  return (
    <div className="space-y-6">
      <FarmerFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        locations={locations}
      />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => handleStatusChange(tab.status)}
                        className={classNames(
                            'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center whitespace-nowrap',
                            activeStatus === tab.status
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                        )}
                    >
                        {tab.name}
                        <span className={classNames(
                            'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                            activeStatus === tab.status
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200'
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
        <FarmerList farmers={paginatedFarmers} onEdit={handleEditFarmer} />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredFarmers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
      <EditFarmerModal
        isOpen={!!editingFarmer}
        farmer={editingFarmer}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default Farmers;
