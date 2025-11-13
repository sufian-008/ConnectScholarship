import React, { useState } from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full py-3 px-4 bg-gray-900/50 rounded-lg border border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full py-3 px-4 bg-gray-900/50 rounded-lg border border-gray-600 text-white"
            />
          </div>
          <button className="w-full py-3 bg-purple-600 rounded-lg text-white font-semibold">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
