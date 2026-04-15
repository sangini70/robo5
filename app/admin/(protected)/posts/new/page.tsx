'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PostForm = dynamic(() => import('@/src/components/admin/PostForm').then(mod => mod.PostForm), { ssr: false });

export default function AdminNewPost() {
  return (
    <div>
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-medium tracking-tight text-gray-900">New Post</h1>
      </div>
      <PostForm />
    </div>
  );
}
