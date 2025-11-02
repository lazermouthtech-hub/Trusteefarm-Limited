import React from 'react';
import { BlogPost, BlogPostStatus } from '../types';
import { Save, X } from 'lucide-react';

interface AdminBlogPostEditorProps {
    post?: BlogPost;
    onSave: (post: BlogPost) => void;
    onCancel: () => void;
}

const AdminBlogPostEditor = ({ post, onSave, onCancel }: AdminBlogPostEditorProps) => {
    const [editedPost, setEditedPost] = React.useState<BlogPost>(
        post || {
            id: '',
            title: '',
            content: '',
            author: 'Admin Team',
            category: '',
            imageUrl: '',
            status: BlogPostStatus.Draft,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedPost(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedPost);
    };
    
    const formInputStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Title and Content */}
                    <div className="md:col-span-2 space-y-4">
                         <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                            <input type="text" name="title" id="title" value={editedPost.title} onChange={handleInputChange} className={formInputStyle} required />
                        </div>
                         <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                            <textarea name="content" id="content" value={editedPost.content} onChange={handleInputChange} rows={12} className={formInputStyle} required />
                        </div>
                    </div>

                    {/* Right Column: Meta, Status, and Actions */}
                    <div className="md:col-span-1 flex flex-col">
                        <div className="space-y-4 flex-grow">
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                                <input type="text" name="author" id="author" value={editedPost.author} onChange={handleInputChange} className={formInputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" name="category" id="category" value={editedPost.category} onChange={handleInputChange} className={formInputStyle} required />
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Featured Image URL</label>
                                <input type="url" name="imageUrl" id="imageUrl" value={editedPost.imageUrl} onChange={handleInputChange} className={formInputStyle} required />
                                {editedPost.imageUrl && <img src={editedPost.imageUrl} alt="Preview" className="mt-2 rounded-md shadow-sm max-h-32 w-full object-cover"/>}
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status" name="status" value={editedPost.status} onChange={handleInputChange} className={formInputStyle}>
                                    {Object.values(BlogPostStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 flex justify-end items-center space-x-2">
                            <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center">
                                <X className="h-4 w-4 mr-1"/> Cancel
                            </button>
                            <button type="submit" className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                                <Save className="h-4 w-4 mr-1"/> Save Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AdminBlogPostEditor;