import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          Connect Scholarship
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          <Link to="/newsfeed" className="hover:text-blue-400 transition">Newsfeed</Link>
          <Link to="/subscribe" className="hover:text-blue-400 transition">Subscribe</Link>
        </div>

        {/* User / Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg hover:bg-purple-600/20 transition"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/my-account"
                className="px-4 py-2 rounded-lg hover:bg-blue-600/20 transition flex items-center gap-2"
              >
                <User size={18} />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-black/50 backdrop-blur-md">
          <Link to="/" className="block hover:text-blue-400 transition">Home</Link>
          <Link to="/newsfeed" className="block hover:text-blue-400 transition">Newsfeed</Link>
          <Link to="/subscribe" className="block hover:text-blue-400 transition">Subscribe</Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-purple-600/20 transition"
                >
                  Admin Dashboard
                </Link>
              )}
              <Link
                to="/my-account"
                className="block px-4 py-2 rounded-lg hover:bg-blue-600/20 transition flex items-center gap-2"
              >
                <User size={18} />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
