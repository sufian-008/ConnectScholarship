import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, CheckCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import toast, { Toaster } from 'react-hot-toast';

const MyAccount = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

    // State for delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get('/posts/my-posts');
      setPosts(res.data.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

    // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeleteModal({ open: true, postId: id });
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    const id = deleteModal.postId;
    try {
      await api.delete(/posts/${id});
      setPosts(posts.filter(p => p._id !== id));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setDeleteModal({ open: false, postId: null });
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setDeleteModal({ open: false, postId: null });
  };

  // Edit post
  const handleEdit = (id) => {
    navigate(/edit-post/${id});
  };

  const stats = {
    pending: posts.filter(p => p.status === 'pending').length,
    approved: posts.filter(p => p.status === 'approved').length,
    rejected: posts.filter(p => p.status === 'rejected').length
  };


  if (loading) return <div className="text-center py-16">Loading...</div>;

   return (
    <div className="space-y-8 relative">
      <Toaster position="top-right" />
     
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 text-center space-y-4">
            <h3 className="text-xl font-bold">Confirm Delete</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-gray-400">Welcome back, {user.name}</p>
        </div>
        <Link
          to="/create-post"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2 font-semibold"
        >
          <Plus size={20} /> Create Post
        </Link>
      </div>


export default MyAccount;


