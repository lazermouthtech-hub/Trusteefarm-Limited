
import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import PublicHeader from '../components/layout/PublicHeader';
import { Page } from '../types';
import LogoIcon from '../components/layout/LogoIcon';

interface FarmerLoginProps {
  onLogin: (phone: string, pass: string) => boolean;
  setCurrentPage: (page: Page) => void;
  registrationSuccess: boolean;
  setRegistrationSuccess: (status: boolean) => void;
  // FIX: Add theme and setTheme to props to pass them to PublicHeader
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const FarmerLogin = ({ onLogin, setCurrentPage, registrationSuccess, setRegistrationSuccess, theme, setTheme }: FarmerLoginProps) => {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRegistrationSuccess(false);

    const success = onLogin(phone, password);
    if (!success) {
      setError('Invalid phone number or password.');
    }
  };
  
  const formInputStyle = "mt-1 appearance-none block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* FIX: Pass theme and setTheme props to PublicHeader */}
      <PublicHeader currentPage="farmer_login" setCurrentPage={setCurrentPage} onBuyerAuthClick={() => setCurrentPage('home')} theme={theme} setTheme={setTheme} />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <LogoIcon className="mx-auto h-12 w-12" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Farmer Portal</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to manage your profile and produce.</p>
          </div>

          {registrationSuccess && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0"><CheckCircle className="h-5 w-5 text-green-400" /></div>
                    <div className="ml-3"><p className="text-sm text-green-700">Registration successful! Please sign in.</p></div>
                </div>
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
             <div>
               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
               <input id="phone" name="phone" type="tel" required className={formInputStyle} placeholder="+233 XX XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
             </div>
             <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
              <input id="password" name="password" type="password" required className={formInputStyle} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
             </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mt-4">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-primary-300" />
                </span>
                Sign in
              </button>
            </div>
          </form>
           <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('farmer_register'); }} className="font-medium text-primary-600 hover:text-primary-500">
                    Sign up here
                </a>
            </p>
        </div>
      </main>
    </div>
  );
};

export default FarmerLogin;