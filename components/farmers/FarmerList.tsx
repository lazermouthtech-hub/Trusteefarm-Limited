import React from 'react';
import { Farmer } from '../../types';
import { Edit } from 'lucide-react';

interface FarmerListProps {
    farmers: Farmer[];
    onEdit: (farmer: Farmer) => void;
}

const FarmerList = ({ farmers, onEdit }: FarmerListProps) => {
    
    if (farmers.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-lg text-gray-600">No farmers found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or adding new farmers.</p>
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acres</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harvest Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {farmers.map((farmer) => {
                        const primaryProduce = farmer.produces[0];
                        return (
                            <tr key={farmer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={farmer.profilePhoto} alt={farmer.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{farmer.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{primaryProduce?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.farmSize ? `${farmer.farmSize}` : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {primaryProduce?.expectedHarvestDate ? new Date(primaryProduce.expectedHarvestDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(farmer.registrationDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEdit(farmer)} className="text-primary-600 hover:text-primary-900 flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors">
                                        <Edit className="h-4 w-4 mr-1"/>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default FarmerList;