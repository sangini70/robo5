'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchAdminPosts } from '@/src/lib/admin-api';

const PostForm = dynamic(() => import('@/src/components/admin/PostForm').then(mod => mod.PostForm), { ssr: false });

export default function AdminEditPost() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await fetchAdminPosts(`/api/admin/posts?id=${encodeURIComponent(id)}`);
        const post = await response.json();
        if (post) {
          setInitialData(post);
        } else {
          router.push('/admin/posts');
        }
      } catch (error) {
        const firestoreError = error as any;
        console.error('EDIT POST FIRESTORE READ DEBUG', {
          phase: 'error',
          id,
          path: `posts/${id}`,
          errorCode: firestoreError?.code ?? null,
          errorMessage: firestoreError?.message ?? String(firestoreError),
        });
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-medium tracking-tight text-gray-900">Edit Post</h1>
      </div>
      {initialData && <PostForm initialData={initialData} postId={id} />}
    </div>
  );
}
