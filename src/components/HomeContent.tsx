'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/src/components/Hero';
import { PostCard } from '@/src/components/PostCard';
import { SearchBar } from '@/src/components/SearchBar';
import { CategoriesSection } from '@/src/components/CategoriesSection';
import { PopularPosts } from '@/src/components/PopularPosts';
import { db } from '@/src/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { MainLayout } from '@/src/components/MainLayout';

const POSTS_PER_PAGE = 6; // Reduced from 9 to 6 for homepage

export function HomeContent({ page = 1 }: { page?: number }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
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
          
        setTotalPages(Math.ceil(fetchedPosts.length / POSTS_PER_PAGE));
        
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const paginatedPosts = fetchedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
        
        setPosts(paginatedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <MainLayout>
      {page === 1 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "robo-advisor.kr",
                "url": "https://robo-advisor.kr",
                "description": "로보어드바이저 수수료, ETF 투자 기초, 환율 계산, 나스닥 선물 보는 법 등 금융 정보를 쉽게 정리한 가이드 사이트.",
                "publisher": {
                  "@type": "Organization",
                  "name": "robo-advisor.kr",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://robo-advisor.kr/logo.png"
                  }
                }
              })
            }}
          />
          <Hero />
          <SearchBar />
          <CategoriesSection />
          
          {/* Calculator Banner CTA */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold tracking-widest uppercase rounded-full mb-3">
                  New Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  실속 환율 계산기 오픈!
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  실제 환전 구조(수수료·우대율)를 반영한 <strong className="text-indigo-600">진짜 체감 환율</strong>을 확인해보세요.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <Link 
                  href="/exchange-rate-calculator" 
                  className="block w-full sm:w-auto text-center bg-indigo-600 text-white font-medium px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                >
                  계산기 바로가기 &rarr;
                </Link>
              </div>
            </div>
          </div>

          <PopularPosts />
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">Latest</span>
            <h2 className="text-2xl font-bold text-gray-900">최신 글</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">등록된 글이 없습니다.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                {page > 1 && (
                  <Link 
                    href={page === 2 ? '/' : `/page/${page - 1}`}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    이전
                  </Link>
                )}
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <Link
                      key={pageNum}
                      href={pageNum === 1 ? '/' : `/page/${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        pageNum === page 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                </div>

                {page < totalPages && (
                  <Link 
                    href={`/page/${page + 1}`}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    다음
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
