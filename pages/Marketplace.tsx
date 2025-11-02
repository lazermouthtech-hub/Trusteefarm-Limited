import React from 'react';
import { Farmer, FarmerStatus, ProduceCategory, ProduceStatus, Produce } from '../types';
import ProduceCard from '../components/marketplace/ProduceCard';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';

interface MarketplaceProps {
    farmers: Farmer[];
    onViewDetails: (farmerId: string, produceId: string) => void;
}

const Marketplace = ({ farmers, onViewDetails }: MarketplaceProps) => {
    const [filters, setFilters] = React.useState({
        category: 'all',
        status: 'all',
        search: '',
        location: 'all',
        produce: 'all',
    });
    const [sortBy, setSortBy] = React.useState('newest');
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = React.useState(false);

    const allProduces = React.useMemo((): (Produce & { farmerId: string; farmerName: string; farmerLocation: string; })[] => {
        return farmers
            .filter(farmer => farmer.status === FarmerStatus.Active)
            .flatMap(farmer => 
                farmer.produces
                    .filter(p => p.status === ProduceStatus.ReadyForSale || p.status === ProduceStatus.UpcomingHarvest)
                    .map(produce => ({ 
                        ...produce, 
                        farmerId: farmer.id,
                        farmerName: farmer.name, 
                        farmerLocation: farmer.location 
                    }))
            );
    }, [farmers]);
    
    const allProduceNames = React.useMemo(() => {
        const uniqueNames = new Set(allProduces.map(p => p.name));
        return ['all', ...Array.from(uniqueNames).sort()];
    }, [allProduces]);

    const ghanaRegions = [
        'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
        'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
        'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
    ];
    const allLocations = ['all', ...ghanaRegions.sort()];

    const filteredProduces = React.useMemo((): (Produce & { farmerId: string; farmerName: string; farmerLocation: string; })[] => {
        let produces = [...allProduces];

        if (filters.search) {
            produces = produces.filter(p => 
                p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.farmerName.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.category !== 'all') {
            produces = produces.filter(p => p.category === filters.category);
        }

        if (filters.produce !== 'all') {
            produces = produces.filter(p => p.name === filters.produce);
        }
        
        if (filters.status !== 'all') {
             produces = produces.filter(p => {
                if (filters.status === 'ready') return p.status === ProduceStatus.ReadyForSale;
                if (filters.status === 'upcoming') return p.status === ProduceStatus.UpcomingHarvest;
                return true;
            });
        }
        
        if (filters.location !== 'all') {
            produces = produces.filter(p => p.farmerLocation === filters.location);
        }
        
        // Sorting
        produces.sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
                case 'harvest_date':
                    const dateA = a.expectedHarvestDate ? new Date(a.expectedHarvestDate) : new Date(a.availableFrom);
                    const dateB = b.expectedHarvestDate ? new Date(b.expectedHarvestDate) : new Date(b.availableFrom);
                    return dateA.getTime() - dateB.getTime();
                case 'quantity':
                    return b.quantity - a.quantity;
                default:
                    return 0;
            }
        });

        return produces;
    }, [allProduces, filters, sortBy]);

    const activeFilterCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

    return (
        <div>
             <div className="mb-6">
                <div className="lg:hidden">
                    <button 
                        onClick={() => setIsFilterSidebarOpen(true)}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-semibold relative"
                    >
                        <SlidersHorizontal className="h-5 w-5 mr-2"/>
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute top-0 right-0 -mt-2 -mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
                <FilterSidebar 
                    isOpen={isFilterSidebarOpen} 
                    setIsOpen={setIsFilterSidebarOpen}
                    filters={filters} 
                    setFilters={setFilters} 
                    sortBy={sortBy} 
                    setSortBy={setSortBy} 
                    locations={allLocations} 
                    produces={allProduceNames}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProduces.map((item) => {
                    const { farmerId, ...produceForCard } = item;
                    return (
                        // FIX: Moved key to a wrapping div to resolve TypeScript error.
                        <div key={`${farmerId}-${item.id}`}>
                            <ProduceCard
                                produce={produceForCard}
                                onViewDetails={() => onViewDetails(farmerId, item.id)}
                            />
                        </div>
                    );
                })}
            </div>
            {filteredProduces.length === 0 && (
                 <div className="col-span-1 md:col-span-2 xl:grid-cols-3 flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow">
                    <p className="text-xl text-gray-600">No produce found.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;