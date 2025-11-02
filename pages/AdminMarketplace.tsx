import React from 'react';
import { Farmer, FarmerStatus, Produce, ProduceStatus } from '../types';
import { Check, X, Filter, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { classNames } from '../lib/utils';
import ProduceEditModal from '../components/farmers/ProduceEditModal';

// Confirmation Modal Component defined inline to avoid creating new files
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
              <div className="mt-2"><p className="text-sm text-gray-500">{message}</p></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { onConfirm(); onClose(); }}>
            Yes, Delete
          </button>
          <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm" onClick={onClose}>
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const getStatusBadge = (status: ProduceStatus) => {
    switch (status) {
        case ProduceStatus.PendingApproval:
            return 'bg-yellow-100 text-yellow-800';
        case ProduceStatus.ReadyForSale:
        case ProduceStatus.UpcomingHarvest:
            return 'bg-green-100 text-green-800';
        case ProduceStatus.Rejected:
            return 'bg-red-100 text-red-800';
        case ProduceStatus.Sold:
            return 'bg-gray-200 text-gray-800';
        default:
            return 'bg-blue-100 text-blue-800';
    }
};

interface AdminMarketplaceProps {
    farmers: Farmer[];
    onUpdateFarmer: (farmer: Farmer) => void;
}


const AdminMarketplace = ({ farmers, onUpdateFarmer }: AdminMarketplaceProps) => {
    const [statusFilter, setStatusFilter] = React.useState<ProduceStatus | 'all'>('all');
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [editingProduce, setEditingProduce] = React.useState<{ farmer: Farmer; produce: Produce } | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<{ farmerId: string; produceId: string } | null>(null);

    const allProduceWithFarmer = React.useMemo(() => {
        return farmers.flatMap(farmer => 
            farmer.produces.map(produce => ({
                ...produce,
                farmerId: farmer.id,
                farmerName: farmer.name,
                farmerStatus: farmer.status
            }))
        ).sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }, [farmers]);

    const filteredProduce = React.useMemo(() => {
        if (statusFilter === 'all') return allProduceWithFarmer;
        return allProduceWithFarmer.filter(p => p.status === statusFilter);
    }, [allProduceWithFarmer, statusFilter]);

    const handleUpdateProduceStatus = (farmerId: string, produceId: string, newStatus: ProduceStatus) => {
        const farmerToUpdate = farmers.find(f => f.id === farmerId);
        if (!farmerToUpdate) return;
        
        const updatedProduces = farmerToUpdate.produces.map(p => 
            p.id === produceId ? { ...p, status: newStatus } : p
        );
        
        onUpdateFarmer({ ...farmerToUpdate, produces: updatedProduces });
    };

    const handleEdit = (farmerId: string, produceId: string) => {
        const farmer = farmers.find(f => f.id === farmerId);
        const produce = farmer?.produces.find(p => p.id === produceId);
        if (farmer && produce) {
            setEditingProduce({ farmer, produce });
            setIsEditModalOpen(true);
        }
    };
    
    const handleDeleteClick = (farmerId: string, produceId: string) => {
        setItemToDelete({ farmerId, produceId });
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const { farmerId, produceId } = itemToDelete;
            const farmer = farmers.find(f => f.id === farmerId);
            if (farmer) {
                const updatedProduces = farmer.produces.filter(p => p.id !== produceId);
                onUpdateFarmer({ ...farmer, produces: updatedProduces });
            }
        }
        setItemToDelete(null);
    };
    
    const handleSaveProduce = (updatedProduce: Produce) => {
        if (editingProduce) {
            const farmer = editingProduce.farmer;
            const updatedProduces = farmer.produces.map(p => p.id === updatedProduce.id ? updatedProduce : p);
            onUpdateFarmer({ ...farmer, produces: updatedProduces });
            setIsEditModalOpen(false);
            setEditingProduce(null);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center space-x-4">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-700">Filter Listings</h3>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        {['all', ...Object.values(ProduceStatus)].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status as ProduceStatus | 'all')}
                                className={classNames(
                                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                                    statusFilter === status
                                        ? 'bg-primary-600 text-white shadow'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                )}
                            >
                                {status === 'all' ? 'All Statuses' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produce</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProduce.map(produce => (
                                <tr key={produce.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md object-cover" src={produce.photos[0] || `https://api.dicebear.com/8.x/icons/svg?seed=${produce.name}`} alt={produce.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{produce.name}</div>
                                                <div className="text-sm text-gray-500">{produce.quantity} {produce.unit}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{produce.farmerName}</div>
                                        <div className={classNames("text-xs", produce.farmerStatus === FarmerStatus.Active ? 'text-green-600' : 'text-yellow-600')}>
                                            {produce.farmerStatus}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(produce.dateAdded).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={classNames('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusBadge(produce.status))}>
                                            {produce.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            {produce.status === ProduceStatus.PendingApproval && (
                                                <>
                                                    <button onClick={() => handleUpdateProduceStatus(produce.farmerId, produce.id, ProduceStatus.ReadyForSale)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                                                        <Check className="h-4 w-4 mr-1"/> Approve
                                                    </button>
                                                    <button onClick={() => handleUpdateProduceStatus(produce.farmerId, produce.id, ProduceStatus.Rejected)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                                                        <X className="h-4 w-4 mr-1"/> Reject
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => handleEdit(produce.farmerId, produce.id)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md" title="Edit Produce">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(produce.farmerId, produce.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md" title="Delete Produce">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                         {produce.farmerStatus !== FarmerStatus.Active && produce.status === ProduceStatus.ReadyForSale && (
                                            <div className="flex items-center text-xs text-yellow-700 p-2 bg-yellow-50 rounded-md mt-2">
                                                <AlertTriangle className="h-4 w-4 mr-1"/>
                                                Farmer not active
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredProduce.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-lg text-gray-600">No produce found for this status.</p>
                        <p className="text-sm text-gray-400 mt-1">Try selecting a different filter.</p>
                    </div>
                )}
            </div>
             <ProduceEditModal
                isOpen={isEditModalOpen}
                produce={editingProduce?.produce || null}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProduce}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Produce Listing"
                message="Are you sure you want to permanently delete this produce? This action cannot be undone."
            />
        </div>
    );
};

export default AdminMarketplace;