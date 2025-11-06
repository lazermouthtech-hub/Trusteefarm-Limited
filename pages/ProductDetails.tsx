import React from 'react';
import { Farmer, Produce, UserRole, GradingBadge, SystemSettings, SubscriptionPlan, Buyer, AdminUser } from '../types';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Shield, Phone, Mail, Eye } from 'lucide-react';
import { calculateFarmerGrade, classNames } from '../lib/utils';
import SubscriptionModal from '../components/marketplace/SubscriptionModal';

interface ProductDetailsProps {
    produce: Produce;
    farmer: Farmer;
    currentUser: AdminUser | Farmer | Buyer | null;
    onBack: () => void;
    settings: SystemSettings;
    onPlanSelect: (plan: SubscriptionPlan, cycle: 'monthly' | 'yearly') => void;
    onViewFarmerContact: (farmerId: string) => void;
}

const ProductDetails = ({ produce, farmer, currentUser, onBack, settings, onPlanSelect, onViewFarmerContact }: ProductDetailsProps) => {
    
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = React.useState(false);
    const [isUpgradeModal, setIsUpgradeModal] = React.useState(false);

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
    const buyer = userRole === 'buyer' ? (currentUser as Buyer) : null;
    
    const canViewContactInfo = userRole === 'admin' || (userRole === 'farmer' && currentUser?.id === farmer.id) || buyer?.unlockedFarmerContacts?.includes(farmer.id);

    const handleViewContactClick = () => {
        if (userRole === 'public') {
            alert("Please log in or register as a buyer to contact farmers.");
            return;
        }

        if (buyer) {
            if (!buyer.subscription) {
                setIsUpgradeModal(false);
                setIsSubscriptionModalOpen(true);
            } else if (buyer.subscription.contactsUsed >= buyer.subscription.contactsAllowed) {
                setIsUpgradeModal(true);
                setIsSubscriptionModalOpen(true);
            } else {
                onViewFarmerContact(farmer.id);
            }
        }
    };
    
    const BuyerInfoBar = () => {
        if (!buyer || !buyer.subscription) return null;
        
        const contactsLeft = buyer.subscription.contactsAllowed - buyer.subscription.contactsUsed;

        return (
            <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-center my-6">
                <p className="font-semibold text-blue-800 dark:text-blue-200">Your {buyer.subscription.planName} Plan</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You have <span className="font-bold">{contactsLeft}</span> out of <span className="font-bold">{buyer.subscription.contactsAllowed}</span> contacts remaining this period.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <button onClick={onBack} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Marketplace
                </button>
                
                { userRole === 'buyer' && <BuyerInfoBar /> }

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Product Info */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Gallery */}
                            <div>
                                <img src={produce.photos[0] || `https://api.dicebear.com/8.x/icons/svg?seed=${produce.name}`} alt={produce.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
                            </div>
                            {/* Product Details */}
                            <div>
                                <p className={classNames("font-semibold", produce.isOrganic ? 'text-green-600' : 'text-gray-500')}>{produce.isOrganic ? 'Certified Organic' : produce.category}</p>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{produce.name}</h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300">{produce.variety}</p>

                                <div className="mt-6">
                                    <p className="text-4xl font-bold text-primary-700 dark:text-primary-400">
                                        {produce.quantity} <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">{produce.unit}</span>
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Available for purchase</p>
                                </div>
                                
                                <div className="mt-6 border-t dark:border-gray-700 pt-4 space-y-3">
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Details</h3>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Available from: {new Date(produce.availableFrom).toLocaleDateString()}</span>
                                    </div>
                                    {produce.expectedHarvestDate && (
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Expected Harvest: {new Date(produce.expectedHarvestDate).toLocaleDateString()}</span>
                                    </div>
                                    )}
                                     <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>Status: <span className="font-semibold text-primary-600 dark:text-primary-400">{produce.status}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Farmer Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">About the Farmer</h2>
                             <div className="flex items-center space-x-4">
                                <img src={farmer.profilePhoto} alt={farmer.name} className="h-16 w-16 rounded-full object-cover" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{farmer.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center"><MapPin className="h-4 w-4 mr-1"/>{farmer.location}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={classNames("px-3 py-1 text-sm font-semibold rounded-full border", badgeColors[farmerGrade.badge])}>
                                    {farmerGrade.badge} Farmer
                                </span>
                            </div>
                            <div className="mt-4 border-t dark:border-gray-700 pt-4 space-y-3">
                                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{canViewContactInfo ? farmer.phone : '**********'}</span>
                                </div>
                                 <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{canViewContactInfo ? (farmer.email || 'Not provided') : 'Email is protected'}</span>
                                </div>
                            </div>

                            {!canViewContactInfo && (
                                <button onClick={handleViewContactClick} className="mt-6 w-full flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 font-semibold text-lg transition-colors">
                                    <Eye className="h-5 w-5 mr-2" />
                                    View Contact
                                </button>
                            )}

                             <div className="mt-4 border-t dark:border-gray-700 pt-4">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Verifications</h4>
                                <div className="space-y-2 text-sm">
                                    <p className={classNames("flex items-center", farmer.phoneVerified ? "text-green-600" : "text-gray-500 dark:text-gray-400")}>
                                        <Shield className="h-4 w-4 mr-2"/> Phone Verified
                                    </p>
                                    <p className={classNames("flex items-center", farmer.identityVerified ? "text-green-600" : "text-gray-500 dark:text-gray-400")}>
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
                onPlanSelect={onPlanSelect}
                isUpgrade={isUpgradeModal}
            />
        </div>
    );
};

export default ProductDetails;