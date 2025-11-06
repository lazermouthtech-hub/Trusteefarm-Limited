import React, { useState, useEffect } from 'react';
import { BuyerRequest } from '../../types';
import { X, Send, CheckCircle } from 'lucide-react';
import { farmProduces } from '../../data/mockData';

interface RequestFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (requestData: Omit<BuyerRequest, 'id' | 'buyerId' | 'buyerName' | 'status' | 'dateSubmitted'>) => void;
}

const RequestFormModal = ({ isOpen, onClose, onSubmit }: RequestFormModalProps) => {
    const [produceName, setProduceName] = useState('');
    const [otherProduceName, setOtherProduceName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<'kg' | 'ton' | 'bags' | 'crates' | 'pieces'>('kg');
    const [processing, setProcessing] = useState<'Raw' | 'Dried' | 'Any'>('Raw');
    const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Any'>('Any');
    const [specifications, setSpecifications] = useState('');
    const [requestType, setRequestType] = useState<'Local' | 'Export'>('Local');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [requiredByDate, setRequiredByDate] = useState('');
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form on open
            setProduceName(farmProduces[0]);
            setOtherProduceName('');
            setQuantity('');
            setUnit('kg');
            setProcessing('Raw');
            setGrade('Any');
            setSpecifications('');
            setRequestType('Local');
            setDestinationCountry('');
            setRequiredByDate('');
            setIsSubmitted(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalProduceName = produceName === 'Other' ? otherProduceName : produceName;

        const requestData = {
            produceName: finalProduceName,
            quantity: Number(quantity),
            unit,
            processing,
            grade,
            specifications,
            requestType,
            destinationCountry: requestType === 'Export' ? destinationCountry : undefined,
            requiredByDate: new Date(requiredByDate),
        };
        
        onSubmit(requestData);
        setIsSubmitted(true);
    };

    const formInputStyle = "mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b dark:border-gray-600">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Create Produce Request</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    {isSubmitted ? (
                        <div className="text-center py-10">
                            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Request Submitted!</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Your request has been sent. You can track its status on this page.</p>
                            <div className="mt-6 flex justify-center space-x-4">
                               <button onClick={onClose} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700">
                                    Done
                                </button>
                                <button onClick={() => setIsSubmitted(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
                                    Create Another Request
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="produceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Produce Name</label>
                                <select id="produceName" value={produceName} onChange={e => setProduceName(e.target.value)} className={formInputStyle} required>
                                    <option value="" disabled>Select a produce...</option>
                                    {farmProduces.map(p => <option key={p} value={p}>{p}</option>)}
                                    <option value="Other">Other (Please specify)</option>
                                </select>
                            </div>
                            
                            {produceName === 'Other' && (
                                <div>
                                    <label htmlFor="otherProduceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Specify Produce</label>
                                    <input type="text" id="otherProduceName" value={otherProduceName} onChange={e => setOtherProduceName(e.target.value)} className={formInputStyle} required placeholder="e.g., Tiger Nuts" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                                    <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className={formInputStyle} required min="1" placeholder="e.g., 100" />
                                </div>
                                <div>
                                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit</label>
                                    <select id="unit" value={unit} onChange={e => setUnit(e.target.value as any)} className={formInputStyle}>
                                        <option value="kg">kg</option>
                                        <option value="ton">ton</option>
                                        <option value="bags">bags</option>
                                        <option value="crates">crates</option>
                                        <option value="pieces">pieces</option>
                                    </select>
                                </div>
                            </div>
                            
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Processing</label>
                                    <select id="processing" value={processing} onChange={e => setProcessing(e.target.value as any)} className={formInputStyle}>
                                        <option value="Raw">Raw</option>
                                        <option value="Dried">Dried</option>
                                        <option value="Any">Any</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Grade</label>
                                    <select id="grade" value={grade} onChange={e => setGrade(e.target.value as any)} className={formInputStyle}>
                                        <option value="Any">Any Grade</option>
                                        <option value="Grade A">Grade A (Premium)</option>
                                        <option value="Grade B">Grade B (Standard)</option>
                                        <option value="Grade C">Grade C (Basic)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Specifications (Optional)</label>
                                <textarea id="specifications" value={specifications} onChange={e => setSpecifications(e.target.value)} className={formInputStyle} rows={2} placeholder="e.g., Specific size, packaging requirements, moisture content..."></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Request Type</label>
                                <div className="mt-2 flex space-x-4">
                                    <label className="flex items-center">
                                        <input type="radio" name="requestType" value="Local" checked={requestType === 'Local'} onChange={() => setRequestType('Local')} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Local</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" name="requestType" value="Export" checked={requestType === 'Export'} onChange={() => setRequestType('Export')} className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Export</span>
                                    </label>
                                </div>
                            </div>

                            {requestType === 'Export' && (
                                <div>
                                    <label htmlFor="destinationCountry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination Country</label>
                                    <input type="text" id="destinationCountry" value={destinationCountry} onChange={e => setDestinationCountry(e.target.value)} className={formInputStyle} required placeholder="e.g., Nigeria" />
                                </div>
                            )}

                             <div>
                                <label htmlFor="requiredByDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required By Date</label>
                                <input type="date" id="requiredByDate" value={requiredByDate} onChange={e => setRequiredByDate(e.target.value)} className={formInputStyle} required min={new Date().toISOString().split('T')[0]} />
                            </div>
                        </form>
                    )}
                </div>

                {!isSubmitted && (
                    <div className="flex justify-end items-center p-4 border-t bg-gray-50 dark:bg-gray-700/50 mt-auto">
                        <button onClick={onClose} className="bg-white dark:bg-gray-600 py-2 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" form="request-form" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                            <Send className="h-4 w-4 mr-2" />
                            Submit Request
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestFormModal;