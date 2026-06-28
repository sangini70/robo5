import React from 'react';
import { HomeContent } from '@/src/components/HomeContent';
import { getPostsFromJson } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

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
