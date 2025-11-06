// Commit 2: Add state variables and imports
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

  return (
    <div>
      Home Component with state
    </div>
  );
};

export default Home;
