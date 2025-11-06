import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Connect Scholarship
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-blue-400 transition">Home</Link>
              <Link to="/newsfeed" className="hover:text-blue-400 transition">Newsfeed</Link>
              <Link to="/subscribe" className="hover:text-blue-400 transition">Subscribe</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 rounded-lg hover:bg-purple-600/20 transition">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/my-account" className="px-4 py-2 rounded-lg hover:bg-blue-600/20 transition flex items-center gap-2">
                  <User size={18} />
                  {user.name}
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
