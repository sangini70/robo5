'use client';

import React from 'react';
import { PostCard } from '@/src/components/PostCard';

interface FlowSectionProps {
  posts?: any[];
}

function normalizePosts(posts: any[]) {
  const now = new Date();

  return posts
    .filter((post: any) => {
      if (post.status !== 'published') return false;
      if (post.publishDate && new Date(post.publishDate) > now) return false;
      if (post.language === 'en') return false;
      return !!post.flowType;
    })
    .sort((a: any, b: any) => {
      const dateA = a.publishDate ? new Date(a.publishDate) : a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.publishDate ? new Date(b.publishDate) : b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
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

export function FlowSection({ posts = [] }: FlowSectionProps) {
  const fetchedPosts = normalizePosts(posts);

  const grouped = fetchedPosts.reduce((acc: Record<string, any[]>, post: any) => {
    const flowType = post.flowType;
    if (!flowType) return acc;

    if (!acc[flowType]) {
      acc[flowType] = [];
    }

    if (acc[flowType].length < 4) {
      acc[flowType].push(post);
    }

    return acc;
  }, {});

  const flowTypes = Object.keys(grouped);
  if (flowTypes.length === 0) return null;

  return (
    <div className="w-full mb-16">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold block mb-2">Market Flow</span>
        <h2 className="text-2xl font-bold text-gray-900">?먮쫫?쇰줈 蹂닿린</h2>
      </div>

      <div className="space-y-12">
        {flowTypes.map((flowType) => {
          const postsForFlow = grouped[flowType];

          return (
            <div key={flowType} className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {flowType}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {postsForFlow.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
