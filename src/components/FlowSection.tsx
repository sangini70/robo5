'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { PostCard } from '@/src/components/PostCard';

export function FlowSection() {
  const [flowPosts, setFlowPosts] = useState<{ [key: string]: any[] }>({
    '지금 시장 흐름': [],
    '과거에서 찾는 답': [],
    '앞으로의 방향': []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlowPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const now = new Date();
        
        const fetchedPosts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((post: any) => {
            if (post.publishDate && post.publishDate.toDate() > now) return false;
            if (post.language === 'en') return false; // Default is ko
            return !!post.flowType;
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

        const grouped: { [key: string]: any[] } = {
          '지금 시장 흐름': [],
          '과거에서 찾는 답': [],
          '앞으로의 방향': []
        };

        fetchedPosts.forEach((post: any) => {
          if (grouped[post.flowType] && grouped[post.flowType].length < 3) {
            grouped[post.flowType].push(post);
          }
        });

        setFlowPosts(grouped);
      } catch (error) {
        console.error("Error fetching flow posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowPosts();
  }, []);

  if (loading) return null;

  const hasAnyPosts = Object.values(flowPosts).some(posts => posts.length > 0);
  if (!hasAnyPosts) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold block mb-2">Market Flow</span>
        <h2 className="text-2xl font-bold text-gray-900">흐름으로 보기</h2>
      </div>

      <div className="space-y-12">
        {Object.entries(flowPosts).map(([flowType, posts]) => {
          if (posts.length === 0) return null;
          
          return (
            <div key={flowType} className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {flowType}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
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
