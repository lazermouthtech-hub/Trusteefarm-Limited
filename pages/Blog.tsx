import React from 'react';
import { BlogPost, BlogPostStatus } from '../types';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface BlogProps {
    posts: BlogPost[];
    onViewPost: (id: string) => void;
}

const Blog = ({ posts, onViewPost }: BlogProps) => {
    const publishedPosts = posts.filter(p => p.status === BlogPostStatus.Published);

    return (
        <div className="bg-gray-50 flex-grow">
            <div className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">From the Field</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Insights, stories, and updates from the heart of Ghanaian agriculture.
                    </p>
                </div>

                {publishedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publishedPosts.map(post => (
                            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-sm font-semibold text-primary-600 uppercase">{post.category}</p>
                                    <h2 className="mt-2 text-2xl font-bold text-gray-800 hover:text-primary-700 transition-colors">
                                        <a href="#" onClick={(e) => { e.preventDefault(); onViewPost(post.id); }}>{post.title}</a>
                                    </h2>
                                    <p className="mt-3 text-gray-600 flex-grow">{post.content.substring(0, 120)}...</p>
                                    <div className="mt-6 border-t pt-4 flex justify-between items-center text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => onViewPost(post.id)} className="mt-4 w-full text-left font-semibold text-primary-600 hover:text-primary-800 flex items-center group">
                                        Read More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-600">No articles have been published yet.</p>
                        <p className="text-gray-400 mt-2">Check back soon for updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;