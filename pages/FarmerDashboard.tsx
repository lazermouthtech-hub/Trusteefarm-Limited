import React from 'react';
import { Farmer } from '../types';

interface FarmerDashboardProps {
    farmer: Farmer;
}

const FarmerDashboard = ({ farmer }: FarmerDashboardProps) => {
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {farmer.name}!</h1>
                <p className="text-gray-600 mt-1">This is your personal dashboard. Use the menu on the left to update your profile or browse the marketplace.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg text-gray-700">Profile Status</h3>
                    <p className="mt-2 text-gray-600">Your profile is <span className="font-bold text-primary-600">{(farmer.profileCompleteness * 100).toFixed(0)}%</span> complete.</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${farmer.profileCompleteness * 100}%` }}></div>
                    </div>
                     <p className="text-xs text-gray-500 mt-2">Complete your profile to increase buyer trust.</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-semibold text-lg text-gray-700">My Listings</h3>
                    <p className="mt-2 text-gray-600">You currently have <span className="font-bold text-primary-600">{farmer.produces.length}</span> active produce listings in the marketplace.</p>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;