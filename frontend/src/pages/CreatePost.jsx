import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../api/axios';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    opportunity: '',
    country: '',
    fundingType: '',
    deadline: '',
    officialLink: '',
    description: ''
  });

    useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/my-posts`);
      const post = res.data.data.find(p => p._id === id);
      
      if (post && post.status === 'pending') {
        setFormData({
          opportunity: post.opportunity,
          country: post.country,
          fundingType: post.fundingType,
          deadline: post.deadline.split('T')[0],
          officialLink: post.officialLink || '',
          description: post.description || ''
        });
      } else {
        navigate('/my-account');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      navigate('/my-account');
    }
  };


