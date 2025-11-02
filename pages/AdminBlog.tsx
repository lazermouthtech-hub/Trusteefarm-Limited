import React from 'react';
import { BlogPost, BlogPostStatus } from '../types';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { classNames } from '../lib/utils';

interface AdminBlogProps {
    posts: BlogPost[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onAddNew: () => void;
    onUpdateStatus: (id: string, status: BlogPostStatus) => void;
}

const AdminBlog = ({ posts, onEdit, onDelete, onAddNew, onUpdateStatus }: AdminBlogProps) => {
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Blog Post Management</h1>
            <button
                onClick={onAddNew}
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm"
            >
                <Plus className="mr-2 h-5 w-5"/>
                Create New Post
            </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                    <div className="text-sm text-gray-500">{post.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={classNames(
                                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        post.status === BlogPostStatus.Published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    )}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                                    <button
                                        onClick={() => onUpdateStatus(post.id, post.status === BlogPostStatus.Published ? BlogPostStatus.Draft : BlogPostStatus.Published)}
                                        className={classNames(
                                            'p-2 rounded-full transition-colors',
                                            post.status === BlogPostStatus.Published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        )}
                                        title={post.status === BlogPostStatus.Published ? 'Unpublish' : 'Publish'}
                                    >
                                        {post.status === BlogPostStatus.Published ? <Eye className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                    </button>
                                    <button onClick={() => onEdit(post.id)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md">
                                        <Edit className="h-5 w-5"/>
                                    </button>
                                    <button onClick={() => onDelete(post.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md">
                                        <Trash2 className="h-5 w-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {posts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-lg text-gray-600">No blog posts found.</p>
                        <p className="text-sm text-gray-400 mt-1">Click 'Create New Post' to get started.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AdminBlog;