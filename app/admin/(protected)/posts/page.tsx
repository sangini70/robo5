'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../../src/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'naver_unrequested'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [naverFilter, setNaverFilter] = useState<'all' | 'unrequested' | 'requested'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const POSTS_PER_PAGE = 20;

  useEffect(() => {
    const q = query(collection(db, 'posts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleGoogleComplete = async (id: string) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        googleIndexStatus: 'requested',
        googleRequestedAt: serverTimestamp()
      });
      showToast('구글 요청완료로 표시했습니다.');
    } catch (error) {
      console.error("Error updating google status:", error);
    }
  };

  const handleGoogleIndexed = async (id: string) => {
    try {
      await updateDoc(doc(db, 'posts', id), {
        googleIndexStatus: 'indexed',
        googleIndexedAt: serverTimestamp()
      });
      showToast('구글 색인확인으로 표시했습니다.');
    } catch (error) {
      console.error("Error updating google status:", error);
    }
  };

  const handleNaverComplete = async (id: string) => {
    try {
      // Find the next unrequested post ID before updating
      const currentIndex = filteredAndSortedPosts.findIndex(p => p.id === id);
      let nextUnrequestedId = null;
      for (let i = currentIndex + 1; i < filteredAndSortedPosts.length; i++) {
        const p = filteredAndSortedPosts[i];
        const isScheduled = p.status === 'published' && p.publishDate && p.publishDate.toDate() > new Date();
        const isPublished = p.status === 'published' && !isScheduled;
        
        if (isPublished && (p.naverIndexStatus === 'none' || !p.naverIndexStatus)) {
          nextUnrequestedId = p.id;
          break;
        }
      }

      await updateDoc(doc(db, 'posts', id), {
        naverIndexStatus: 'requested',
        naverRequestedAt: serverTimestamp()
      });
      showToast('네이버 요청완료로 표시했습니다.');

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
        }, 300); // slight delay to allow React to re-render and Firestore to sync
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
        // Fallback to latest if both are same
      } else if (sortBy === 'views') {
        const viewsA = a.postViews || 0;
        const viewsB = b.postViews || 0;
        if (viewsB !== viewsA) {
          return viewsB - viewsA;
        }
      }
      
      const dateA = a.publishDate?.toDate() || a.createdAt?.toDate() || new Date(0);
      const dateB = b.publishDate?.toDate() || b.createdAt?.toDate() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return result;
  }, [posts, searchQuery, sortBy, naverFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, naverFilter]);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        await deleteDoc(doc(db, 'posts', postToDelete));
        
        // Sync to JSON files
        try {
          await fetch('/api/sync-json', { method: 'POST' });
        } catch (syncError) {
          console.error("Error syncing JSON files:", syncError);
        }
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
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Google</th>
              <th className="px-6 py-4 font-medium">Naver</th>
              <th className="px-6 py-4 font-medium">Views</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPosts.map(post => {
              const isScheduled = post.status === 'published' && post.publishDate && post.publishDate.toDate() > new Date();
              const isPublished = post.status === 'published' && !isScheduled;
              
              const googleStatus = post.googleIndexStatus || 'none';
              const naverStatus = post.naverIndexStatus || 'none';
              
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    googleStatus === 'indexed' ? 'bg-emerald-100 text-emerald-700' : 
                    googleStatus === 'requested' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {googleStatus === 'indexed' ? '🟢 색인확인' : 
                     googleStatus === 'requested' ? '🟡 요청완료' : '⚪ 미요청'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    naverStatus === 'requested' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {naverStatus === 'requested' ? '🟢 요청완료' : '⚪ 미요청'}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {post.postViews || 0}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  {isScheduled ? (
                    <span className="text-xs text-gray-400 cursor-help" title="발행 후 요청 가능">발행 대기중</span>
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
                          구글 색인확인
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
            {paginatedPosts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  pageNum === currentPage 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}

      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Post</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
