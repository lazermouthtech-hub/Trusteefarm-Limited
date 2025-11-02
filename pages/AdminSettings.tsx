import React from 'react';
import { SystemSettings, AdminUser, AdminSessionLog } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminUserModal from '../components/settings/AdminUserModal';
import { classNames } from '../lib/utils';

interface AdminSettingsProps {
    settings: SystemSettings;
    onUpdateSettings: (newSettings: SystemSettings) => void;
}

const calculateDuration = (login: Date, logout: Date | null): string => {
    const loginTime = new Date(login);
    if (!logout) {
        const now = new Date();
        const diffMs = now.getTime() - loginTime.getTime();
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} min`;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    }
    const logoutTime = new Date(logout);
    const diffMs = logoutTime.getTime() - loginTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
     if (diffMins < 1) return "< 1 min";
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
}


const AdminSettings = ({ settings, onUpdateSettings }: AdminSettingsProps) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);

    const handleOpenModal = (user: AdminUser | null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (userToSave: AdminUser) => {
        const existingUser = settings.adminUsers.find(u => u.id === userToSave.id);
        let updatedUsers;

        if (existingUser) {
            updatedUsers = settings.adminUsers.map(u => u.id === userToSave.id ? userToSave : u);
        } else {
            updatedUsers = [...settings.adminUsers, userToSave];
        }

        onUpdateSettings({ ...settings, adminUsers: updatedUsers });
        setIsModalOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Are you sure you want to delete this admin user?')) {
            const updatedUsers = settings.adminUsers.filter(u => u.id !== userId);
            onUpdateSettings({ ...settings, adminUsers: updatedUsers });
        }
    };
    
    const sortedLogs = React.useMemo(() => {
        return settings.sessionLogs.slice().sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
    }, [settings.sessionLogs]);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 border border-transparent rounded-md text-sm shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        Add Admin User
                    </button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Privilege</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {settings.adminUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.privilege}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={classNames('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.lastLogin).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => handleOpenModal(user)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md"><Edit className="h-4 w-4"/></button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md"><Trash2 className="h-4 w-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Admin Session Logs</h2>
                    <p className="text-sm text-gray-500">Track admin login and logout activity.</p>
                </div>
                 <div className="overflow-x-auto max-h-96">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Login Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logout Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.userName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.loginTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.logoutTime ? new Date(log.logoutTime).toLocaleString() : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{calculateDuration(log.loginTime, log.logoutTime)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminUserModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={editingUser}
            />
        </div>
    );
};

export default AdminSettings;
