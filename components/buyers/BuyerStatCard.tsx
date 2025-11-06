import React from 'react';
import { LucideProps } from 'lucide-react';
import { classNames } from '../../lib/utils';

interface BuyerStatCardProps {
    icon: React.ComponentType<LucideProps>;
    title: string;
    value: number;
    iconColor: string;
}

const BuyerStatCard = ({ icon: Icon, title, value, iconColor }: BuyerStatCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
            <Icon className={classNames('h-8 w-8 mr-4 flex-shrink-0', iconColor)} />
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
};

export default BuyerStatCard;
