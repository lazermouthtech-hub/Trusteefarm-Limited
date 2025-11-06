import React from 'react';
import { BuyerRequest } from '../types';
import { ClipboardList, MoreVertical, Search } from 'lucide-react';
import { classNames } from '../lib/utils';
import Pagination from '../components/farmers/Pagination';
import { Menu, Transition } from '@headlessui/react';


interface AdminBuyerRequestsProps {
    requests: BuyerRequest[];
    onUpdateRequestStatus: (requestId: string, newStatus: BuyerRequest['status']) => void;
}

const ITEMS_PER_PAGE = 10;

const getStatusBadgeClass = (status: BuyerRequest['status']) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Fulfilled': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const AdminBuyerRequests = ({ requests, onUpdateRequestStatus }: AdminBuyerRequestsProps) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [activeTab, setActiveTab] = React.useState<BuyerRequest['status'] | 'all'>('all');
    
    const statusCounts = React.useMemo(() => {
        const counts = { all: requests.length, Pending: 0, 'In Progress': 0, Fulfilled: 0, Cancelled: 0 };
        requests.forEach(r => { if(r.status in counts) counts[r.status]++; });
        return counts;
    }, [requests]);

    const filteredRequests = React.useMemo(() => {
        return requests.filter(req => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = req.buyerName.toLowerCase().includes(searchLower) || req.produceName.toLowerCase().includes(searchLower);
            const matchesTab = activeTab === 'all' || req.status === activeTab;
            return matchesSearch && matchesTab;
        }).sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
    }, [requests, searchTerm, activeTab]);

    const paginatedRequests = React.useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredRequests, currentPage]);
    
    const tabs: { name: string; status: BuyerRequest['status'] | 'all' }[] = [
        { name: 'All', status: 'all' },
        { name: 'Pending', status: 'Pending' },
        { name: 'In Progress', status: 'In Progress' },
        { name: 'Fulfilled', status: 'Fulfilled' },
        { name: 'Cancelled', status: 'Cancelled' }
    ];

    const possibleActions: BuyerRequest['status'][] = ['Pending', 'In Progress', 'Fulfilled', 'Cancelled'];

    return (
        <div className="space-y-6">
            <div className="relative max-w-lg">
                <input
                    type="text"
                    placeholder="Search by buyer or produce..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-6 pt-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-8 -mb-px overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.status)}
                                className={classNames(
                                    'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center whitespace-nowrap',
                                    activeTab === tab.status ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                )}
                            >
                                {tab.name}
                                <span className={classNames('ml-2 py-0.5 px-2 rounded-full text-xs font-medium', activeTab === tab.status ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600')}>
                                    {statusCounts[tab.status]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Buyer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Produce Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Destination</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                           {paginatedRequests.length > 0 ? paginatedRequests.map(req => (
                               <tr key={req.id}>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.buyerName}</div>
                                       <div className="text-sm text-gray-500 dark:text-gray-400">{req.buyerId}</div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.produceName} ({req.quantity} {req.unit})</div>
                                       <div className="text-sm text-gray-500 dark:text-gray-400">Grade: {req.grade}, {req.processing}</div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       {req.requestType === 'Export' ? `Export (${req.destinationCountry})` : 'Local'}
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                       <div>Req: <strong>{new Date(req.requiredByDate).toLocaleDateString()}</strong></div>
                                       <div>Sub: {new Date(req.dateSubmitted).toLocaleDateString()}</div>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap">
                                       <span className={classNames('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusBadgeClass(req.status))}>
                                           {req.status}
                                       </span>
                                   </td>
                                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                       <Menu as="div" className="relative inline-block text-left">
                                           <div>
                                               <Menu.Button className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                                   <MoreVertical className="h-5 w-5" />
                                               </Menu.Button>
                                           </div>
                                           <Transition as={React.Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                               <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                   <div className="py-1">
                                                        {possibleActions.map(action => (
                                                           <Menu.Item key={action} disabled={req.status === action}>
                                                               {({ active, disabled }) => (
                                                                   <button onClick={() => onUpdateRequestStatus(req.id, action)} className={classNames(active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300', disabled ? 'opacity-50 cursor-not-allowed' : '', 'block w-full text-left px-4 py-2 text-sm')}>
                                                                       Mark as {action}
                                                                   </button>
                                                               )}
                                                           </Menu.Item>
                                                       ))}
                                                   </div>
                                               </Menu.Items>
                                           </Transition>
                                       </Menu>
                                   </td>
                               </tr>
                           )) : (
                               <tr>
                                   <td colSpan={7}>
                                       <div className="text-center py-16">
                                            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No requests found</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">There are no requests matching the current filters.</p>
                                        </div>
                                   </td>
                               </tr>
                           )}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredRequests.length}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default AdminBuyerRequests;
