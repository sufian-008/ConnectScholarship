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
  // Mock data for charts
  const activityData = [
    { name: 'Mon', posts: 12 },
    { name: 'Tue', posts: 19 },
    { name: 'Wed', posts: 8 },
    { name: 'Thu', posts: 15 },
    { name: 'Fri', posts: 22 },
    { name: 'Sat', posts: 10 },
    { name: 'Sun', posts: 14 },
  ];

  const statusData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ];

  if (loading) {
    return <div className="text-white text-center py-16">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Monitor your platform's performance and activity</p>
      </div>
{/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={FileText} 
          label="Total Posts" 
          value={stats.total} 
          change={12} 
          trend="up"
          color="purple" 
        />
        <StatCard 
          icon={Clock} 
          label="Pending Review" 
          value={stats.pending} 
          change={8} 
          trend="up"
          color="yellow" 
        />
        <StatCard 
          icon={CheckCircle} 
          label="Approved" 
          value={stats.approved} 
          change={15} 
          trend="up"
          color="green" 
        />
        <StatCard 
          icon={XCircle} 
          label="Rejected" 
          value={stats.rejected} 
          change={3} 
          trend="down"
          color="red" 
        />
      </div>


