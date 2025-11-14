import React, { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import api from '../api/axios';
import PostTable from '../components/PostTable';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [filter, searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/admin/posts');
      setPosts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (filter !== 'all') {
      filtered = filtered.filter(post => post.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.opportunity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/posts/${id}/approve`);
      fetchPosts();
    } catch (error) {
      alert('Failed to approve post');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/posts/${id}/reject`);
      fetchPosts();
    } catch (error) {
      alert('Failed to reject post');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await api.delete(`/admin/posts/${id}`);
      fetchPosts();
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  if (loading) {
    return <div className="text-white text-center py-16">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Posts Management</h1>
          <p className="text-gray-400">Review and manage all opportunity posts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-lg transition font-medium ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-3 rounded-lg transition font-medium ${
                filter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Pending ({posts.filter(p => p.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-3 rounded-lg transition font-medium ${
                filter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Approved ({posts.filter(p => p.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-3 rounded-lg transition font-medium ${
                filter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Rejected ({posts.filter(p => p.status === 'rejected').length})
            </button>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <PostTable
        posts={filteredPosts}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        onView={setSelectedPost}
      />

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedPost.opportunity}</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Country</p>
                <p className="text-white">{selectedPost.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Funding Type</p>
                <p className="text-white">{selectedPost.fundingType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Deadline</p>
                <p className="text-white">{new Date(selectedPost.deadline).toLocaleDateString()}</p>
              </div>
              {selectedPost.officialLink && (
                <div>
                  <p className="text-sm text-gray-400">Official Link</p>
                  <a 
                    href={selectedPost.officialLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {selectedPost.officialLink}
                  </a>
                </div>
              )}
              {selectedPost.description && (
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-white">{selectedPost.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Posted By</p>
                <p className="text-white">{selectedPost.authorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Created At</p>
                <p className="text-white">{new Date(selectedPost.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;