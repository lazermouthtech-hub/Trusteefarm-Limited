import React from 'react';
import { Farmer, Produce } from '../../types';
import { Camera } from 'lucide-react';

interface FarmerProfileFormProps {
    farmer: Farmer;
    onSave: (updatedFarmer: Farmer) => void;
}

const FarmerProfileForm = ({ farmer, onSave }: FarmerProfileFormProps) => {
    const [editedFarmer, setEditedFarmer] = React.useState<Farmer>(farmer);
    const photoInputRef = React.useRef<HTMLInputElement>(null);
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
        setEditedFarmer(farmer);
    }, [farmer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedFarmer(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedFarmer(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedFarmer(prev => ({ ...prev, profilePhoto: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        onSave(editedFarmer);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    };
    
    const formatDateForInput = (date?: Date | string) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    const formInputStyle = "mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm";

    return (
        <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 space-y-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                            <img src={editedFarmer.profilePhoto} alt={editedFarmer.name} className="h-28 w-28 rounded-full object-cover" />
                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100" />
                            </div>
                        </div>
                         <button type="button" onClick={() => photoInputRef.current?.click()} className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-800">
                            Change Photo
                        </button>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" value={editedFarmer.name} onChange={handleInputChange} className={formInputStyle} />
                        </div>
                         <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Region)</label>
                            <input type="text" name="location" id="location" value={editedFarmer.location} onChange={handleInputChange} className={formInputStyle} />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Primary Phone</label>
                            <input type="text" name="phone" id="phone" value={editedFarmer.phone} onChange={handleInputChange} className={formInputStyle} readOnly disabled />
                        </div>
                        <div>
                            <label htmlFor="status-display" className="block text-sm font-medium text-gray-700">Account Status</label>
                            <input type="text" id="status-display" value={editedFarmer.status} readOnly disabled className={`${formInputStyle} bg-gray-200 cursor-not-allowed`} />
                        </div>
                    </div>
                </div>

                {/* Additional Personal Info */}
                <div className="border-t pt-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                            <select name="gender" id="gender" value={editedFarmer.gender || ''} onChange={handleInputChange} className={formInputStyle}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input type="date" name="dateOfBirth" id="dateOfBirth" value={formatDateForInput(editedFarmer.dateOfBirth)} onChange={handleDateChange} className={formInputStyle} />
                        </div>
                         <div>
                            <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700">Preferred Language</label>
                            <input type="text" name="preferredLanguage" id="preferredLanguage" value={editedFarmer.preferredLanguage || ''} onChange={handleInputChange} className={formInputStyle} placeholder="e.g. Twi, English" />
                        </div>
                    </div>
                </div>
                
                {/* Farm & Business Info */}
                <div className="border-t pt-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Farm & Business Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div>
                            <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">Farm Name</label>
                            <input type="text" name="farmName" id="farmName" value={editedFarmer.farmName || ''} onChange={handleInputChange} className={formInputStyle}/>
                        </div>
                        <div>
                            <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">Farm Size (acres)</label>
                            <input type="number" name="farmSize" id="farmSize" value={editedFarmer.farmSize || ''} onChange={handleInputChange} className={formInputStyle} />
                        </div>
                        <div>
                            <label htmlFor="farmingMethods" className="block text-sm font-medium text-gray-700">Farming Methods</label>
                            <select name="farmingMethods" id="farmingMethods" value={editedFarmer.farmingMethods || ''} onChange={handleInputChange} className={formInputStyle}>
                                <option value="">Not Specified</option>
                                <option value="Organic">Organic</option>
                                <option value="Conventional">Conventional</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="mobileMoneyNumber" className="block text-sm font-medium text-gray-700">Mobile Money Number</label>
                            <input type="text" name="mobileMoneyNumber" id="mobileMoneyNumber" value={editedFarmer.mobileMoneyNumber || ''} onChange={handleInputChange} className={formInputStyle}/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" name="email" id="email" value={editedFarmer.email || ''} onChange={handleInputChange} className={formInputStyle}/>
                        </div>
                         <div>
                            <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID (Ghana Card)</label>
                            <input type="text" name="nationalId" id="nationalId" value={editedFarmer.nationalId || ''} onChange={handleInputChange} className={formInputStyle} placeholder="GHA-XXXXXXXXX-X" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center p-4 border-t bg-gray-50 mt-auto">
                 {showSuccess && <p className="text-green-600 font-medium mr-4">Profile updated successfully!</p>}
                <button onClick={handleSaveChanges} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default FarmerProfileForm;