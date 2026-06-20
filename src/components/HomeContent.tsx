'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/src/components/Hero';
import { PostCard } from '@/src/components/PostCard';
import { SearchBar } from '@/src/components/SearchBar';
import { CategoriesSection } from '@/src/components/CategoriesSection';
import { PopularPosts } from '@/src/components/PopularPosts';
import { MainLayout } from '@/src/components/MainLayout';
import { FlowSection } from '@/src/components/FlowSection';

const POSTS_PER_PAGE = 6; // Reduced from 9 to 6 for homepage

const RECOMMENDED_CATEGORIES = [
  {
    label: '환율',
    href: '/category/환율',
    description: '원달러 환율 · 환전 · 달러 투자',
  },
  {
    label: 'ETF',
    href: '/category/ETF',
    description: 'ETF 기초 · 자산배분 · 분산투자',
  },
  {
    label: '경제기초',
    href: '/category/경제기초',
    description: '금리 · 물가 · 경기 흐름',
  },
  {
    label: '미국증시',
    href: '/category/미국증시',
    description: '나스닥 · S&P500 · 미국 주식',
  },
  {
    label: '세금',
    href: '/category/세금',
    description: '세금 · 절세 · 지원금',
  },
];

export function HomeContent({ page = 1, initialPosts = [] }: { page?: number; initialPosts?: any[] }) {
  const posts = initialPosts;
  const latestPosts = posts.slice(0, page === 1 ? 4 : 8);
  const loading = false;
  const errorMsg = '';

  useEffect(() => {
    const heroImage = document.querySelector(
      'section img[src="/hero-image.svg"]'
    ) as HTMLImageElement | null;

    if (!heroImage) {
      return;
    }

    heroImage.src = '/images/hero-main.webp';
    heroImage.alt = '로보어드바이저 금융 가이드';
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
                "description": "로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.",
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
          <FlowSection posts={posts} />
          <section className="w-full mb-16">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">Recommended Categories</span>
                <h2 className="text-xl font-bold text-gray-900">추천 카테고리</h2>
              </div>
              <p className="text-sm text-gray-500">읽고 싶은 주제를 빠르게 선택해보세요.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {RECOMMENDED_CATEGORIES.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group flex flex-col p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="inline-flex w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 bg-indigo-50 mb-4">
                    Topic
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{category.description}</p>
                </Link>
              ))}
            </div>
          </section>
          <CategoriesSection />
          
          {/* Calculator Banner CTA */}
          <div className="w-full mb-16">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold tracking-widest uppercase rounded-full mb-3">
                  New Feature
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  실속 환율 계산기 오픈!
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  실제 환전 구조(수수료·우대율)를 반영하여 <strong className="text-indigo-600">진짜 체감 환율</strong>을 확인해보세요.
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

          <PopularPosts initialPosts={posts} />
          {posts.length > latestPosts.length && (
            <div className="w-full -mt-8 mb-16 flex justify-end">
              <Link
                href="/page/2"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                더 많은 글 보기
                <span className="ml-1" aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </>
      )}

      <div className="w-full">
          <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold block mb-2">ARTICLES</span>
            <h2 className="text-2xl font-bold text-gray-900">전체 글</h2>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading posts...</div>
        ) : errorMsg ? (
          <div className="text-center text-red-500 py-12 font-medium bg-red-50 rounded-lg border border-red-100">{errorMsg}</div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">등록된 글이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        {posts.length > latestPosts.length && (
          <div className="mt-8 flex justify-end">
            <Link
              href="/page/2"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              더 많은 글 보기
              <span className="ml-1" aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

