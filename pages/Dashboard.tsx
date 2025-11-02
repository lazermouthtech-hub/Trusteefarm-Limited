
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, CheckCircle, Clock, ShoppingBag, MapPin, BarChart2, Star, Leaf } from 'lucide-react';
import { Farmer, FarmerStatus, ProduceCategory } from '../types';
import { calculateFarmerGrade } from '../lib/utils';
import StatCard from '../components/dashboard/StatCard';

interface DashboardProps {
    farmers: Farmer[];
    theme: 'light' | 'dark';
}

const Dashboard = ({ farmers, theme }: DashboardProps) => {
    const totalFarmers = farmers.length;
    const approvedFarmers = farmers.filter(f => f.status === FarmerStatus.Active).length;
    const pendingApproval = farmers.filter(f => f.status === FarmerStatus.PendingReview).length;
    const totalProduces = farmers.reduce((sum, f) => sum + f.produces.length, 0);
    const avgGrade = totalFarmers > 0 ? farmers.reduce((sum, f) => sum + calculateFarmerGrade(f).score, 0) / totalFarmers : 0;

    const farmersByRegion = farmers.reduce((acc, farmer) => {
        acc[farmer.location] = (acc[farmer.location] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const regionData = Object.entries(farmersByRegion).map(([name, value]) => ({ name, farmers: value }));

    const produceByCategory = farmers
        .flatMap(f => f.produces)
        .reduce((acc, produce) => {
            acc[produce.category] = (acc[produce.category] || 0) + 1;
            return acc;
        }, {} as Record<ProduceCategory, number>);
        
    const topCrops = farmers
        .flatMap(f => f.produces)
        .reduce((acc, produce) => {
            acc[produce.name] = (acc[produce.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const topCropsData = Object.entries(topCrops)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const categoryData = Object.entries(produceByCategory).map(([name, value]) => ({ name, value }));
    const COLORS = ['#16a34a', '#4ade80', '#f97316', '#facc15', '#3b82f6'];

    const isDarkMode = theme === 'dark';
    const textColor = isDarkMode ? '#9CA3AF' : '#6B7280';
    const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
    const tooltipBackgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
    const tooltipBorderColor = isDarkMode ? '#374151' : '#E5E7EB';

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={Users} title="Total Farmers" value={totalFarmers.toString()} color="blue" />
                <StatCard icon={CheckCircle} title="Approved Farmers" value={approvedFarmers.toString()} color="green" />
                <StatCard icon={Clock} title="Pending Approval" value={pendingApproval.toString()} color="yellow" alert={pendingApproval > 50} />
                <StatCard icon={ShoppingBag} title="Total Produces" value={totalProduces.toString()} color="purple" />
                <StatCard icon={Star} title="Avg. Grade Score" value={avgGrade.toFixed(1)} color="pink" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary-600" /> Farmers by Region</h3>
                    <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={regionData} margin={{ left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis dataKey="name" tick={{ fill: textColor }} />
                                <YAxis tick={{ fill: textColor }} />
                                <Tooltip cursor={{fill: 'rgba(22, 163, 74, 0.1)'}} contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}`, color: textColor }} />
                                <Legend wrapperStyle={{ color: textColor }} />
                                <Bar dataKey="farmers" fill="#16a34a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary-600" /> Produces by Category</h3>
                    <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}` }} />
                                <Legend wrapperStyle={{ color: textColor }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                    <Leaf className="mr-2 h-5 w-5 text-primary-600" /> Top Crop Types by Listings
                </h3>
                <div className="mt-4 h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topCropsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis type="number" allowDecimals={false} tick={{ fill: textColor }} />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fill: textColor }} />
                            <Tooltip cursor={{fill: 'rgba(22, 163, 74, 0.1)'}} contentStyle={{ backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}`, color: textColor }} />
                            <Legend wrapperStyle={{ color: textColor }} />
                            <Bar dataKey="count" fill="#15803d" name="Number of Listings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
