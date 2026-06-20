import React from 'react';
import { HomeContent } from '@/src/components/HomeContent';
import Link from 'next/link';
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

function getPaginationPages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  for (let page = 1; page <= Math.min(4, totalPages); page += 1) {
    pages.add(page);
  }

  return Array.from(pages).sort((a, b) => a - b);
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
  const visiblePages = getPaginationPages(currentPage, totalPages);

  return (
    <>
      {totalPages > 1 && (
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-8 pt-8">
          <nav className="flex items-center justify-between gap-4 border-t border-gray-200 pt-8">
            {currentPage > 1 ? (
              <Link
                href={currentPage === 2 ? '/' : `/page/${currentPage - 1}`}
                className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
              >
                이전
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300">
                이전
              </span>
            )}

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {visiblePages.map((pageNumber, index) => {
                const prevPage = visiblePages[index - 1];
                const shouldShowEllipsis = prevPage && pageNumber - prevPage > 1;

                return (
                  <React.Fragment key={pageNumber}>
                    {shouldShowEllipsis && (
                      <span className="px-2 text-sm text-gray-400">...</span>
                    )}
                    <Link
                      href={pageNumber === 1 ? '/' : `/page/${pageNumber}`}
                      aria-current={pageNumber === currentPage ? 'page' : undefined}
                      className={`inline-flex min-w-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        pageNumber === currentPage
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  </React.Fragment>
                );
              })}
            </div>

            {currentPage < totalPages ? (
              <Link
                href={`/page/${currentPage + 1}`}
                className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
              >
                다음
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-gray-100 px-4 py-2 text-sm font-medium text-gray-300">
                다음
              </span>
            )}
          </nav>
        </div>
      )}

      <HomeContent page={currentPage} initialPosts={pagedPosts} />
    </>
  );
}
