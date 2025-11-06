import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../api/axios';
import OpportunityCard from '../components/OpportunityCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    opportunity: '',
    country: '',
    fundingType: ''
  });

  const [countries, setCountries] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  // Initial fetch for posts, countries, opportunities
  useEffect(() => {
    fetchFiltersData();
    fetchPosts();
  }, []);

  const fetchFiltersData = async () => {
    try {
      // Example APIs: /countries, /opportunities
      const [countryRes, opportunityRes] = await Promise.all([
        api.get('/filters/countries'),
        api.get('/filters/opportunities')
      ]);

      setCountries(countryRes.data.data);
      setOpportunities(opportunityRes.data.data);
    } catch (error) {
      console.error('Failed to fetch filter data:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.opportunity) params.append('opportunity', filters.opportunity);
      if (filters.country) params.append('country', filters.country);
      if (filters.fundingType) params.append('fundingType', filters.fundingType);

      const res = await api.get(`/posts?${params.toString()}`);
      setPosts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Discover Global Opportunities
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Connect with scholarships, internships, and funding opportunities from around the world
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        <div className="grid md:grid-cols-4 gap-4">
         {/* Opportunity Search Box */}
<input
  type="text"
  placeholder="Search Opportunity..."
  value={filters.opportunity}
  onChange={(e) => setFilters({ ...filters, opportunity: e.target.value })}
  className="px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
/>

{/* Country Search Box */}
<input
  type="text"
  placeholder="Search Country..."
  value={filters.country}
  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
  className="px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
/>

{/* Funding Type Dropdown */}
<select
  value={filters.fundingType}
  onChange={(e) => setFilters({ ...filters, fundingType: e.target.value })}
  className="px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
>
  <option value="">All Funding Types</option>
  <option value="Full">Full Funding</option>
  <option value="Partial">Partial Funding</option>
  <option value="None">No Funding</option>
</select>

{/* Explore Button */}
<button
  onClick={fetchPosts}
  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition"
>
  Explore
</button>

        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(post => (
              <OpportunityCard key={post._id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FileText size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">No opportunities found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
