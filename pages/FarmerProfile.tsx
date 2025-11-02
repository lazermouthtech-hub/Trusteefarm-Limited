import React from 'react';
import { Farmer } from '../types';
import FarmerProfileForm from '../components/farmers/FarmerProfileForm';

interface FarmerProfileProps {
    farmer: Farmer;
    onUpdateProfile: (updatedFarmer: Farmer) => void;
}

const FarmerProfile = ({ farmer, onUpdateProfile }: FarmerProfileProps) => {
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Update Your Profile</h1>
                <p className="text-gray-600 mt-1">Keep your information current to build trust with buyers and unlock more opportunities.</p>
            </div>
            
            <FarmerProfileForm farmer={farmer} onSave={onUpdateProfile} />
        </div>
    );
};

export default FarmerProfile;