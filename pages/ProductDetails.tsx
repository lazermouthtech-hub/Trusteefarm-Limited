import React from 'react';
import { Farmer, Produce, UserRole, GradingBadge, SystemSettings, SubscriptionPlan, Buyer, AdminUser } from '../types';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Shield, Phone, Mail } from 'lucide-react';
import { calculateFarmerGrade, classNames } from '../lib/utils';
import SubscriptionModal from '../components/marketplace/SubscriptionModal';

interface ProductDetailsProps {
    produce: Produce;
    farmer: Farmer;
    currentUser: AdminUser | Farmer | Buyer | null;
    onBack: () => void;
    settings: SystemSettings;
    onPlanSelect: (plan: SubscriptionPlan, cycle: 'monthly' | 'yearly') => void;
}

const ProductDetails = ({ produce, farmer, currentUser, onBack, settings, onPlanSelect }: ProductDetailsProps) => {
    
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = React.useState(false);
    const farmerGrade = calculateFarmerGrade(farmer);
    
    const badgeColors: Record<GradingBadge, string> = {
        [GradingBadge.Premium]: "bg-purple-100 text-purple-800 border-purple-300",
        [GradingBadge.Trusted]: "bg-blue-100 text-blue-800 border-blue-300",
        [GradingBadge.Verified]: "bg-green-100 text-green-800 border-green-300",
        [GradingBadge.NewFarmer]: "bg-gray-100 text-gray-800 border-gray-300",
    };

    const getUserRole = (): UserRole => {
        if (!currentUser) return 'public';
        if ('privilege' in currentUser) return 'admin';
        if ('produces' in currentUser) return 'farmer';
        return 'buyer';
    };
    
    const userRole = getUserRole();
    
    const isSubscribedBuyer = userRole === 'buyer' && !!(currentUser as Buyer).subscription;
    const canViewContactInfo = userRole === 'admin' || (userRole === 'farmer' && currentUser?.id === farmer.id) || isSubscribedBuyer;

    const handleContactClick = () => {
        if (userRole === 'buyer' && !isSubscribedBuyer) {
            setIsSubscriptionModalOpen(true);
        } else if (userRole === 'public') {
            alert("Please log in as a buyer to contact farmers.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Marketplace
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product Info */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Gallery */}
                            <div>
                                <img src={produce.photos[0] || `https://api.dicebear.com/8.x/icons/svg?seed=${produce.name}`} alt={produce.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                            </div>
                            {/* Product Details */}
                            <div>
                                <p className={classNames("font-semibold", produce.isOrganic ? 'text-green-600' : 'text-gray-500')}>{produce.isOrganic ? 'Certified Organic' : produce.category}</p>
                                <h1 className="text-4xl font-extrabold text-gray-900 mt-2">{produce.name}</h1>
                                <p className="text-xl text-gray-600">{produce.variety}</p>

                                <div className="mt-6">
                                    <p className="text-4xl font-bold text-primary-700">
                                        {produce.quantity} <span className="text-2xl font-medium text-gray-500">{produce.unit}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">Available for purchase</p>
                                </div>
                                
                                <div className="mt-6 border-t pt-4 space-y-3">
                                    <h3 className="font-semibold text-gray-800">Details</h3>
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Available from: {new Date(produce.availableFrom).toLocaleDateString()}</span>
                                    </div>
                                    {produce.expectedHarvestDate && (
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Expected Harvest: {new Date(produce.expectedHarvestDate).toLocaleDateString()}</span>
                                    </div>
                                    )}
                                     <div className="flex items-center text-gray-700">
                                        <CheckCircle className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Status: <span className="font-semibold text-primary-600">{produce.status}</span></span>
                                    </div>
                                </div>
                                
                                { userRole === 'buyer' && !isSubscribedBuyer &&
                                    <button onClick={handleContactClick} className="mt-8 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-semibold text-lg transition-colors">
                                        Unlock Contact Details
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Farmer Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">About the Farmer</h2>
                             <div className="flex items-center space-x-4">
                                <img src={farmer.profilePhoto} alt={farmer.name} className="h-16 w-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{farmer.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center"><MapPin className="h-4 w-4 mr-1"/>{farmer.location}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={classNames("px-3 py-1 text-sm font-semibold rounded-full border", badgeColors[farmerGrade.badge])}>
                                    {farmerGrade.badge} Farmer
                                </span>
                            </div>
                            <div className="mt-4 border-t pt-4 space-y-3">
                                 <div className="flex items-center text-gray-700">
                                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{canViewContactInfo ? farmer.phone : '**********'}</span>
                                </div>
                                 <div className="flex items-center text-gray-700">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{canViewContactInfo ? (farmer.email || 'Not provided') : 'Email is protected'}</span>
                                </div>
                                {!canViewContactInfo && (
                                    <div className="text-xs text-center p-2 bg-gray-100 rounded-md text-gray-600">
                                        Subscribe to a buyer plan to view contact details.
                                    </div>
                                )}
                            </div>
                             <div className="mt-4 border-t pt-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Verifications</h4>
                                <div className="space-y-2 text-sm">
                                    <p className={classNames("flex items-center", farmer.phoneVerified ? "text-green-600" : "text-gray-500")}>
                                        <Shield className="h-4 w-4 mr-2"/> Phone Verified
                                    </p>
                                    <p className={classNames("flex items-center", farmer.identityVerified ? "text-green-600" : "text-gray-500")}>
                                        <Shield className="h-4 w-4 mr-2"/> Identity Verified
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <SubscriptionModal 
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
                settings={settings}
                buyerEmail={(currentUser as Buyer)?.email || ''}
                onPlanSelect={onPlanSelect}
            />
        </div>
    );
};

export default ProductDetails;