import React from 'react';
import { SubscriptionPlan, SystemSettings } from '../types';
import PaystackButton from '../components/payments/PaystackButton';
import { ArrowLeft, Check, Lock, CreditCard } from 'lucide-react';

interface CheckoutPageProps {
    plan: SubscriptionPlan;
    billingCycle: 'monthly' | 'yearly';
    settings: SystemSettings;
    userEmail: string;
    onBack: () => void;
    onSubscriptionSuccess: (planName: string) => void;
}

const CheckoutPage = ({ plan, billingCycle, settings, userEmail, onBack, onSubscriptionSuccess }: CheckoutPageProps) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    
    const isPaystackEnabled = settings.paymentSettings.activeGateway === 'paystack';
    const paystackKey = settings.paymentSettings.paystack.mode === 'live' 
        ? settings.paymentSettings.paystack.livePublicKey 
        : settings.paymentSettings.paystack.testPublicKey;
    
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Complete Your Subscription</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Order Summary</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Plan</p>
                                    <p className="font-semibold text-gray-800">{plan.name} - {billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}</p>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600 border-t pt-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t pt-4 flex justify-between items-baseline">
                                    <p className="text-lg font-semibold text-gray-800">Total Due Today</p>
                                    <p className="text-2xl font-bold text-primary-600">
                                        ₵{price}
                                        <span className="text-base font-medium text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-3">Payment Details</h2>
                            <div className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={userEmail}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                <div className="p-4 bg-primary-50 border border-primary-200 rounded-md">
                                    <div className="flex items-center">
                                        <CreditCard className="h-6 w-6 text-primary-700" />
                                        <h3 className="ml-3 text-lg font-semibold text-primary-800">Pay with Paystack</h3>
                                    </div>
                                    <p className="mt-2 text-sm text-primary-700">You will be redirected to Paystack's secure payment page to complete your purchase.</p>
                                </div>
                                
                                {isPaystackEnabled && paystackKey ? (
                                    <PaystackButton
                                        publicKey={paystackKey}
                                        email={userEmail}
                                        amount={price}
                                        onSuccess={() => onSubscriptionSuccess(plan.name)}
                                        onClose={() => console.log('Payment closed.')}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700"
                                    >
                                        <Lock className="h-5 w-5 mr-2" />
                                        Pay ₵{price} Securely
                                    </PaystackButton>
                                ) : (
                                    <div className="text-center p-4 bg-red-50 text-red-700 rounded-md">
                                        Payment gateway is not configured. Please contact support.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;