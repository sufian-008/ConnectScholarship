import React from 'react';

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-600/20 to-blue-800/20 border-blue-500/30',
    yellow: 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30',
    green: 'from-green-600/20 to-green-800/20 border-green-500/30',
    red: 'from-red-600/20 to-red-800/20 border-red-500/30',
    purple: 'from-purple-600/20 to-purple-800/20 border-purple-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
};

export default StatCard;
