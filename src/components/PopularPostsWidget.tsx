'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const formatDateTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

export function PopularPostsWidget({ currentPostId }: { currentPostId?: string }) {
  const [activeTab, setActiveTab] = useState<'all' | 'weekly'>('all');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let q;
        const now = new Date();

        if (activeTab === 'all') {
          q = query(
            collection(db, 'posts'),
            where('status', '==', 'published'),
            orderBy('postViews', 'desc'),
            limit(6)
          );
        } else {
          // Weekly: fetch all published posts and sort by views in the last 7 days
          q = query(
            collection(db, 'posts'),
            where('status', '==', 'published')
          );
        }

        const snapshot = await getDocs(q);
        let fetchedPosts = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          return { id: doc.id, ...data };
        });

        // Filter out current post and future posts
        fetchedPosts = fetchedPosts.filter(post => {
          if (post.language === 'en') return false;
          if (post.id === currentPostId) return false;
          if (!post.publishDate) return true;
          return post.publishDate.toDate() <= now;
        });

        if (activeTab === 'weekly') {
          // Calculate views in the last 7 days for each post
          const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
          });

          fetchedPosts.forEach(post => {
            let weeklyViews = 0;
            if (post.dailyViews) {
              last7Days.forEach(date => {
                if (post.dailyViews[date]) {
                  weeklyViews += post.dailyViews[date];
                }
              });
            }
            post._weeklyViews = weeklyViews;
          });

          // Sort by weekly views descending
          fetchedPosts.sort((a, b) => (b._weeklyViews || 0) - (a._weeklyViews || 0));
        }

        setPosts(fetchedPosts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching popular posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, currentPostId]);

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
        <h3 className="text-sm font-medium tracking-widest uppercase text-gray-900">인기글</h3>
        <div className="flex gap-2 text-xs">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-2 py-1 rounded transition-colors ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            누적
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`px-2 py-1 rounded transition-colors ${activeTab === 'weekly' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
          >
            주간
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {posts.map((post, index) => (
          <li key={post.id}>
            <Link href={`/${post.slug}`} className="group flex gap-3">
              <span className="text-lg font-bold text-indigo-200 group-hover:text-indigo-600 transition-colors w-5 shrink-0 text-center">
                {index + 1}
              </span>
              <div>
                <h4 className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span>{post.publishDate ? formatDateTime(post.publishDate.toDate()) : (post.createdAt ? formatDateTime(post.createdAt.toDate()) : '')}</span>
                  <span className="text-gray-300">|</span>
                  <span>조회수 {activeTab === 'weekly' ? (post._weeklyViews || 0) : (post.postViews || 0)}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
