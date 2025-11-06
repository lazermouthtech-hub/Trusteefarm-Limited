import React from 'react';
import { Buyer, BuyerRequest } from '../types';
import { Plus, ClipboardList } from 'lucide-react';
import RequestFormModal from '../components/buyers/RequestFormModal';
import { classNames } from '../lib/utils';

interface BuyerRequestsProps {
    requests: BuyerRequest[];
    currentBuyer: Buyer;
    onAddRequest: (requestData: Omit<BuyerRequest, 'id' | 'buyerId' | 'buyerName' | 'status' | 'dateSubmitted'>) => void;
}

const getStatusBadgeClass = (status: BuyerRequest['status']) => {
    switch (status) {
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'In Progress':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Fulfilled':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
};

const BuyerRequests = ({ requests, currentBuyer, onAddRequest }: BuyerRequestsProps) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const myRequests = React.useMemo(() => {
        return requests
            .filter(r => r.buyerId === currentBuyer.id)
            .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
    }, [requests, currentBuyer.id]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Produce Requests</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm"
                >
                    <Plus className="mr-2 h-5 w-5"/>
                    Create New Request
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Produce</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destination</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {myRequests.length > 0 ? (
                                myRequests.map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{req.produceName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                          <div>Grade: <strong>{req.grade}</strong></div>
                                          <div>Processing: <strong>{req.processing}</strong></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{req.quantity} {req.unit}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {req.requestType}
                                            {req.requestType === 'Export' && ` (${req.destinationCountry})`}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div>Required: <strong>{new Date(req.requiredByDate).toLocaleDateString()}</strong></div>
                                            <div>Submitted: {new Date(req.dateSubmitted).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={classNames('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusBadgeClass(req.status))}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="text-center py-16">
                                            <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No requests found</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new produce request.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <RequestFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(data) => {
                    onAddRequest(data);
                    // The modal will handle its own closing after success
                }}
            />
        </div>
    );
};

export default BuyerRequests;