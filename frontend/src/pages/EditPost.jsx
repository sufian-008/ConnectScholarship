import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api/axios';

const EditPost = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [postStatus, setPostStatus] = useState(''); 
  const [formData, setFormData] = useState({
    opportunity: '',
    country: '',
    fundingType: '',
    deadline: '',
    officialLink: '',
    description: ''
  });

  // Fetch post data
  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/my-posts`);
      const post = res.data.data.find(p => p._id === id);

      if (!post) {
        navigate('/my-account');
        return;
      }

      setPostStatus(post.status);

      setFormData({
        opportunity: post.opportunity,
        country: post.country,
        fundingType: post.fundingType,
        deadline: post.deadline.split('T')[0],
        officialLink: post.officialLink || '',
        description: post.description || ''
      });
    } catch (err) {
      console.error(err);
      navigate('/my-account');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (postStatus === 'pending') {
        await api.put(`/posts/${id}`, formData);
      } else {
        await api.put(`/posts/${id}`, formData);
      }

      navigate('/my-account');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opportunity Title */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Opportunity Title *</label>
            <input
              type="text"
              required
              value={formData.opportunity}
              onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
              placeholder="Scholarship Program name"
              className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
            />
          </div>

          // Country and funding type fetching
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-semibold">Country *</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., United States"
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-semibold">Funding Type *</label>
              <select
                required
                value={formData.fundingType}
                onChange={(e) => setFormData({ ...formData, fundingType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              >
                <option value="">Select...</option>
                <option value="Full">Full Funding</option>
                <option value="Partial">Partial Funding</option>
                <option value="None">No Funding</option>
              </select>
            </div>
          </div>

          {/* Deadline & Official Link */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-semibold">Deadline *</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-semibold">Official Link</label>
              <input
                type="url"
                value={formData.officialLink}
                onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2 font-semibold">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="5"
              placeholder="Provide details about the opportunity..."
              className="w-full px-4 py-3 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition font-semibold"
            >
              {loading ? 'Updating...' : postStatus === 'pending' ? 'Update Post' : 'Submit Update Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-account')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-800/30 text-sm flex items-center gap-2 text-blue-300">
          <AlertCircle size={16} />
          {postStatus === 'pending'
            ? 'You are editing a pending post. Changes will be saved directly.'
            : 'Your update request will be reviewed by admins before being published.'}
        </div>
      </div>
    </div>
  );
};

export default EditPost;
