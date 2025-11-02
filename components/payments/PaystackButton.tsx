import React from 'react';

// This tells TypeScript that PaystackPop is a global variable
// injected by the script tag in index.html.
declare var PaystackPop: any;

interface PaystackButtonProps {
    publicKey: string;
    email: string;
    amount: number; // Amount in major units (e.g., GHS)
    onSuccess: (response: any) => void;
    onClose: () => void;
    // FIX: Made children optional to resolve a TypeScript error where the compiler
    // incorrectly reports it as missing when passed between component tags.
    children?: React.ReactNode;
    className?: string;
}

const PaystackButton = ({ publicKey, email, amount, onSuccess, onClose, children, className }: PaystackButtonProps) => {
    
    const handlePayment = () => {
        if (!publicKey) {
            alert("Paystack public key is not configured. Please contact support.");
            return;
        }

        const handler = PaystackPop.setup({
            key: publicKey,
            email: email,
            amount: Math.round(amount * 100), // Convert to kobo/pesewas and ensure it's an integer
            currency: 'GHS', // Ghana Cedi
            ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate a random reference
            onClose: () => {
                console.log('Payment popup closed.');
                onClose();
            },
            callback: (response: any) => {
                // response.reference
                console.log('Payment successful:', response);
                onSuccess(response);
            },
        });
        handler.openIframe();
    };

    return (
        <button onClick={handlePayment} className={className}>
            {children}
        </button>
    );
};

export default PaystackButton;
