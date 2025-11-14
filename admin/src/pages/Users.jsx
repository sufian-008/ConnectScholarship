import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import UserTable from '../components/UserTable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users'); // Fetch all users from backend
      setUsers(res.data.data);                   // Set users from DB
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    const term = searchTerm.toLowerCase();
    if (term) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Role update failed:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-16 animate-pulse">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
          <p className="text-gray-400">Manage platform users and permissions</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 rounded-lg border border-gray-700
                       focus:border-purple-500 focus:outline-none text-white"
          />
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length > 0 ? (
        <UserTable
          users={filteredUsers}
          onDelete={handleDelete}
          onToggleRole={handleToggleRole}
        />
      ) : (
        <div className="text-center text-gray-400 py-8">No users found.</div>
      )}
    </div>
  );
};

export default Users;
