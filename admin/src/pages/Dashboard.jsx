import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/posts')
      ]);
      
      setStats(statsRes.data.data);
      setRecentPosts(postsRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
