
import React from 'react';
import { AdminUser } from '../../types';
import { X, Save } from 'lucide-react';

interface AdminUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: AdminUser) => void;
    user: AdminUser | null; // null for creating a new user
}

const AdminUserModal = ({ isOpen, onClose, onSave, user }: AdminUserModalProps) => {
    const [editedUser, setEditedUser] = React.useState<Partial<AdminUser>>({});
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    React.useEffect(() => {
        if (isOpen) {
            setEditedUser(user || {
                name: '',
                email: '',
                privilege: 'Content Editor',
                status: 'Active',
            });
            setPassword('');
            setConfirmPassword('');
        }
    }, [user, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        // Simple validation
        if (!editedUser.name || !editedUser.email) {
            alert('Name and email are required.');
            return;
        }
        if (!user && !password) { // new user requires password
            alert('Password is required for new users.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const userToSave: AdminUser = {
            id: user?.id || `admin_${Date.now()}`,
            name: editedUser.name!,
            email: editedUser.email!,
            privilege: editedUser.privilege || 'Content Editor',
            status: editedUser.status || 'Active',
            lastLogin: user?.lastLogin || new Date(), // Keep existing or set new
            // Only update password if a new one is provided
            password: password ? password : user?.password,
        };

        onSave(userToSave);
    };

    const formInputStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800">{user ? 'Edit Admin User' : 'Add New Admin User'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" value={editedUser.name || ''} onChange={handleInputChange} className={formInputStyle} required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" value={editedUser.email || ''} onChange={handleInputChange} className={formInputStyle} required />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">{user ? 'New Password' : 'Password'}</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required={!user} 
                            className={formInputStyle} 
                            placeholder={user ? "Leave blank to keep current password" : "Set initial password"} 
                            value={password} onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm {user ? 'New' : ''} Password</label>
                        <input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            required={!user || password.length > 0} 
                            className={formInputStyle} 
                            placeholder="Re-enter password" 
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                         <div>
                            <label htmlFor="privilege" className="block text-sm font-medium text-gray-700">Privilege Level</label>
                            <select name="privilege" id="privilege" value={editedUser.privilege || ''} onChange={handleInputChange} className={formInputStyle}>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Moderator">Moderator</option>
                                <option value="Content Editor">Content Editor</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Account Status</label>
                            <select name="status" id="status" value={editedUser.status || ''} onChange={handleInputChange} className={formInputStyle}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center p-4 border-t bg-gray-50">
                    <button onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleSaveChanges} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUserModal;