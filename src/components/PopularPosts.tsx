'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { PostCard } from '@/src/components/PostCard';

export function PopularPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('postViews', 'desc'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const now = new Date();
        
        const fetchedPosts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((post: any) => {
            if (!post.publishDate) return true;
            return post.publishDate.toDate() <= now;
          })
          .map((post: any) => {
            const dateObj = post.publishDate?.toDate() || post.createdAt?.toDate() || new Date();
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
          
        setPosts(fetchedPosts.slice(0, 3)); // Ensure max 3
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
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
