import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      // Only successful login navigates
      navigate(user.role === 'admin' ? '/admin' : '/my-account');
    } catch (err) {
      const status = err?.response?.status;
      let errorMessage = 'Login failed. Try again later.';

      if (status === 401) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (status === 400) {
        errorMessage = err.response?.data?.message || 'Bad request. Check your input.';
      } else if (status === 404) {
        errorMessage = 'User not found. Please register.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 bg-gray-900/50 rounded-lg border focus:outline-none ${
      hasError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-blue-500'
    } text-white`;

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign In</h2>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (error) setError('');
              }}
              className={inputClass(Boolean(error))}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError('');
              }}
              className={inputClass(Boolean(error))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition font-semibold"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-blue-400 hover:text-blue-300 transition">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
