import React from 'react';
import { Settings } from 'lucide-react';

const FarmerSettings = () => {
  return (
    <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
      <div className="text-center p-6">
        <Settings className="h-20 w-20 mx-auto text-primary-400" />
        <h1 className="mt-6 text-4xl font-bold text-gray-800">Settings</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Account and notification settings will be available here soon.
        </p>
      </div>
    </div>
  );
};

export default FarmerSettings;