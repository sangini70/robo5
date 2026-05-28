'use client';

import React from 'react';
import { PostCard } from '@/src/components/PostCard';

interface PopularPostsProps {
  initialPosts?: any[];
}

function normalizePosts(posts: any[]) {
  const now = new Date();

  return posts
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
        date: `${yyyy}.${mm}.${dd} ${hh}:${min}`,
      };
    });
}

export function PopularPosts({ initialPosts = [] }: PopularPostsProps) {
  const posts = normalizePosts(initialPosts);

  posts.sort((a: any, b: any) => (b.postViews || 0) - (a.postViews || 0));
  const topPosts = posts.slice(0, 4);

  if (topPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold block mb-2">Trending</span>
          <h2 className="text-2xl font-bold text-gray-900">많이 보는 글</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
