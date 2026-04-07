'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PostCard } from '@/src/components/PostCard';
import { MainLayout } from '@/src/components/MainLayout';
import { Search } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<any[]>([]);
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!initialQuery.trim()) {
        setPosts([]);
        setLoading(false);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);
      setSearchQuery(initialQuery);

      try {
        // Fetch all published posts and filter client-side for simplicity and flexibility
        // (Firestore doesn't support full-text search natively without extensions)
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('publishDate', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const now = new Date();
        
        const sanitizedQuery = initialQuery.trim().replace(/\s+/g, ' ');
        const searchTerms = sanitizedQuery.toLowerCase().split(' ').filter(term => term.length > 0);

        const fetchedPosts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((post: any) => {
            if (post.publishDate && post.publishDate.toDate() > now) return false;
            return true;
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

        const scoredPosts = fetchedPosts.map((post: any) => {
          const title = (post.title || '').toLowerCase();
          const description = (post.description || '').toLowerCase();
          const category = (post.category || '').toLowerCase();
          const tags = Array.isArray(post.tags) ? post.tags.map((t: string) => t.toLowerCase()) : [];
          
          let score = 0;
          
          for (const term of searchTerms) {
            if (title.includes(term)) score += 100;
            if (tags.some(tag => tag.includes(term))) score += 50;
            if (category.includes(term)) score += 25;
            if (description.includes(term)) score += 10;
          }
          
          return { ...post, searchScore: score };
        }).filter(post => post.searchScore > 0);
        
        // Sort by search score descending, then by publish date descending
        scoredPosts.sort((a, b) => {
          if (b.searchScore !== a.searchScore) {
            return b.searchScore - a.searchScore;
          }
          const dateA = a.publishDate?.toDate() || a.createdAt?.toDate() || new Date(0);
          const dateB = b.publishDate?.toDate() || b.createdAt?.toDate() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
          
        setPosts(scoredPosts);

        // If no results, fetch some recommended posts (popular ones)
        if (scoredPosts.length === 0) {
          const sortedByViews = [...fetchedPosts].sort((a, b) => (b.postViews || 0) - (a.postViews || 0));
          setRecommendedPosts(sortedByViews.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [initialQuery]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden border border-gray-300 shadow-sm transition-shadow duration-300">
              <div className="grid place-items-center h-full w-12 text-gray-400">
                <Search size={20} />
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-4 bg-transparent"
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="h-full px-6 bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {hasSearched && (
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              "{initialQuery}" 검색 결과 <span className="text-indigo-600 ml-2">{posts.length}건</span>
            </h1>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 py-12">검색 중입니다...</div>
        ) : hasSearched && posts.length === 0 ? (
          <div className="space-y-12">
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500 mb-6">다른 검색어를 입력하거나 카테고리를 통해 탐색해보세요.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => router.push('/')} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  홈으로 가기
                </button>
              </div>
            </div>

            {recommendedPosts.length > 0 && (
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold block mb-2">Recommended</span>
                    <h2 className="text-2xl font-bold text-gray-900">이런 글은 어떠세요?</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export function SearchContent() {
  return (
    <Suspense fallback={<MainLayout><div className="text-center py-20">Loading...</div></MainLayout>}>
      <SearchResults />
    </Suspense>
  );
}
