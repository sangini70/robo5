'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type AdminDateParts = {
  date: string;
  time: string;
};

function formatAdminDateParts(value?: string | null): AdminDateParts | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    date: `${lookup.year}.${lookup.month}.${lookup.day}`,
    time: `${lookup.hour}:${lookup.minute}`,
  };
}

export default function AdminPosts() {
  const restoreInputRef = useRef<HTMLInputElement | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'naver_unrequested'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [naverFilter, setNaverFilter] = useState<'all' | 'unrequested' | 'requested'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<(string | null)[]>([null]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  const [restoreResult, setRestoreResult] = useState<any | null>(null);
  const [restoreBackupJson, setRestoreBackupJson] = useState<any | null>(null);
  const [restoreApplyLoading, setRestoreApplyLoading] = useState(false);
  const [restoreApplyError, setRestoreApplyError] = useState('');
  const [restoreApplyResult, setRestoreApplyResult] = useState<any | null>(null);
  const ADMIN_PAGE_SIZE = 10;

  const loadPosts = async (options: { cursor?: string | null; pageNumber?: number } = {}) => {
    const pageNumber = options.pageNumber ?? currentPage;
    const cursor = typeof options.cursor !== 'undefined'
      ? options.cursor
      : pageCursors[pageNumber - 1] ?? null;

    try {
      setLoading(true);

      const params = new URLSearchParams({
        limit: String(ADMIN_PAGE_SIZE),
      });

      if (cursor) {
        params.set('cursor', cursor);
      }

      const response = await fetch(`/api/admin/posts?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || (data && data.success === false)) {
        const message = data?.message || data?.error || '관리자 목록 로딩 실패: 데이터를 불러오지 못했습니다.';
        console.error('ADMIN POSTS API ERROR', data);
        setPosts([]);
        setNextCursor(null);
        setHasMore(false);
        setLoadError(message);
        return false;
      }

      let nextPosts: any[] = [];
      let nextPageCursor: string | null = null;
      let nextHasMore = false;

      if (Array.isArray(data)) {
        nextPosts = data;
      } else if (data && Array.isArray(data.posts)) {
        nextPosts = data.posts;
        nextPageCursor = typeof data.nextCursor === 'string' && data.nextCursor.trim() ? data.nextCursor : null;
        nextHasMore = Boolean(data.hasMore);
      } else {
        console.error('ADMIN POSTS API INVALID RESPONSE', data);
        setPosts([]);
        setNextCursor(null);
        setHasMore(false);
        setLoadError('관리자 목록 로딩 실패: 잘못된 응답 형식입니다.');
        return false;
      }

      console.log('ADMIN POSTS API FIRST', nextPosts[0] ?? null);
      setPosts(nextPosts);
      setNextCursor(nextPageCursor);
      setHasMore(nextHasMore);
      setCurrentPage(pageNumber);
      setPageCursors((prev) => {
        const next = [...prev];
        next[pageNumber - 1] = cursor;
        return next;
      });
      setLoadError('');
      return true;
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setNextCursor(null);
      setHasMore(false);
      setLoadError('관리자 목록 로딩 실패: 데이터를 불러오지 못했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    console.log('ADMIN POSTS STATE FIRST', posts[0] ?? null);
  }, [posts]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleRestoreClick = () => {
    restoreInputRef.current?.click();
  };

  const handleRestoreFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setRestoreLoading(true);
    setRestoreError('');
    setRestoreResult(null);
    setRestoreBackupJson(null);
    setRestoreApplyLoading(false);
    setRestoreApplyError('');
    setRestoreApplyResult(null);

    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const response = await fetch('/api/admin/restore/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...parsed,
          mode: 'dry-run',
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setRestoreError(result?.error || 'Restore dry-run failed.');
      } else {
        setRestoreResult(result);
        setRestoreBackupJson(parsed);
      }
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      setRestoreError(message || 'Invalid JSON file.');
    } finally {
      setRestoreLoading(false);
      event.target.value = '';
    }
  };

  const handleRestoreApply = async () => {
    if (!restoreBackupJson || !restoreResult?.success) {
      return;
    }

    setRestoreApplyLoading(true);
    setRestoreApplyError('');
    setRestoreApplyResult(null);

    try {
      const response = await fetch('/api/admin/restore/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...restoreBackupJson,
          mode: 'apply',
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setRestoreApplyError(result?.error || 'Restore apply failed.');
      } else {
        setRestoreApplyResult(result);
      }
    } catch (error: any) {
      const message = error instanceof Error ? error.message : String(error);
      setRestoreApplyError(message || 'Restore apply failed.');
    } finally {
      setRestoreApplyLoading(false);
    }
  };

  const handleGoogleComplete = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          googleIndexStatus: 'requested',
          googleRequestedAt: new Date().toISOString()
        })
      });
      showToast('援ш? ?붿껌 ?꾨즺濡??쒖떆?섏뿀?듬땲??');
      // Refresh list
      await loadPosts({ cursor: pageCursors[currentPage - 1] ?? null, pageNumber: currentPage });
    } catch (error) {
      console.error("Error updating google status:", error);
    }
  };

  const handleGoogleIndexed = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          googleIndexStatus: 'indexed',
          googleIndexedAt: new Date().toISOString()
        })
      });
      showToast('援ш? ?됱씤 ?꾨즺濡??쒖떆?섏뿀?듬땲??');
      // Refresh list
      await loadPosts({ cursor: pageCursors[currentPage - 1] ?? null, pageNumber: currentPage });
    } catch (error) {
      console.error("Error updating google status:", error);
    }
  };

  const handleNaverComplete = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);

      // Find the next unrequested post ID before updating
      const currentIndex = filteredAndSortedPosts.findIndex(p => p.id === id);
      let nextUnrequestedId: string | null = null;
      for (let i = currentIndex + 1; i < filteredAndSortedPosts.length; i++) {
        const p = filteredAndSortedPosts[i];
        const isScheduled = p.status === 'published' && p.publishDate && new Date(p.publishDate) > new Date();
        const isPublished = p.status === 'published' && !isScheduled;

        if (isPublished && (p.naverIndexStatus === 'none' || !p.naverIndexStatus)) {
          nextUnrequestedId = p.id;
          break;
        }
      }

      await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          naverIndexStatus: 'requested',
          naverRequestedAt: new Date().toISOString()
        })
      });
      showToast('?ㅼ씠踰??붿껌 ?꾨즺濡??쒖떆?섏뿀?듬땲??');

      // Refresh list
      await loadPosts({ cursor: pageCursors[currentPage - 1] ?? null, pageNumber: currentPage });

      // Auto-scroll to the next unrequested post
      if (nextUnrequestedId) {
        setTimeout(() => {
          const nextRow = document.getElementById(`post-row-${nextUnrequestedId}`);
          if (nextRow) {
            nextRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            nextRow.classList.add('bg-blue-50');
            nextRow.style.transition = 'background-color 1s';
            setTimeout(() => {
              nextRow.classList.remove('bg-blue-50');
            }, 1000);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error updating naver status:", error);
    }
  };

  // Filter and sort posts
  const filteredAndSortedPosts = React.useMemo(() => {
    let result = [...posts];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title?.toLowerCase().includes(query)
      );
    }

    // Naver Filter
    if (naverFilter === 'unrequested') {
      result = result.filter(post => post.naverIndexStatus === 'none' || !post.naverIndexStatus);
    } else if (naverFilter === 'requested') {
      result = result.filter(post => post.naverIndexStatus === 'requested');
    }

    // Sort
    result.sort((a: any, b: any) => {
      if (sortBy === 'naver_unrequested') {
        const aUnrequested = a.naverIndexStatus === 'none' || !a.naverIndexStatus;
        const bUnrequested = b.naverIndexStatus === 'none' || !b.naverIndexStatus;
        if (aUnrequested && !bUnrequested) return -1;
        if (!aUnrequested && bUnrequested) return 1;
      } else if (sortBy === 'views') {
        const viewsA = a.postViews || 0;
        const viewsB = b.postViews || 0;
        if (viewsB !== viewsA) {
          return viewsB - viewsA;
        }
      }

      const dateA = new Date(a.publishDate || a.createdAt || 0);
      const dateB = new Date(b.publishDate || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return result;
  }, [posts, searchQuery, sortBy, naverFilter]);

  const displayedPosts = filteredAndSortedPosts;

  const handlePrevPage = async () => {
    if (currentPage === 1) {
      return;
    }

    const prevPageNumber = currentPage - 1;
    const prevCursor = pageCursors[prevPageNumber - 1] ?? null;
    await loadPosts({ cursor: prevCursor, pageNumber: prevPageNumber });
  };

  const handleNextPage = async () => {
    if (!hasMore || !nextCursor) {
      return;
    }

    const nextPageNumber = currentPage + 1;
    await loadPosts({ cursor: nextCursor, pageNumber: nextPageNumber });
  };

  const handlePageSelect = async (pageNumber: number) => {
    if (pageNumber === currentPage || pageNumber < 1 || pageNumber > pageCursors.length) {
      return;
    }

    const cursor = pageCursors[pageNumber - 1] ?? null;
    await loadPosts({ cursor, pageNumber });
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        await fetch(`/api/admin/posts?id=${postToDelete}`, { method: 'DELETE' });
        // Refresh list
        await loadPosts({ cursor: pageCursors[currentPage - 1] ?? null, pageNumber: currentPage });
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setPostToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setPostToDelete(null);
  };

  if (loading) {
    return <div className="text-gray-500">Loading posts...</div>;
  }

  return (
    <div>
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in-up">
          {toastMessage}
        </div>
      )}

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div className="flex items-center gap-6 flex-1">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900">Posts</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900 block p-2 w-48"
            />
            <select
              value={naverFilter}
              onChange={(e) => setNaverFilter(e.target.value as any)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900 block p-2"
            >
              <option value="all">전체</option>
              <option value="unrequested">네이버 미요청만</option>
              <option value="requested">네이버 요청완료만</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-gray-900 focus:border-gray-900 block p-2"
            >
              <option value="latest">최신순</option>
              <option value="views">조회수순</option>
              <option value="naver_unrequested">네이버 미요청 우선</option>
            </select>
          </div>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors shrink-0"
        >
          New Post
        </Link>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/api/admin/backup/posts';
          }}
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md text-gray-900 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
        >
          백업
        </button>
        <button
          type="button"
          onClick={handleRestoreClick}
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors shrink-0"
        >
          복원
        </button>
        <input
          ref={restoreInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleRestoreFileChange}
        />
      </div>

      {(restoreLoading || restoreError || restoreResult) && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
          {restoreLoading && <p className="text-gray-500">복원 dry-run 처리 중...</p>}
          {restoreError && <p className="text-red-600">{restoreError}</p>}
          {restoreResult && (
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                dry-run {restoreResult.success ? '성공' : '실패'}
              </p>
              <p>postsCount: {restoreResult.postsCount ?? 0}</p>
              <p>sample.id: {restoreResult.sample?.id ?? ''}</p>
              <p>sample.fieldKeys 개수: {restoreResult.sample?.fieldKeys?.length ?? 0}</p>
              <p>warning: {restoreResult.warning ?? ''}</p>
              <p>nextStep: {restoreResult.nextStep ?? ''}</p>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleRestoreApply}
              disabled={!restoreResult?.success || restoreApplyLoading}
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              복원 실행
            </button>
            <span className="text-xs text-gray-500">
              dry-run 성공 후에만 실행할 수 있습니다.
            </span>
          </div>
          {restoreApplyLoading && <p className="mt-3 text-gray-500">복원 실행 처리 중...</p>}
          {restoreApplyError && <p className="mt-3 text-red-600">{restoreApplyError}</p>}
          {restoreApplyResult && (
            <div className="mt-4 space-y-2 rounded-md bg-gray-50 p-3 text-gray-700">
              <p className="font-medium text-gray-900">
                복원 실행 {restoreApplyResult.success ? '성공' : '실패'}
              </p>
              <p>successCount: {restoreApplyResult.summary?.successCount ?? 0}</p>
              <p>failureCount: {restoreApplyResult.summary?.failureCount ?? 0}</p>
              <p>totalCount: {restoreApplyResult.summary?.totalCount ?? 0}</p>
              <p>warning: {restoreApplyResult.warning ?? ''}</p>
              <p>nextStep: {restoreApplyResult.nextStep ?? ''}</p>
            </div>
          )}
          {restoreApplyResult?.success && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">복원이 완료되었습니다.</p>
              <p className="mt-2">다음 순서로 진행하십시오.</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>npm run sync-json 실행</li>
                <li>생성된 JSON 확인</li>
                <li>Git Commit</li>
                <li>Git Push</li>
                <li>GitHub Actions 완료 확인</li>
                <li>Production 사이트 확인</li>
              </ol>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">최초 발행</th>
              <th className="px-6 py-4 font-medium">최근 수정</th>
              <th className="px-6 py-4 font-medium">Google</th>
              <th className="px-6 py-4 font-medium">Naver</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedPosts.map(post => {
              const isScheduled = post.status === 'published' && post.publishDate && new Date(post.publishDate) > new Date();
              const isPublished = post.status === 'published' && !isScheduled;

              const googleStatus = post.googleIndexStatus || 'none';
              const naverStatus = post.naverIndexStatus || 'none';
              const publishDateParts = formatAdminDateParts(post.publishDate);
              const updatedAtParts = formatAdminDateParts(post.updatedAt);

              return (
              <tr key={post.id} id={`post-row-${post.id}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 mb-1">{post.title}</div>
                  <div className="text-xs text-gray-500">/{post.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isPublished ? 'bg-emerald-100 text-emerald-700' :
                    isScheduled ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isScheduled ? 'scheduled' : post.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {publishDateParts ? (
                    <div className="text-xs leading-4 text-gray-700 whitespace-nowrap">
                      <div>{publishDateParts.date}</div>
                      <div>{publishDateParts.time}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {updatedAtParts ? (
                    <div className="text-xs leading-4 text-gray-700 whitespace-nowrap">
                      <div>{updatedAtParts.date}</div>
                      <div>{updatedAtParts.time}</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    googleStatus === 'indexed' ? 'bg-emerald-100 text-emerald-700' :
                    googleStatus === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {googleStatus === 'indexed' ? '색인 완료' :
                     googleStatus === 'requested' ? '요청 완료' : '미요청'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    naverStatus === 'requested' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {naverStatus === 'requested' ? '요청 완료' : '미요청'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {post.postViews || 0}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  {isScheduled ? (
                    <span className="text-xs text-gray-400 cursor-help" title="발행 예약 게시글입니다. 예약 발행중">예약 발행중</span>
                  ) : isPublished ? (
                    <>
                      {googleStatus === 'none' && (
                        <button
                          onClick={() => handleGoogleComplete(post.id)}
                          className="text-xs font-medium text-yellow-600 hover:text-yellow-900 transition-colors"
                        >
                          구글 완료
                        </button>
                      )}
                      {googleStatus === 'requested' && (
                        <button
                          onClick={() => handleGoogleIndexed(post.id)}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-900 transition-colors"
                        >
                          구글 완료
                        </button>
                      )}
                      {naverStatus === 'none' && (
                        <button
                          onClick={() => handleNaverComplete(post.id)}
                          className="text-xs font-medium text-emerald-600 hover:text-emerald-900 transition-colors"
                        >
                          네이버 완료
                        </button>
                      )}
                    </>
                  ) : null}
                  <span className="text-gray-300">|</span>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs font-medium text-indigo-600 hover:text-indigo-900 transition-colors">Edit</Link>
                  <button onClick={() => handleDeleteClick(post.id)} className="text-xs font-medium text-red-600 hover:text-red-900 transition-colors">Delete</button>
                </td>
              </tr>
              );
            })}
            {displayedPosts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  寃뚯떆湲???놁뒿?덈떎.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {pageCursors.map((_, index) => {
            const pageNumber = index + 1;
            const isCurrent = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                onClick={() => handlePageSelect(pageNumber)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-9 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>

      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">寃뚯떆湲 ??젣</h3>
            <p className="text-sm text-gray-500 mb-6">??寃뚯떆湲????젣?섏떆寃좎뒿?덇퉴? ???묒뾽? ?섎룎由????놁뒿?덈떎.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                痍⑥냼
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                ??젣
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
