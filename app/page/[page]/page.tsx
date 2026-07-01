import React from 'react';
import { Metadata } from 'next';
import { HomeContent } from '@/src/components/HomeContent';
import { getPostsFromJson } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://robo-advisor.kr';
const SITE_TITLE = '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr';
const SITE_DESCRIPTION = '로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.';

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  const url = pageNumber <= 1 ? SITE_URL : `${SITE_URL}/page/${pageNumber}`;
  const title = pageNumber <= 1 ? SITE_TITLE : `로보어드바이저·ETF·환율 정보 정리 - Page ${pageNumber} | robo-advisor.kr`;

  return {
    title,
    description: SITE_DESCRIPTION,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: SITE_DESCRIPTION,
      url,
      siteName: 'robo-advisor.kr',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: SITE_DESCRIPTION,
    },
  };
}

function normalizeHomePosts(posts: any[]) {
  return [...posts]
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
        description: post.description || post.excerpt || '',
        date: `${yyyy}.${mm}.${dd} ${hh}:${min}`,
      };
    });
}

export default async function PaginatedHome({ params }: { params: Promise<{ page: string }> }) {
  const resolvedParams = await params;
  const page = parseInt(resolvedParams.page, 10);
  const posts = normalizeHomePosts(getPostsFromJson());
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedPosts = posts.slice(start, start + pageSize);

  return <HomeContent page={currentPage} totalPages={totalPages} initialPosts={pagedPosts} />;
}
