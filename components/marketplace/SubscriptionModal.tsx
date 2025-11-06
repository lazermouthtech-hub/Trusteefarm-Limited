import React from 'react';
import { X, Check } from 'lucide-react';
import { classNames } from '../../lib/utils';
import { SubscriptionPlan } from '../../types';
import { mockSubscriptionPlans } from '../../data/mockData';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlanSelect: (plan: SubscriptionPlan, cycle: 'monthly' | 'yearly') => void;
    isUpgrade: boolean;
}

const SubscriptionModal = ({ isOpen, onClose, onPlanSelect, isUpgrade }: SubscriptionModalProps) => {
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <div className="p-6 border-b">
                     <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {isUpgrade ? "Upgrade Your Plan" : "Unlock Farmer Contact Details"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isUpgrade ? "You've used all your contacts for this period. Upgrade to connect with more farmers." : "Choose a plan to connect directly with farmers and access premium features."}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto">
                    {/* Billing Cycle Toggle */}
                    <div className="flex justify-center items-center mb-10">
                        <div className="relative flex p-1 bg-gray-200 rounded-full shadow-inner">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={classNames(
                                    'w-28 py-1.5 text-sm font-semibold rounded-full z-10 transition-colors',
                                    billingCycle === 'monthly' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={classNames(
                                    'w-28 py-1.5 text-sm font-semibold rounded-full z-10 transition-colors',
                                    billingCycle === 'yearly' ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:bg-gray-300'
                                )}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {mockSubscriptionPlans.map((tier) => (
                            <div
                                key={tier.name}
                                className={classNames(
                                    'rounded-xl border p-8 flex flex-col relative',
                                    tier.popular ? 'border-primary-500 border-2' : 'border-gray-200'
                                )}
                            >
                                {tier.popular && (
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-semibold bg-primary-500 text-white">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                                <p className="mt-4 text-sm text-gray-600 min-h-[4rem]">{tier.description}</p>
                                <div className="my-8">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-900">
                                            ₵{billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly}
                                        </span>
                                        <span className="ml-1 text-lg font-medium text-gray-500">
                                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && (
                                        <p className="text-sm text-primary-600 mt-1">
                                            <span className="font-semibold">Save ₵{(tier.price.monthly * 12) - tier.price.yearly}</span> (2 months free)
                                        </p>
                                    )}
                                </div>
                                <ul className="space-y-4 text-sm text-gray-700 flex-grow">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onPlanSelect(tier, billingCycle)}
                                    className={classNames(
                                        'mt-8 w-full py-3 px-4 rounded-md font-semibold text-center transition-colors',
                                        tier.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                    )}
                                >
                                    {tier.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
              @keyframes scale-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default SubscriptionModal;