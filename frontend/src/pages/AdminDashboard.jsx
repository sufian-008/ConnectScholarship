import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import StatCard from '../components/StatCard';
import toast, { Toaster } from 'react-hot-toast'; 

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

   // filter
      <div className="flex gap-4">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f
                ? f === 'pending'
                  ? 'bg-yellow-600'
                  : f === 'approved'
                  ? 'bg-green-600'
                  : f === 'rejected'
                  ? 'bg-red-600'
                  : 'bg-gray-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

     //Post
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          {filter === 'all'
            ? 'All Posts'
            : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Posts`}{" "}
          ({filteredPosts.length})
        </h2>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <FileText size={64} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl">No posts in this category</p>
          </div>
        )}

        {filteredPosts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            showAdminActions
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
