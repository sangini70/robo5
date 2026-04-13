'use client';

import React, { useEffect, useState } from 'react';
import { PostCard } from '@/src/components/PostCard';

export function PopularPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch('/data/posts.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch posts data');
        }
        const fetchedPosts = await response.json();
        const now = new Date();
        
        const filteredPosts = fetchedPosts
          .filter((post: any) => {
            if (post.language === 'en') return false;
            if (!post.publishDate) return true;
            return new Date(post.publishDate) <= now;
          })
          .map((post: any) => {
            const dateObj = post.publishDate ? new Date(post.publishDate) : post.createdAt ? new Date(post.createdAt) : new Date();
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const hh = String(dateObj.getHours()).padStart(2, '0');
            const min = String(dateObj.getMinutes()).padStart(2, '0');
            
            return {
              ...post,
              date: `${yyyy}.${mm}.${dd} ${hh}:${min}`
            };
          });
          
        filteredPosts.sort((a: any, b: any) => (b.postViews || 0) - (a.postViews || 0));
        setPosts(filteredPosts.slice(0, 4)); // Increased from 3 to 4
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading || posts.length === 0) {
    return null; // Or a skeleton loader
  }

  return (
    <div className="w-full mb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold block mb-2">Trending</span>
          <h2 className="text-2xl font-bold text-gray-900">많이 보는 글</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
