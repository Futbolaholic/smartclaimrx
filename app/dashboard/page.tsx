'use client';

import { useEffect, useState } from 'react';
import { DashboardStats, Claim } from '../types';
import ClaimsTable from '../components/claims/ClaimsTable';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentClaims, setRecentClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Import mock data
        const statsData = (await import('../data/dashboard-stats.json')).default as DashboardStats;
        const claimsData = (await import('../data/claims.json')).default as Claim[];
        
        setStats(statsData);
        setRecentClaims(claimsData.slice(0, 5)); // Show only 5 most recent claims
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">SmartClaimRx Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">SmartClaimRx Dashboard</h1>
      
      {stats && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Total Claims" 
              value={stats.totalClaims.toString()} 
              color="bg-blue-50" 
              textColor="text-blue-700" 
            />
            <StatCard 
              title="Pending Claims" 
              value={stats.pendingClaims.toString()} 
              color="bg-yellow-50" 
              textColor="text-yellow-700" 
            />
            <StatCard 
              title="Denied Claims" 
              value={stats.deniedClaims.toString()} 
              color="bg-red-50" 
              textColor="text-red-700" 
            />
            <StatCard 
              title="Appealing Claims" 
              value={stats.appealingClaims.toString()} 
              color="bg-purple-50" 
              textColor="text-purple-700" 
            />
          </div>
          
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard 
              title="Approval Rate" 
              value={`${(stats.approvalRate * 100).toFixed(1)}%`} 
              color="bg-green-50" 
              textColor="text-green-700" 
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${stats.totalRevenue.toFixed(2)}`} 
              color="bg-green-50" 
              textColor="text-green-700" 
            />
            <StatCard 
              title="Potential Loss" 
              value={`$${stats.potentialLoss.toFixed(2)}`} 
              color="bg-red-50" 
              textColor="text-red-700" 
            />
          </div>
        </>
      )}
      
      {/* Recent Claims */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Recent Claims</h2>
        <a href="/claims" className="text-blue-600 hover:text-blue-900 text-sm font-medium">
          View All Claims
        </a>
      </div>
      
      <ClaimsTable claims={recentClaims} />
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color, textColor }: { 
  title: string; 
  value: string; 
  color: string; 
  textColor: string;
}) {
  return (
    <div className={`${color} rounded-lg shadow p-6`}>
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
