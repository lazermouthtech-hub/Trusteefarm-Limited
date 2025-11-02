import React from 'react';
import { Farmer, Produce, ProduceStatus } from '../types';
import ProduceEditModal from '../components/farmers/ProduceEditModal';
import { Plus, Edit, Trash2, Calendar, Clock, Package } from 'lucide-react';
import { classNames } from '../lib/utils';

interface FarmerListingsProps {
    farmer: Farmer;
    onUpdateFarmer: (updatedFarmer: Farmer) => void;
}

const FarmerListings = ({ farmer, onUpdateFarmer }: FarmerListingsProps) => {
    const [isProduceModalOpen, setIsProduceModalOpen] = React.useState(false);
    const [selectedProduce, setSelectedProduce] = React.useState<Produce | null>(null);
    const [statusFilter, setStatusFilter] = React.useState<ProduceStatus | 'all'>('all');

    const handleAddNewProduce = () => {
        setSelectedProduce(null);
        setIsProduceModalOpen(true);
    };

    const handleEditProduce = (produce: Produce) => {
        setSelectedProduce(produce);
        setIsProduceModalOpen(true);
    };

    const handleDeleteProduce = (produceId: string) => {
        if (window.confirm('Are you sure you want to delete this produce?')) {
            const updatedProduces = farmer.produces.filter(p => p.id !== produceId);
            onUpdateFarmer({ ...farmer, produces: updatedProduces });
        }
    };

    const handleSaveProduce = (produceToSave: Produce) => {
        const existingProduceIndex = farmer.produces.findIndex(p => p.id === produceToSave.id);
        let updatedProduces;

        if (existingProduceIndex > -1) {
            updatedProduces = [...farmer.produces];
            updatedProduces[existingProduceIndex] = produceToSave;
        } else {
            updatedProduces = [...farmer.produces, produceToSave];
        }
        onUpdateFarmer({ ...farmer, produces: updatedProduces });
        setIsProduceModalOpen(false);
    };

    const statusCounts = React.useMemo(() => {
        const counts = {
            all: farmer.produces.length,
            [ProduceStatus.PendingApproval]: 0,
            [ProduceStatus.ReadyForSale]: 0,
            [ProduceStatus.UpcomingHarvest]: 0,
            [ProduceStatus.Sold]: 0,
            [ProduceStatus.Rejected]: 0,
        };
        farmer.produces.forEach(p => {
             if (p.status in counts) {
                counts[p.status]++;
            }
        });
        return counts;
    }, [farmer.produces]);

    const filteredProduces = React.useMemo(() => {
        if (statusFilter === 'all') {
            return farmer.produces;
        }
        return farmer.produces.filter(p => p.status === statusFilter);
    }, [farmer.produces, statusFilter]);

    const StatusBadge = ({ produce }: { produce: Produce }) => {
        const daysUntilHarvest = produce.expectedHarvestDate 
            ? Math.ceil((new Date(produce.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : 0;

        if (produce.status === ProduceStatus.ReadyForSale) {
            return <div className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">Ready for Sale</div>;
        }
        if (produce.status === ProduceStatus.UpcomingHarvest && daysUntilHarvest > 0) {
            return <div className="text-xs font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex items-center"><Clock className="h-3 w-3 mr-1" /> In {daysUntilHarvest} days</div>;
        }
         if (produce.status === ProduceStatus.Sold) {
            return <div className="text-xs font-bold bg-gray-200 text-gray-800 px-2 py-1 rounded-full">Sold</div>;
        }
        return <div className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{produce.status}</div>;
    };
    
    const tabs = [
        { name: 'All Listings', status: 'all' as const, count: statusCounts.all },
        { name: 'Pending Approval', status: ProduceStatus.PendingApproval, count: statusCounts[ProduceStatus.PendingApproval] },
        { name: 'Ready for Sale', status: ProduceStatus.ReadyForSale, count: statusCounts[ProduceStatus.ReadyForSale] },
        { name: 'Upcoming', status: ProduceStatus.UpcomingHarvest, count: statusCounts[ProduceStatus.UpcomingHarvest] },
        { name: 'Sold', status: ProduceStatus.Sold, count: statusCounts[ProduceStatus.Sold] },
        { name: 'Rejected', status: ProduceStatus.Rejected, count: statusCounts[ProduceStatus.Rejected] },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-gray-800">My Produce Listings</h1>
                 <button
                    type="button"
                    onClick={handleAddNewProduce}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md text-sm shadow-sm"
                >
                    <Plus className="mr-2 h-5 w-5"/>
                    Add New Produce
                </button>
            </div>

            <div className="mb-6 bg-white rounded-lg shadow">
                <div className="px-6 pt-4 border-b border-gray-200">
                    <div className="flex space-x-8 -mb-px overflow-x-auto">
                        {tabs.map((tab) => (
                           (tab.count > 0 || tab.status === 'all') && (
                                <button
                                    key={tab.name}
                                    onClick={() => setStatusFilter(tab.status)}
                                    className={classNames(
                                        'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center whitespace-nowrap',
                                        statusFilter === tab.status
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    {tab.name}
                                    <span className={classNames(
                                        'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                                        statusFilter === tab.status
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-gray-100 text-gray-600'
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                           )
                        ))}
                    </div>
                </div>
            </div>
            
            {filteredProduces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProduces.map(p => (
                        <div key={p.id} className="bg-white rounded-lg shadow-md flex flex-col">
                            <img src={p.photos[0] || `https://api.dicebear.com/8.x/icons/svg?seed=${p.name}`} alt={p.name} className="w-full h-40 object-cover rounded-t-lg" />
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-800">{p.name} <span className="text-base font-medium text-gray-500">({p.variety})</span></h3>
                                    <StatusBadge produce={p} />
                                </div>
                                <p className={classNames("text-sm font-semibold mt-1", p.isOrganic ? 'text-green-600' : 'text-gray-500')}>{p.isOrganic ? 'Organic' : p.category}</p>
                                
                                <div className="mt-4 text-gray-600 space-y-2 text-sm flex-grow">
                                    <div className="flex items-center">
                                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{p.quantity} {p.unit}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>Available from: {new Date(p.availableFrom).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="border-t mt-4 pt-3 flex items-center justify-end space-x-2">
                                     <button type="button" onClick={() => handleEditProduce(p)} className="p-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-md flex items-center">
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    <button type="button" onClick={() => handleDeleteProduce(p.id)} className="p-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md flex items-center">
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <p className="text-lg text-gray-600">No produce found for this status.</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different filter or click 'Add New Produce' to get started.</p>
                </div>
            )}
            
            <ProduceEditModal
                isOpen={isProduceModalOpen}
                produce={selectedProduce}
                onClose={() => setIsProduceModalOpen(false)}
                onSave={handleSaveProduce}
            />
        </div>
    );
};

export default FarmerListings;