import React from 'react';
import { Mail, Calendar, Shield, User as UserIcon, Trash2 } from 'lucide-react';

const UserTable = ({ users, onDelete, onToggleRole }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <UserIcon size={18} className="text-white" />
                    </div>
                    <span className="text-white font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={14} />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onToggleRole(user._id, user.role)}
                      className="px-3 py-1 text-purple-400 hover:bg-purple-500/20 rounded-lg transition text-sm"
                      title="Toggle Role"
                    >
                      <Shield size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;