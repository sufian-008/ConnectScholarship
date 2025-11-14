import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [activityData, setActivityData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // FETCH ALL DASHBOARD DATA
  const fetchData = async () => {
    try {
      const [statsRes, postsRes, activityRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/posts'),
        api.get('/admin/activity')
      ]);

      // Stats
      setStats(statsRes.data.data);

      // Recent posts
      setRecentPosts(postsRes.data.data.slice(0, 5));

      // Line chart data (last 7 days)
      setActivityData(
        activityRes.data.data.map(item => ({
          name: item.date,
          posts: item.count
        }))
      );

      // Bar chart (based on stats)
      setStatusData([
        { name: 'Approved', value: statsRes.data.data.approved },
        { name: 'Pending', value: statsRes.data.data.pending },
        { name: 'Rejected', value: statsRes.data.data.rejected }
      ]);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-16">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Total Posts" value={stats.total} />
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Last 7 Days Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="posts" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-900 p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} /> Post Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Posts */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>

        {recentPosts.map(post => (
          <div key={post._id} className="p-4 bg-gray-800 rounded-lg mb-2">
            <h4 className="text-white font-medium">{post.opportunity}</h4>
            <p className="text-sm text-gray-400">
              {post.country} • {post.fundingType}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default Dashboard;
