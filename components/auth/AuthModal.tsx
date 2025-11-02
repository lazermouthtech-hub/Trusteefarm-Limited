import React from 'react';
import { X, UserPlus, LogIn } from 'lucide-react';
import { classNames } from '../../lib/utils';
import GoogleIcon from '../icons/GoogleIcon';
import MicrosoftIcon from '../icons/MicrosoftIcon';
import AppleIcon from '../icons/AppleIcon';


type AuthMode = 'login' | 'register';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, pass: string) => { success: boolean; message?: string };
    onRegister: (name: string, email: string, pass: string) => { success: boolean; message?: string };
}

const SocialButton = ({ provider, icon, onClick }: { provider: string, icon: React.ReactNode, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
        {icon}
        <span className="ml-3">Continue with {provider}</span>
    </button>
);


const AuthModal = ({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) => {
    const [mode, setMode] = React.useState<AuthMode>('login');
    
    // Login State
    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    
    // Register State
    const [regName, setRegName] = React.useState('');
    const [regEmail, setRegEmail] = React.useState('');
    const [regPassword, setRegPassword] = React.useState('');

    const [error, setError] = React.useState('');

    if (!isOpen) return null;
    
    const resetForms = () => {
        setLoginEmail('');
        setLoginPassword('');
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        setError('');
    }

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = onLogin(loginEmail, loginPassword);
        if (!result.success) {
            setError(result.message || 'Login failed.');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (regPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        const result = onRegister(regName, regEmail, regPassword);
        if (!result.success) {
            setError(result.message || 'Registration failed.');
        }
    };
    
    const handleSocialLogin = (provider: 'Google' | 'Microsoft' | 'Apple') => {
        setError('');
        // This is a simulation. In a real app, this would trigger an OAuth flow.
        const mockName = `${provider} User`;
        const mockEmail = `${provider.toLowerCase()}.user@example.com`;
        const mockPassword = 'social_login_password'; // Dummy password for the handler
        
        console.log(`Simulating login with ${provider}...`);
        onRegister(mockName, mockEmail, mockPassword);
    };

    const formInputStyle = "mt-1 appearance-none block w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
                
                <div className="p-8 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                        </h2>
                        <p className="text-sm text-center text-gray-500 mt-1">
                            {mode === 'login' ? 'Sign in to access the marketplace.' : 'Join to connect with farmers.'}
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        <SocialButton provider="Google" icon={<GoogleIcon className="h-5 w-5" />} onClick={() => handleSocialLogin('Google')} />
                        <SocialButton provider="Microsoft" icon={<MicrosoftIcon className="h-5 w-5" />} onClick={() => handleSocialLogin('Microsoft')} />
                        <SocialButton provider="Apple" icon={<AppleIcon className="h-5 w-5" />} onClick={() => handleSocialLogin('Apple')} />
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-xs font-semibold text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {mode === 'login' ? (
                        <form className="space-y-4" onSubmit={handleLoginSubmit}>
                             <div>
                               <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                               <input id="login-email" type="email" required className={formInputStyle} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                             </div>
                             <div>
                              <label htmlFor="login-password"className="block text-sm font-medium text-gray-700">Password</label>
                              <input id="login-password" type="password" required className={formInputStyle} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                             </div>
                              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                                <LogIn className="h-5 w-5 mr-2"/> Sign In
                              </button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                            <div>
                              <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                              <input id="reg-name" type="text" required className={formInputStyle} value={regName} onChange={(e) => setRegName(e.target.value)} />
                            </div>
                             <div>
                               <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">Email Address</label>
                               <input id="reg-email" type="email" required className={formInputStyle} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                             </div>
                             <div>
                              <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700">Password</label>
                              <input id="reg-password" type="password" required className={formInputStyle} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                             </div>
                             <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                                <UserPlus className="h-5 w-5 mr-2"/> Create Account
                              </button>
                        </form>
                    )}
                    
                    {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}
                    
                    <p className="text-center text-sm text-gray-500 pt-2">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); resetForms(); }} className="font-medium text-primary-600 hover:text-primary-500">
                            {mode === 'login' ? "Sign up" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
