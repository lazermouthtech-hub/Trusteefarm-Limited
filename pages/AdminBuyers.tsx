import React from 'react';
import { Buyer } from '../types';
import { Edit, Trash2, Search, Plus, UserCheck, Shield } from 'lucide-react';
import { classNames } from '../lib/utils';
import Pagination from '../components/farmers/Pagination';
import EditBuyerModal from '../components/buyers/EditBuyerModal';
import ConfirmationModal from '../components/buyers/ConfirmationModal';
import BuyerStatCard from '../components/buyers/BuyerStatCard';


interface AdminBuyersProps {
  buyers: Buyer[];
  onAddBuyer: (newBuyer: Omit<Buyer, 'id'>) => void;
  onUpdateBuyer: (updatedBuyer: Buyer) => void;
  onDeleteBuyer: (buyerId: string) => void;
}

const ITEMS_PER_PAGE = 10;

const AdminBuyers = ({ buyers, onAddBuyer, onUpdateBuyer, onDeleteBuyer }: AdminBuyersProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'all' | 'subscribed' | 'unsubscribed'>('all');

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingBuyer, setEditingBuyer] = React.useState<Buyer | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [deletingBuyerId, setDeletingBuyerId] = React.useState<string | null>(null);
  
  const buyerStats = React.useMemo(() => ({
    total: buyers.length,
    premium: buyers.filter(b => b.subscription?.planName === 'Premium').length,
    standard: buyers.filter(b => b.subscription?.planName === 'Standard').length,
    basic: buyers.filter(b => b.subscription?.planName === 'Basic').length,
    noPlan: buyers.filter(b => !b.subscription).length,
  }), [buyers]);

  const filteredBuyers = React.useMemo(() => {
    return buyers.filter(buyer => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = buyer.name.toLowerCase().includes(searchLower) || buyer.email.toLowerCase().includes(searchLower);

      const matchesTab = 
        activeTab === 'all' ||
        (activeTab === 'subscribed' && !!buyer.subscription) ||
        (activeTab === 'unsubscribed' && !buyer.subscription);

      return matchesSearch && matchesTab;
    });
  }, [buyers, searchTerm, activeTab]);

  const paginatedBuyers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBuyers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBuyers, currentPage]);

  const handleOpenEditModal = (buyer: Buyer | null) => {
    setEditingBuyer(buyer);
    setIsEditModalOpen(true);
  };

  const handleSaveBuyer = (buyerToSave: Omit<Buyer, 'id'> | Buyer) => {
    if ('id' in buyerToSave) {
      onUpdateBuyer(buyerToSave);
    } else {
      onAddBuyer(buyerToSave);
    }
    setIsEditModalOpen(false);
  };

  const handleOpenDeleteModal = (buyerId: string) => {
    setDeletingBuyerId(buyerId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingBuyerId) {
      onDeleteBuyer(deletingBuyerId);
    }
    setIsConfirmModalOpen(false);
    setDeletingBuyerId(null);
  };

  const statusCounts = React.useMemo(() => ({
    all: buyers.length,
    subscribed: buyers.filter(b => !!b.subscription).length,
    unsubscribed: buyers.filter(b => !b.subscription).length,
  }), [buyers]);

  const tabs = [
    { name: 'All Buyers', status: 'all' as const, count: statusCounts.all },
    { name: 'Subscribed', status: 'subscribed' as const, count: statusCounts.subscribed },
    { name: 'No Plan', status: 'unsubscribed' as const, count: statusCounts.unsubscribed },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <BuyerStatCard title="Total Buyers" value={buyerStats.total} icon={UserCheck} iconColor="text-gray-500" />
          <BuyerStatCard title="Premium" value={buyerStats.premium} icon={Shield} iconColor="text-purple-500" />
          <BuyerStatCard title="Standard" value={buyerStats.standard} icon={Shield} iconColor="text-blue-500" />
          <BuyerStatCard title="Basic" value={buyerStats.basic} icon={Shield} iconColor="text-green-500" />
          <BuyerStatCard title="No Plan" value={buyerStats.noPlan} icon={Shield} iconColor="text-gray-400" />
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-grow max-w-lg">
          <input
            type="text"
            placeholder="Search buyers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => handleOpenEditModal(null)}
          className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5"/>
          Add Buyer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
         <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.status)}
                        className={classNames(
                            'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center whitespace-nowrap',
                            activeTab === tab.status
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                        )}
                    >
                        {tab.name}
                        <span className={classNames(
                            'ml-2 py-0.5 px-2 rounded-full text-xs font-medium',
                            activeTab === tab.status
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200'
                        )}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subscription</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Registered On</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{buyer.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{buyer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={classNames('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', buyer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300')}>
                          {buyer.status}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {buyer.subscription ? (
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {buyer.subscription.planName}
                        </span>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Contacts: {buyer.subscription.contactsUsed} / {buyer.subscription.contactsAllowed}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Expires: {new Date(buyer.subscription.expiresAt).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                        No Plan
                      </span>
                    )}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(buyer.registrationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenEditModal(buyer)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleOpenDeleteModal(buyer.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBuyers.length === 0 && (
            <div className="text-center py-16">
                <p className="text-lg text-gray-600 dark:text-gray-400">No buyers found.</p>
            </div>
          )}
        </div>
        <Pagination
            currentPage={currentPage}
            totalItems={filteredBuyers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
        />
      </div>

      <EditBuyerModal
        isOpen={isEditModalOpen}
        buyer={editingBuyer}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveBuyer}
      />
      
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Buyer"
        message="Are you sure you want to permanently delete this buyer? This action cannot be undone."
      />

    </div>
  );
};

export default AdminBuyers;