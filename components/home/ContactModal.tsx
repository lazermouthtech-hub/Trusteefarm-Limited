import React from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, email: string, message: string) => void;
}

const ContactModal = ({ isOpen, onClose, onSubmit }: ContactModalProps) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setIsSubmitted(false);
            setName('');
            setEmail('');
            setMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && message) {
            onSubmit(name, email, message);
            setIsSubmitted(true);
        }
    };

    const formInputStyle = "mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                    <X className="h-6 w-6" />
                </button>
                
                <div className="p-8">
                    {isSubmitted ? (
                        <div className="text-center py-10">
                            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                            <h2 className="mt-4 text-2xl font-bold text-gray-800">Message Sent!</h2>
                            <p className="mt-2 text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
                            <button onClick={onClose} className="mt-6 bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700">
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
                            <p className="text-sm text-gray-500">Have a question? We'd love to hear from you.</p>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" required value={name} onChange={e => setName(e.target.value)} className={formInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className={formInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea name="message" id="message" rows={4} required value={message} onChange={e => setMessage(e.target.value)} className={formInputStyle}></textarea>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                                    <Send className="h-5 w-5 mr-2" />
                                    Send Message
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
             <style>{`
              @keyframes scale-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
              .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ContactModal;