import React from 'react';
import { Produce, ProduceStatus } from '../../types';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface ProduceCardProps {
    produce: Produce & { farmerName: string, farmerLocation: string };
    onViewDetails: () => void;
}

const ProduceCard = ({ produce, onViewDetails }: ProduceCardProps) => {
    const daysUntilHarvest = produce.expectedHarvestDate 
        ? Math.ceil((new Date(produce.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const StatusBadge = () => {
        if (produce.status === ProduceStatus.ReadyForSale) {
            return <div className="absolute top-3 right-3 text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full">Ready Now</div>;
        }
        if (produce.status === ProduceStatus.UpcomingHarvest && daysUntilHarvest > 0) {
            return <div className="absolute top-3 right-3 text-xs font-bold bg-orange-500 text-white px-2 py-1 rounded-full flex items-center"><Clock className="h-3 w-3 mr-1" /> {daysUntilHarvest} days</div>;
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="relative">
                <img src={produce.photos[0] || `https://api.dicebear.com/8.x/icons/svg?seed=${produce.name}`} alt={produce.name} className="w-full h-48 object-cover" />
                <StatusBadge />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className={classNames("text-sm font-semibold", produce.isOrganic ? 'text-green-600' : 'text-gray-500')}>{produce.isOrganic ? 'Organic' : produce.category}</p>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{produce.name} <span className="text-base font-medium text-gray-600">({produce.variety})</span></h3>
                
                <p className="text-2xl font-bold text-primary-700 mt-2">
                    {produce.quantity} <span className="text-lg font-medium text-gray-500">{produce.unit}</span>
                </p>

                <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-600 flex-grow">
                     <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{produce.farmerName}, {produce.farmerLocation}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Available from: {new Date(produce.availableFrom).toLocaleDateString()}</span>
                    </div>
                </div>

                <button 
                    onClick={onViewDetails}
                    className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 font-semibold transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProduceCard;