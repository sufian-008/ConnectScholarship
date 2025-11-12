import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import api from '../api/axios';
import OpportunityCard from '../components/OpportunityCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    opportunity: '',
    country: '',
    fundingType: ''
  });

  const [countries, setCountries] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  // Initial fetch for posts and filter data
  useEffect(() => {
    fetchFiltersData();
    fetchPosts(1, true); // first load
  }, []);

  // When filters change and Explore clicked
  const fetchPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.opportunity) params.append('opportunity', filters.opportunity);
      if (filters.country) params.append('country', filters.country);
      if (filters.fundingType) params.append('fundingType', filters.fundingType);
      params.append('page', pageNum);
      params.append('limit', 10);

      const res = await api.get(`/posts?${params.toString()}`);
      const newPosts = res.data.data;

      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      if (newPosts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
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

  const handleExplore = () => {
    setPage(1);
    fetchPosts(1, true);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
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
          <input
            type="text"
            placeholder="Search Opportunity..."
            value={filters.opportunity}
            onChange={(e) => setFilters({ ...filters, opportunity: e.target.value })}
            className="px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />

          <input
            type="text"
            placeholder="Search Country..."
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500"
          />

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

          <button
            onClick={handleExplore}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold text-white transition"
          >
            Explore
          </button>
        </div>
      </div>

      {/* Posts */}
      {loading && posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <OpportunityCard key={post._id} post={post} />
            ))}
          </div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-400">
              <FileText size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">No opportunities found</p>
            </div>
          )}

          {/* Load More */}
          {hasMore && !loading && (
            <div className="flex justify-center py-10">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-md transition-all duration-300"
              >
                Load More
              </button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              🎉 You’ve reached the end of the list
            </div>
          )}

          {loading && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500 animate-pulse">
              Loading more opportunities...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
