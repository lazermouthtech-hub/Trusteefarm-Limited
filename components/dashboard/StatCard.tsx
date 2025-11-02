
import React from 'react';
import { LucideProps } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface StatCardProps {
    icon: React.ComponentType<LucideProps>;
    title: string;
    value: string;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
    alert?: boolean;
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
    pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300',
};


const StatCard = ({ icon: Icon, title, value, color, alert }: StatCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center">
            <div className={classNames('w-12 h-12 rounded-full flex items-center justify-center', colorClasses[color])}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                    {value}
                    {alert && <span className="ml-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
