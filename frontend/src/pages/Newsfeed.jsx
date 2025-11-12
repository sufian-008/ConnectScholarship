import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText } from 'lucide-react';
import api from '../api/axios';
import PostCard from '../components/PostCard';

const Newsfeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await api.get(`/posts?page=${pageNum}&limit=10`);
      const newPosts = res.data.data;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for infinite scroll
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        🌍 Latest Opportunities
      </h1>

      {loading && posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
          Loading opportunities...
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post, index) => {
                // last post reference for infinite scroll trigger
                if (index === posts.length - 1) {
                  return (
                    <div ref={lastPostRef} key={post._id}>
                      <PostCard post={post} />
                    </div>
                  );
                } else {
                  return <PostCard key={post._id} post={post} />;
                }
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <FileText size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl">No opportunities available yet</p>
            </div>
          )}

          {/* Loading spinner while fetching next page */}
          {loading && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500 animate-pulse">
              Loading more opportunities...
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              🎉 You’ve reached the end of the list
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Newsfeed;
