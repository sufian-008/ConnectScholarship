import React, { useState } from 'react';
import { Check } from 'lucide-react';

const Subscribe = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-12 border border-gray-700 text-center">
        <h1 className="text-4xl font-bold mb-4">Stay Updated</h1>
        <p className="text-gray-400 text-lg mb-8">
          Subscribe to receive notifications about new opportunities matching your interests
        </p>
        
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-400 text-lg">
            <Check size={24} />
            <span>Successfully subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-gray-900/50 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
