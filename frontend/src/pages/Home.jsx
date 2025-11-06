import React, { useState, useEffect } from 'react';
import api from '../api/axios';

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

  useEffect(() => {
    fetchFiltersData();
    fetchPosts();
  }, []);

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
    <div>
      API logic added
    </div>
  );
};

export default Home;
