import React from 'react';
import { Produce, ProduceCategory, ProduceStatus } from '../../types';
import { X, Trash2, Image } from 'lucide-react';

interface ProduceEditModalProps {
    isOpen: boolean;
    produce: Produce | null; // null for creating new
    onClose: () => void;
    onSave: (updatedProduce: Produce) => void;
}

const newProduceTemplate: Omit<Produce, 'id' | 'dateAdded' > = {
    name: '',
    variety: '',
    category: ProduceCategory.Vegetables,
    status: ProduceStatus.PendingApproval, // Default to Pending Approval
    quantity: 0,
    unit: 'kg',
    availableFrom: new Date(),
    expectedHarvestDate: undefined,
    photos: [],
    isOrganic: false,
};


const ProduceEditModal = ({ isOpen, produce, onClose, onSave }: ProduceEditModalProps) => {
    const [editedProduce, setEditedProduce] = React.useState<Produce | Omit<Produce, 'id' | 'dateAdded'>>(produce || newProduceTemplate);
    const producePhotoInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            // FIX: Ensure dates are proper Date objects when editing
            if (produce) {
                setEditedProduce({
                    ...produce,
                    availableFrom: new Date(produce.availableFrom),
                    expectedHarvestDate: produce.expectedHarvestDate ? new Date(produce.expectedHarvestDate) : undefined,
                });
            } else {
                setEditedProduce(newProduceTemplate);
            }
        }
    }, [produce, isOpen]);
    
    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let finalValue: string | number | boolean | Date | undefined = value;
        
        if (type === 'number') {
            finalValue = value === '' ? 0 : Number(value);
        }
        if (type === 'checkbox') {
             finalValue = (e.target as HTMLInputElement).checked;
        }
        if (type === 'date') {
            finalValue = value ? new Date(value) : undefined;
        }
        
        setEditedProduce(prev => ({ ...prev, [name]: finalValue }));
    };
    
    const handleProducePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotoUrl = reader.result as string;
                if (!editedProduce.photos.includes(newPhotoUrl)) {
                    setEditedProduce(prev => ({ ...prev, photos: [...prev.photos, newPhotoUrl] }));
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemovePhoto = (urlToRemove: string) => {
        setEditedProduce(prev => ({ ...prev, photos: prev.photos.filter(url => url !== urlToRemove) }));
    }

    const handleSave = () => {
        const produceToSave: Produce = {
            id: (editedProduce as Produce).id || `prod_${new Date().getTime()}`,
            dateAdded: (editedProduce as Produce).dateAdded || new Date(),
            ...editedProduce,
        } as Produce;
        onSave(produceToSave);
        onClose();
    };
    
    const formatDateForInput = (date?: Date | string) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    const formInputStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{produce ? 'Edit Produce' : 'Add New Produce'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Produce Name</label>
                            <input type="text" name="name" id="name" value={editedProduce.name} onChange={handleInputChange} className={formInputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="variety" className="block text-sm font-medium text-gray-700">Variety</label>
                            <input type="text" name="variety" id="variety" value={editedProduce.variety} onChange={handleInputChange} className={formInputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="category" id="category" value={editedProduce.category} onChange={handleInputChange} className={formInputStyle}>
                                {Object.values(ProduceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" id="status" value={editedProduce.status} onChange={handleInputChange} className={formInputStyle}>
                                {Object.values(ProduceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" name="quantity" id="quantity" value={editedProduce.quantity} onChange={handleInputChange} className={formInputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                            <select name="unit" id="unit" value={editedProduce.unit} onChange={handleInputChange} className={formInputStyle}>
                                <option value="kg">kg</option>
                                <option value="ton">ton</option>
                                <option value="bags">bags</option>
                                <option value="crates">crates</option>
                                <option value="pieces">pieces</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700">Available From</label>
                            <input type="date" name="availableFrom" id="availableFrom" value={formatDateForInput(editedProduce.availableFrom)} onChange={handleInputChange} className={formInputStyle} required />
                        </div>
                        <div>
                            <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700">Expected Harvest Date</label>
                            <input type="date" name="expectedHarvestDate" id="expectedHarvestDate" value={formatDateForInput(editedProduce.expectedHarvestDate)} onChange={handleInputChange} className={formInputStyle} />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <input id="isOrganic" name="isOrganic" type="checkbox" checked={editedProduce.isOrganic} onChange={handleInputChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label htmlFor="isOrganic" className="ml-2 block text-sm text-gray-900">This produce is organic</label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Photos</label>
                        <input type="file" ref={producePhotoInputRef} className="hidden" accept="image/*" onChange={handleProducePhotoUpload} />
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {editedProduce.photos.map((photo, index) => (
                                <div key={index} className="relative group">
                                    <img src={photo} alt={`Produce photo ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                                    <button type="button" onClick={() => handleRemovePhoto(photo)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            {editedProduce.photos.length < 4 && (
                                <button type="button" onClick={() => producePhotoInputRef.current?.click()} className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-600">
                                    <Image className="h-8 w-8" />
                                    <span className="text-xs mt-1">Add Photo</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center p-4 border-t bg-gray-50 mt-auto">
                    <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Save Produce</button>
                </div>
            </div>
        </div>
    );
};

export default ProduceEditModal;
