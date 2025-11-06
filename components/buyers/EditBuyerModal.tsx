import React, { useState, useEffect } from 'react';
import { Buyer } from '../../types';
import { X, Save } from 'lucide-react';
import { mockSubscriptionPlans } from '../../data/mockData';

interface EditBuyerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (buyer: Omit<Buyer, 'id'> | Buyer) => void;
    buyer: Buyer | null; // null for creating a new buyer
}

const EditBuyerModal = ({ isOpen, onClose, onSave, buyer }: EditBuyerModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
    const [planName, setPlanName] = useState('No Plan');
    const [expiresAt, setExpiresAt] = useState('');
    const [contactsAllowed, setContactsAllowed] = useState(0);
    const [contactsUsed, setContactsUsed] = useState(0);

    useEffect(() => {
        if (isOpen) {
            if (buyer) {
                setName(buyer.name);
                setEmail(buyer.email);
                setStatus(buyer.status);
                setPlanName(buyer.subscription?.planName || 'No Plan');
                setExpiresAt(buyer.subscription ? new Date(buyer.subscription.expiresAt).toISOString().split('T')[0] : '');
                setContactsAllowed(buyer.subscription?.contactsAllowed || 0);
                setContactsUsed(buyer.subscription?.contactsUsed || 0);
            } else {
                // Reset for new buyer
                setName('');
                setEmail('');
                setStatus('Active');
                setPlanName('No Plan');
                setExpiresAt('');
                setContactsAllowed(0);
                setContactsUsed(0);
            }
        }
    }, [buyer, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (!name || !email) {
            alert('Name and Email are required.');
            return;
        }

        const buyerData: Omit<Buyer, 'id'> = {
            name,
            email,
            status,
            registrationDate: buyer?.registrationDate || new Date(),
            subscription: planName !== 'No Plan' && expiresAt
                ? { 
                    planName, 
                    expiresAt: new Date(expiresAt),
                    contactsAllowed: contactsAllowed,
                    contactsUsed: contactsUsed,
                  }
                : undefined,
        };

        if (buyer?.id) {
            onSave({ ...buyerData, id: buyer.id });
        } else {
            onSave(buyerData);
        }
    };

    const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPlanName = e.target.value;
        setPlanName(newPlanName);
        if (newPlanName === 'No Plan') {
            setExpiresAt('');
            setContactsAllowed(0);
            setContactsUsed(0);
        } else {
            const plan = mockSubscriptionPlans.find(p => p.name === newPlanName);
            if (plan) {
                setContactsAllowed(plan.contacts);
            }
        }
    };
    
    const formInputStyle = "mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 sm:text-sm";
    const disabledInputStyle = "bg-gray-100 dark:bg-gray-800 cursor-not-allowed";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b dark:border-gray-600">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{buyer ? 'Edit Buyer' : 'Add New Buyer'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} className={formInputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={formInputStyle} required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</label>
                        <select id="status" name="status" value={status} onChange={e => setStatus(e.target.value as 'Active' | 'Inactive')} className={formInputStyle}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="border-t pt-4 space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Subscription Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="planName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subscription Plan</label>
                                <select id="planName" name="planName" value={planName} onChange={handlePlanChange} className={formInputStyle}>
                                    <option value="No Plan">No Plan</option>
                                    {mockSubscriptionPlans.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expires At</label>
                                <input 
                                    type="date" 
                                    name="expiresAt" 
                                    id="expiresAt" 
                                    value={expiresAt} 
                                    onChange={e => setExpiresAt(e.target.value)} 
                                    className={`${formInputStyle} ${planName === 'No Plan' && disabledInputStyle}`}
                                    disabled={planName === 'No Plan'} 
                                />
                            </div>
                            <div>
                                <label htmlFor="contactsAllowed" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contacts Allowed</label>
                                <input type="number" name="contactsAllowed" id="contactsAllowed" value={contactsAllowed} onChange={e => setContactsAllowed(Number(e.target.value))} className={`${formInputStyle} ${planName === 'No Plan' && disabledInputStyle}`} disabled={planName === 'No Plan'} />
                            </div>
                            <div>
                                <label htmlFor="contactsUsed" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contacts Used</label>
                                <input type="number" name="contactsUsed" id="contactsUsed" value={contactsUsed} onChange={e => setContactsUsed(Number(e.target.value))} className={`${formInputStyle} ${planName === 'No Plan' && disabledInputStyle}`} disabled={planName === 'No Plan'} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 border-t bg-gray-50 dark:bg-gray-700/50 mt-auto">
                    <button onClick={onClose} className="bg-white dark:bg-gray-600 py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBuyerModal;