import React from 'react';
import { Buyer } from '../types';
// FIX: Import Page type from types.ts to avoid circular dependency.
import { Page } from '../types';
import { ArrowRight, ShoppingCart } from 'lucide-react';

interface BuyerDashboardProps {
    buyer: Buyer;
    setCurrentPage: (page: Page) => void;
}

const BuyerDashboard = ({ buyer, setCurrentPage }: BuyerDashboardProps) => {
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {buyer.name}!</h1>
                <p className="text-gray-600 mt-1">You are now logged in. Start exploring fresh produce from trusted farmers across Ghana.</p>
            </div>
            
            <div className="grid grid-cols-1">
                <div 
                    onClick={() => setCurrentPage('marketplace')}
                    className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-primary-500"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <ShoppingCart className="h-8 w-8 text-primary-600" />
                            <h3 className="font-semibold text-2xl text-gray-800 mt-4">Explore the Marketplace</h3>
                            <p className="mt-2 text-gray-600">Find the best local produce and connect with farmers.</p>
                        </div>
                        <ArrowRight className="h-8 w-8 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;