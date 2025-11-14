import React from 'react';

const StatCard = ({ icon: Icon, label, value, change, color = 'blue', trend }) => {
  const colors = {
    blue: 'from-blue-600 to-blue-800',
    yellow: 'from-yellow-600 to-yellow-800',
    green: 'from-green-600 to-green-800',
    red: 'from-red-600 to-red-800',
    purple: 'from-purple-600 to-purple-800'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="opacity-80" />
        {change && (
          <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
};

export default StatCard;
