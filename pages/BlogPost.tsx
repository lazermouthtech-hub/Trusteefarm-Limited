import React from 'react';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface BlogPostProps {
    post: BlogPost;
    onBack: () => void;
}

const BlogPostPage = ({ post, onBack }: BlogPostProps) => {
    // Simple paragraph splitter for demonstration
    const contentParagraphs = post.content.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary-700 font-semibold mb-8 group">
                    <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                </button>
                <article>
                    <header className="mb-8">
                         <p className="text-base font-semibold text-primary-600 uppercase tracking-wide">{post.category}</p>
                        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">{post.title}</h1>
                        <div className="mt-6 flex items-center text-sm text-gray-500">
                             <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>By {post.author}</span>
                            </div>
                            <span className="mx-3">|</span>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Published on {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                    </header>
                    
                    <img src={post.imageUrl} alt={post.title} className="w-full max-h-[500px] object-cover rounded-lg shadow-xl mb-8" />
                    
                    <div className="prose prose-lg max-w-3xl mx-auto text-gray-700">
                        {contentParagraphs.map((p, index) => (
                            <p key={index}>{p}</p>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPostPage;