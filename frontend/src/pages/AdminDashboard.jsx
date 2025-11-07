"import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import StatCard from '../components/StatCard';
import toast, { Toaster } from 'react-hot-toast'; // import toast

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, statsRes] = await Promise.all([
        api.get('/admin/posts'),
        api.get('/admin/stats')
      ]);
      setPosts(postsRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Admin actions
  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/posts/${id}/approve`);
      fetchData();
    } catch {
      toast.error('Failed to approve post');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/posts/${id}/reject`);
      fetchData();
    } catch {
      toast.error('Failed to reject post');
    }
  };

  const handleDelete = (id) => {
    toast.custom(
      t => (
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-72 flex flex-col items-center">
          <p className="mb-3 text-center">Are you sure you want to delete this post?</p>
          <div className="flex gap-2">
            <button
              className="bg-red-600 px-3 py-1 rounded text-white"
              onClick={async () => {
                try {
                  await api.delete(`posts/${id}`);
                  fetchData();
                  toast.dismiss(t.id);
                  toast.success('Post deleted successfully', { position: 'top-right' });
                } catch {
                  toast.dismiss(t.id);
                  toast.error('Failed to delete post', { position: 'top-right' });
                }
              }}
            >
              Confirm
            </button>
            <button
              className="bg-gray-600 px-3 py-1 rounded text-white"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'right-center'
      }
    );
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  if (loading) {
    return <div className="text-center py-16">Sent</div>;
  }

  return (
    <div className="space-y-8">
      <Toaster /> 
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard icon={<FileText />} label="Total Posts" value={stats.total} color="blue" />
        <StatCard icon={<Clock />} label="Pending" value={stats.pending} color="yellow" />
        <StatCard icon={<CheckCircle />} label="Approved" value={stats.approved} color="green" />
        <StatCard icon={<XCircle />} label="Rejected" value={stats.rejected} color="red" />
      </div>

      {/* Filters */}
      
     </div>
  );
};

export default AdminDashboard;
"
