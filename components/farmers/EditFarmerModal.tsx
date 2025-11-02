
import React from 'react';
import { Farmer, FarmerStatus, Produce } from '../../types';
import { X, Camera, Plus, Edit, Trash2 } from 'lucide-react';
import ProduceEditModal from './ProduceEditModal';

interface EditFarmerModalProps {
    isOpen: boolean;
    farmer: Farmer | null;
    onClose: () => void;
    onSave: (updatedFarmer: Farmer) => void;
}

const EditFarmerModal = ({ isOpen, farmer, onClose, onSave }: EditFarmerModalProps) => {
    const [editedFarmer, setEditedFarmer] = React.useState<Farmer | null>(null);
    const photoInputRef = React.useRef<HTMLInputElement>(null);
    const [isProduceModalOpen, setIsProduceModalOpen] = React.useState(false);
    const [selectedProduce, setSelectedProduce] = React.useState<Produce | null>(null);

    React.useEffect(() => {
        if (farmer) {
            // Create a deep copy to avoid mutating the original state directly.
            // The JSON stringify/parse combo converts Date objects to strings. We need to convert them back.
            const tempFarmer = JSON.parse(JSON.stringify(farmer));
            
            const newEditedFarmer: Farmer = {
                ...tempFarmer,
                registrationDate: new Date(tempFarmer.registrationDate),
                dateOfBirth: tempFarmer.dateOfBirth ? new Date(tempFarmer.dateOfBirth) : undefined,
                produces: tempFarmer.produces.map((p: any) => ({
                    ...p,
                    availableFrom: new Date(p.availableFrom),
                    expectedHarvestDate: p.expectedHarvestDate ? new Date(p.expectedHarvestDate) : undefined,
                    dateAdded: new Date(p.dateAdded),
                })),
            };
            
            setEditedFarmer(newEditedFarmer);
        }
    }, [farmer, isOpen]);

    if (!isOpen || !editedFarmer) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedFarmer(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Ensure we store a Date object, not a string
        setEditedFarmer(prev => prev ? { ...prev, [name]: value ? new Date(value) : undefined } : null);
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setEditedFarmer(prev => prev ? { ...prev, [name]: checked } : null);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedFarmer(prev => prev ? { ...prev, profilePhoto: reader.result as string } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (editedFarmer) {
            onSave(editedFarmer);
            onClose();
        }
    };
    
    const formatDateForInput = (date?: Date | string) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    // --- Produce Management Handlers ---
    const handleAddNewProduce = () => {
        setSelectedProduce(null);
        setIsProduceModalOpen(true);
    };

    const handleEditProduce = (produce: Produce) => {
        setSelectedProduce(produce);
        setIsProduceModalOpen(true);
    };
    
    const handleDeleteProduce = (produceId: string) => {
        if (window.confirm('Are you sure you want to delete this produce?')) {
            if (editedFarmer) {
                setEditedFarmer({
                    ...editedFarmer,
                    produces: editedFarmer.produces.filter(p => p.id !== produceId)
                });
            }
        }
    };

    const handleSaveProduce = (produceToSave: Produce) => {
        if (editedFarmer) {
            const existingProduceIndex = editedFarmer.produces.findIndex(p => p.id === produceToSave.id);
            let updatedProduces;

            if (existingProduceIndex > -1) {
                // Update existing produce
                updatedProduces = [...editedFarmer.produces];
                updatedProduces[existingProduceIndex] = produceToSave;
            } else {
                // Add new produce
                updatedProduces = [...editedFarmer.produces, produceToSave];
            }
            setEditedFarmer({ ...editedFarmer, produces: updatedProduces });
        }
        setIsProduceModalOpen(false);
    };

    const formInputStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Enrich Farmer Data: {farmer?.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center justify-center">
                            <input
                                type="file"
                                ref={photoInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
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
                                <input type="text" name="phone" id="phone" value={editedFarmer.phone} onChange={handleInputChange} className={formInputStyle} />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Account Status</label>
                                <select id="status" name="status" value={editedFarmer.status} onChange={handleInputChange} className={formInputStyle}>
                                    {Object.values(FarmerStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Personal Info */}
                    <div className="border-t pt-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                             <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                <select name="gender" id="gender" value={editedFarmer.gender} onChange={handleInputChange} className={formInputStyle}>
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
                                <select name="farmingMethods" id="farmingMethods" value={editedFarmer.farmingMethods} onChange={handleInputChange} className={formInputStyle}>
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
                    
                    {/* Crop & Produce Management */}
                    <div className="border-t pt-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Crop & Produce Management</h3>
                            <button
                                type="button"
                                onClick={handleAddNewProduce}
                                className="inline-flex items-center bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold py-2 px-3 border border-transparent rounded-md text-sm"
                            >
                                <Plus className="mr-2 h-4 w-4"/>
                                Add New Produce
                            </button>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {editedFarmer.produces.length > 0 ? (
                                editedFarmer.produces.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                        <div>
                                            <p className="font-medium text-gray-900">{p.name} ({p.variety})</p>
                                            <p className="text-sm text-gray-500">{p.quantity} {p.unit} - <span className="font-semibold">{p.status}</span></p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button type="button" onClick={() => handleEditProduce(p)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => handleDeleteProduce(p.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-md border">
                                    <p className="text-gray-500">No produce has been added for this farmer yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                     {/* Verification Checks */}
                    <div className="border-t pt-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Checks</h3>
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <input id="phoneVerified" name="phoneVerified" type="checkbox" checked={editedFarmer.phoneVerified} onChange={handleCheckboxChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label htmlFor="phoneVerified" className="ml-2 block text-sm text-gray-900">Phone Verified</label>
                            </div>
                            <div className="flex items-center">
                                <input id="identityVerified" name="identityVerified" type="checkbox" checked={editedFarmer.identityVerified} onChange={handleCheckboxChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label htmlFor="identityVerified" className="ml-2 block text-sm text-gray-900">Identity Verified</label>
                            </div>
                            <div className="flex items-center">
                                <input id="bankAccountVerified" name="bankAccountVerified" type="checkbox" checked={editedFarmer.bankAccountVerified} onChange={handleCheckboxChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label htmlFor="bankAccountVerified" className="ml-2 block text-sm text-gray-900">Bank Account Verified</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 border-t bg-gray-50 mt-auto">
                    <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSaveChanges} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        Save Changes
                    </button>
                </div>
            </div>
            <ProduceEditModal
                isOpen={isProduceModalOpen}
                produce={selectedProduce}
                onClose={() => setIsProduceModalOpen(false)}
                onSave={handleSaveProduce}
            />
        </div>
    );
};

export default EditFarmerModal;