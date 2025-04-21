'use client';

import { useEffect, useState } from 'react';
import { Claim } from '../types';
import ClaimsTable from '../components/claims/ClaimsTable';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const fetchClaims = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Import mock data
        const claimsData = (await import('../data/claims.json')).default as Claim[];
        setClaims(claimsData);
      } catch (error) {
        console.error('Error loading claims:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClaims();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Claims Management</h1>
        <a
          href="/claims/submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit New Claim
        </a>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Loading claims data...</p>
        </div>
      ) : (
        <ClaimsTable claims={claims} />
      )}
    </div>
  );
}
