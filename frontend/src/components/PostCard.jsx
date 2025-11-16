import React from 'react';
import { Edit2, Trash2, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post, showActions, showAdminActions, onApprove, onReject, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    const badges = {
      pending: { icon: Clock, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'Pending' },
      approved: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400 border-green-500/30', text: 'Approved' },
      rejected: { icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30', text: 'Rejected' }
    };
    
    const badge = badges[post.status];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${badge.color}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-blue-400">{post.opportunity}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {post.country}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={14} />
              {post.fundingType} Funding
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(post.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {(showActions || showAdminActions) && (
          <div className="flex gap-2">
            {showActions && post.status === 'pending' && (
              <>
                <button
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                  className="p-2 hover:bg-blue-600/20 rounded-lg transition"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(post._id)}
                  className="p-2 hover:bg-red-600/20 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            
            {showAdminActions && post.status === 'pending' && (
              <>
                <button
                  onClick={() => onApprove(post._id)}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(post._id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
                >
                  Reject
                </button>
              </>
            )}
            
            {showAdminActions && (
              <button
                onClick={() => onDelete(post._id)}
                className="p-2 hover:bg-red-600/20 rounded-lg transition"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {post.description && (
        <p className="text-gray-300 mb-4">{post.description}</p>
      )}

      {post.officialLink && (
        <a
          href={post.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-semibold"
        >
          Visit Official Site
        </a>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
        Posted by {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PostCard;