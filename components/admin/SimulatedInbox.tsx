import React, { useState, useSyncExternalStore, useEffect } from 'react';
import { Mail, X, Code, Trash2, ChevronDown } from 'lucide-react';
import { emailStore, SimulatedEmail } from '../../lib/emailStore';
import { classNames } from '../../lib/utils';

const EmailItem = ({ email, index }: { email: SimulatedEmail; index: number }) => {
    const [isPayloadVisible, setIsPayloadVisible] = useState(false);
    
    const templateNames: Record<string, string> = {
        'farmer_welcome': 'Farmer Welcome',
        'buyer_welcome': 'Buyer Welcome',
        'subscription_success': 'Subscription Success',
        'farmer_approved': 'Farmer Approved',
        'produce_approved': 'Produce Approved',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{templateNames[email.template] || email.template}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">To: {email.to}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{email.timestamp.toLocaleString()}</div>
                </div>
                <button
                    onClick={() => setIsPayloadVisible(!isPayloadVisible)}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    <Code className="h-4 w-4 mr-1" />
                    Payload
                    <ChevronDown className={classNames("h-4 w-4 ml-1 transition-transform", isPayloadVisible && "rotate-180")} />
                </button>
            </div>
            {isPayloadVisible && (
                <div className="mt-4">
                    <pre className="w-full p-3 font-mono text-xs bg-gray-900 text-green-300 border border-gray-700 rounded-md max-h-64 overflow-auto">
                        <code>{JSON.stringify(email.payload, null, 2)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};


const SimulatedInbox = () => {
    const emails = useSyncExternalStore(emailStore.subscribe, emailStore.getSnapshot);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        if (emails.length > 0) {
            setHasUnread(true);
        }
    }, [emails.length]);

    const handleOpen = () => {
        setIsOpen(true);
        setHasUnread(false);
    };

    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg z-50 transition-transform transform hover:scale-110"
                aria-label="Open Simulated Inbox"
            >
                <Mail className="h-6 w-6" />
                {hasUnread && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />}
            </button>

            {isOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4" onClick={() => setIsOpen(false)}>
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                             <div className="flex items-center">
                                <Mail className="h-6 w-6 mr-3 text-primary-500" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Simulated Email Inbox</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Emails sent this session appear here. This is a simulation.</p>
                                </div>
                             </div>
                             <div className="flex items-center space-x-2">
                                <button
                                     onClick={() => {
                                        if (confirm('Are you sure you want to clear all simulated emails?')) {
                                            emailStore.clearEmails();
                                        }
                                     }}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                     aria-label="Clear Inbox"
                                 >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white" aria-label="Close Inbox">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto">
                            {emails.length > 0 ? (
                                emails.map((email, index) => (
                                    // FIX: Wrapped EmailItem in a div and moved the key to the div to resolve a TypeScript error.
                                    <div key={email.timestamp.getTime() + index}>
                                        <EmailItem email={email} index={index}/>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 text-gray-500">
                                    <p>No emails have been sent yet.</p>
                                    <p className="text-sm mt-1">Trigger an action like registering a user to see emails here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            )}
        </>
    );
};

export default SimulatedInbox;
