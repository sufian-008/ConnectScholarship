import React from 'react';
import { Check, X, Trash2, Eye, Calendar, MapPin, FileText } from 'lucide-react'; // Added FileText

const PostTable = ({ posts = [], onApprove, onReject, onDelete, onView }) => { // Default empty array
  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
      approved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approved' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Rejected' }
    };
    
    const badge = badges[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Unknown' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  if (!Array.isArray(posts)) {
    console.error('Invalid posts prop:', posts);
    return <div className="text-red-400 text-center py-4">Error: Invalid posts data</div>;
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Opportunity</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Country</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Funding</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Deadline</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Author</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{post.opportunity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} />
                      {post.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{post.fundingType}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar size={14} />
                      {new Date(post.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                  <td className="px-6 py-4 text-gray-400">{post.authorName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onApprove(post._id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => onReject(post._id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onView(post)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(post._id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No posts found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTable;
