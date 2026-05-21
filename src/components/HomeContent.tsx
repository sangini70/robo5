'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/src/components/Hero';
import { PostCard } from '@/src/components/PostCard';
import { SearchBar } from '@/src/components/SearchBar';
import { CategoriesSection } from '@/src/components/CategoriesSection';
import { PopularPosts } from '@/src/components/PopularPosts';
import { MainLayout } from '@/src/components/MainLayout';
import { FlowSection } from '@/src/components/FlowSection';

const POSTS_PER_PAGE = 6; // Reduced from 9 to 6 for homepage

export function HomeContent({ page = 1 }: { page?: number }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setErrorMsg('');
        const response = await fetch(`/data/posts.json?t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts data');
        }
        const fetchedPosts = await response.json();
        console.log('HomeContent: Fetched raw posts:', fetchedPosts);
        
        if (!Array.isArray(fetchedPosts)) {
          console.error('HomeContent: Data is not an array:', fetchedPosts);
          throw new Error('Data format error: expected an array');
        }

        const now = new Date();
        
        // Temporarily disable all filters as requested
        const filteredPosts = [...fetchedPosts];
        console.log('HomeContent: Filtered posts count:', filteredPosts.length);

        // Sort by publishDate descending
        filteredPosts.sort((a: any, b: any) => {
          const dateA = a.publishDate ? new Date(a.publishDate) : a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.publishDate ? new Date(b.publishDate) : b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });

        const mappedPosts = fetchedPosts.map((post: any) => {
          const dateObj = post.publishDate ? new Date(post.publishDate) : post.createdAt ? new Date(post.createdAt) : new Date();
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const hh = String(dateObj.getHours()).padStart(2, '0');
          const min = String(dateObj.getMinutes()).padStart(2, '0');
          
          return {
            ...post,
            description: post.description || post.excerpt || '', // Ensure description exists for PostCard
            date: `${yyyy}.${mm}.${dd} ${hh}:${min}`
          };
        });
        
        console.log('HomeContent: Mapped posts:', mappedPosts);
        setPosts(mappedPosts);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        setErrorMsg('湲??遺덈윭?ㅻ뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
                "description": "濡쒕낫?대뱶諛붿씠? ?섏닔猷? ETF ?ъ옄 湲곗큹, ?섏쑉 怨꾩궛, ?섏뒪???좊Ъ 蹂대뒗 踰???湲덉쑖 ?뺣낫瑜??쎄쾶 ?뺣━??媛?대뱶 ?ъ씠??",
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
          <FlowSection />
          <CategoriesSection />
          
          {/* Calculator Banner CTA */}
          <div className="w-full mb-16">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold tracking-widest uppercase rounded-full mb-3">
                  New Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  ?ㅼ냽 ?섏쑉 怨꾩궛湲??ㅽ뵂!
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  ?ㅼ젣 ?섏쟾 援ъ“(?섏닔猷뙿룹슦???瑜?諛섏쁺??<strong className="text-indigo-600">吏꾩쭨 泥닿컧 ?섏쑉</strong>???뺤씤?대낫?몄슂.
                </p>
              </div>
              <div className="w-full sm:w-auto shrink-0">
                <Link 
                  href="/exchange-rate-calculator" 
                  className="block w-full sm:w-auto text-center bg-indigo-600 text-white font-medium px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
                >
                  怨꾩궛湲?諛붾줈媛湲?&rarr;
                </Link>
              </div>
            </div>
          </div>

          <PopularPosts />
        </>
      )}

      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">Latest</span>
            <h2 className="text-2xl font-bold text-gray-900">理쒖떊 湲</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading posts...</div>
        ) : errorMsg ? (
          <div className="text-center text-red-500 py-12 font-medium bg-red-50 rounded-lg border border-red-100">{errorMsg}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">?깅줉??湲???놁뒿?덈떎.</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

