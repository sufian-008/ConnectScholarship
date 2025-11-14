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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="posts" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={20} />
            Post Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <div key={post._id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <div className="flex-1">
                <h4 className="text-white font-medium">{post.opportunity}</h4>
                <p className="text-sm text-gray-400">
                  {post.country} • {post.fundingType} Funding • by {post.authorName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                post.status === 'pending' 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : post.status === 'approved'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {post.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
