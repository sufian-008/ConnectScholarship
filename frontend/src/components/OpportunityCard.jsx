import React from 'react';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const OpportunityCard = ({ post }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-105">
      <h3 className="text-xl font-bold text-blue-400 mb-3">{post.opportunity}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin size={16} className="text-blue-400" />
          {post.country}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <DollarSign size={16} className="text-green-400" />
          {post.fundingType} Funding
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar size={16} className="text-purple-400" />
          {new Date(post.deadline).toLocaleDateString()}
        </div>
      </div>

      {post.description && (
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {post.description}
        </p>
      )}

      {post.officialLink && (
        <a
          href={post.officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-semibold"
        >
          Learn More
        </a>
      )}
    </div>
  );
};

export default OpportunityCard;