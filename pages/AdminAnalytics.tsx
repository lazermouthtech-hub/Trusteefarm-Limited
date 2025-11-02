
import React from 'react';
import { Farmer, FarmerStatus, ProduceCategory, GradingBadge } from '../types';
import { calculateFarmerGrade } from '../lib/utils';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, MapPin, CheckSquare, Star, Sprout, TrendingUp, Percent, Tractor, Venus, Mars } from 'lucide-react';

interface AdminAnalyticsProps {
  farmers: Farmer[];
  theme: 'light' | 'dark';
}

const COLORS = ['#16a34a', '#4ade80', '#f97316', '#facc15', '#3b82f6', '#8b5cf6'];

const AnalyticsCard = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children?: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center">
      <Icon className="mr-3 h-5 w-5 text-primary-600" />
      {title}
    </h3>
    <div className="mt-4">{children}</div>
  </div>
);

const StatDisplay = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) => (
    <div className="text-center">
        <Icon className="h-8 w-8 mx-auto text-primary-500 mb-2" />
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);

const AdminAnalytics = ({ farmers, theme }: AdminAnalyticsProps) => {

  const analyticsData = React.useMemo(() => {
    // 1. Farmer Registration Over Time
    const registrationsByMonth = farmers.reduce((acc, farmer) => {
      const month = new Date(farmer.registrationDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const registrationTrend = Object.entries(registrationsByMonth)
        .map(([name, count]) => ({ name, count }))
        .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // 2. Geographical Distribution
    const byRegion = farmers.reduce((acc, f) => ({ ...acc, [f.location]: (acc[f.location] || 0) + 1 }), {} as Record<string, number>);
    const geoData = Object.entries(byRegion).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count);

    // 3. Farmer Status
    const byStatus = farmers.reduce((acc, f) => ({ ...acc, [f.status]: (acc[f.status] || 0) + 1 }), {} as Record<FarmerStatus, number>);
    const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));
    
    // 4. Farmer Grade Distribution
    const byGrade = farmers.reduce((acc, f) => {
        const grade = calculateFarmerGrade(f).badge;
        return { ...acc, [grade]: (acc[grade] || 0) + 1};
    }, {} as Record<GradingBadge, number>);
    const gradeData = Object.values(GradingBadge).map(grade => ({ name: grade, count: byGrade[grade] || 0 }));
    
    // 5. Verification Status
    const verificationCounts = farmers.reduce((acc, f) => {
        if(f.phoneVerified) acc.phone++;
        if(f.identityVerified) acc.identity++;
        if(f.bankAccountVerified) acc.bank++;
        return acc;
    }, { phone: 0, identity: 0, bank: 0 });
    
    // 6. Profile Completeness
    const avgCompleteness = farmers.length > 0 ? farmers.reduce((sum, f) => sum + f.profileCompleteness, 0) / farmers.length : 0;
    
    // 7. Produce Category Popularity
    const byCategory = farmers.flatMap(f => f.produces).reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {} as Record<ProduceCategory, number>);
    const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
    
    // 8. Farming Method
    const byMethod = farmers.reduce((acc, f) => {
        if (f.farmingMethods) acc[f.farmingMethods] = (acc[f.farmingMethods] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const methodData = Object.entries(byMethod).map(([name, value]) => ({ name, value }));

    // 9. Average Farm Size
    const totalFarmSize = farmers.reduce((sum, f) => sum + (f.farmSize || 0), 0);
    const farmersWithFarmSize = farmers.filter(f => f.farmSize).length;
    const avgFarmSize = farmersWithFarmSize > 0 ? totalFarmSize / farmersWithFarmSize : 0;
    
    // 10. Gender Distribution
    const byGender = farmers.reduce((acc, f) => {
        if (f.gender) acc[f.gender] = (acc[f.gender] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const genderData = Object.entries(byGender).map(([name, value]) => ({ name, value }));

    return { registrationTrend, geoData, statusData, gradeData, verificationCounts, avgCompleteness, categoryData, methodData, avgFarmSize, genderData };
  }, [farmers]);

  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipBackgroundColor = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorderColor = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipStyle = { backgroundColor: tooltipBackgroundColor, border: `1px solid ${tooltipBorderColor}`, color: textColor };
  const legendStyle = { color: textColor };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-4">
          <AnalyticsCard title="Farmer Registrations Over Time" icon={TrendingUp}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: textColor }} />
                  <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={legendStyle} />
                  <Line type="monotone" dataKey="count" name="New Farmers" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AnalyticsCard>
      </div>

      <div className="lg:col-span-2">
        <AnalyticsCard title="Geographical Distribution" icon={MapPin}>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.geoData} layout="vertical" margin={{ left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis type="number" allowDecimals={false} tick={{ fill: textColor }} />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fill: textColor }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" name="Farmers" fill="#15803d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </AnalyticsCard>
      </div>

      <AnalyticsCard title="Farmer Status" icon={Users}>
         <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={analyticsData.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: textColor }}>
                       {analyticsData.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={legendStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </AnalyticsCard>
      
      <AnalyticsCard title="Produce Category Popularity" icon={Sprout}>
         <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={analyticsData.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} label={{ fill: textColor }}>
                       {analyticsData.categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={legendStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <div className="lg:col-span-2">
         <AnalyticsCard title="Farmer Grade Distribution" icon={Star}>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.gradeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor}/>
                        <XAxis dataKey="name" tick={{ fill: textColor }} />
                        <YAxis allowDecimals={false} tick={{ fill: textColor }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" name="Farmers" fill="#4ade80" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </AnalyticsCard>
      </div>
      
      <div className="lg:col-span-2">
         <AnalyticsCard title="Key Metrics" icon={Percent}>
            <div className="h-80 grid grid-cols-2 gap-4 content-around">
                <StatDisplay label="Avg. Profile Completeness" value={`${(analyticsData.avgCompleteness * 100).toFixed(0)}%`} icon={CheckSquare} />
                <StatDisplay label="Avg. Farm Size (Acres)" value={analyticsData.avgFarmSize.toFixed(1)} icon={Tractor} />
                <StatDisplay label="Phone Verified" value={`${(farmers.length > 0 ? (analyticsData.verificationCounts.phone / farmers.length) * 100 : 0).toFixed(0)}%`} icon={Mars} />
                <StatDisplay label="Identity Verified" value={`${(farmers.length > 0 ? (analyticsData.verificationCounts.identity / farmers.length) * 100 : 0).toFixed(0)}%`} icon={Venus} />
            </div>
         </AnalyticsCard>
      </div>
      
       <AnalyticsCard title="Farming Method" icon={Tractor}>
         <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={analyticsData.methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: textColor }}>
                       {analyticsData.methodData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS.slice(2)[index % COLORS.slice(2).length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={legendStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </AnalyticsCard>
      
       <AnalyticsCard title="Gender Distribution" icon={Users}>
         <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={analyticsData.genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={{ fill: textColor }}>
                       {analyticsData.genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS.slice(3)[index % COLORS.slice(3).length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={legendStyle} />
                </PieChart>
            </ResponsiveContainer>
        </div>
      </AnalyticsCard>

    </div>
  );
};

export default AdminAnalytics;
