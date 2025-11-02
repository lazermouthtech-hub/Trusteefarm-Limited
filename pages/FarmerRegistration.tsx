

import React from 'react';
import { UserPlus } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import { Page } from '../types';
import { Farmer } from '../types';
import LogoIcon from '../components/layout/LogoIcon';

interface FarmerRegistrationProps {
  onRegister: (newFarmer: Omit<Farmer, 'id' | 'status' | 'profilePhoto' | 'registrationDate' | 'produces' | 'profileCompleteness' | 'buyerRating' | 'successfulTransactions' | 'phoneVerified' | 'identityVerified' | 'bankAccountVerified'>) => void;
  setCurrentPage: (page: Page) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ghanaRegions = [
    'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
    'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
    'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
];

const FarmerRegistration = ({ onRegister, setCurrentPage, theme, setTheme }: FarmerRegistrationProps) => {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !location || !password) {
        setError('Please fill out all required fields.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    onRegister({ name, phone, location, password, email });
  };

  const formInputStyle = "mt-1 appearance-none block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader currentPage="farmer_register" setCurrentPage={setCurrentPage} onBuyerAuthClick={() => setCurrentPage('home')} theme={theme} setTheme={setTheme} />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <LogoIcon className="mx-auto h-12 w-12" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Become a Farmer</h1>
            <p className="mt-2 text-sm text-gray-600">Create your account to join our network.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" name="name" type="text" required className={formInputStyle} placeholder="e.g. Ama Serwaa" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input id="phone" name="phone" type="tel" required className={formInputStyle} placeholder="+233 XX XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (Optional)</label>
              <input id="email" name="email" type="email" className={formInputStyle} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Region)</label>
              <select
                id="location"
                name="location"
                required
                className={formInputStyle}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="" disabled>Select a Region</option>
                {ghanaRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
             <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required className={formInputStyle} placeholder="Minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" required className={formInputStyle} placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-4">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <UserPlus className="h-5 w-5 text-primary-300" />
                </span>
                Create Account
              </button>
            </div>
          </form>
           <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('farmer_login'); }} className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in here
                </a>
            </p>
        </div>
      </main>
    </div>
  );
};

export default FarmerRegistration;