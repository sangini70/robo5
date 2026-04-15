'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem('admin_unlocked') === 'true');
  }, []);

  useEffect(() => {
    if (!loading && unlocked !== null && (!isAdmin || !unlocked)) {
      router.replace('/admin/login');
    }
  }, [isAdmin, unlocked, loading, router]);

  if (loading || unlocked === null || !isAdmin || !unlocked) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.dispatchEvent(new Event('storage'));
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="text-base font-medium tracking-tight text-gray-900">
              Admin Panel
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium text-gray-500">
              <Link href="/admin/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
              <Link href="/admin/posts" className="hover:text-gray-900 transition-colors">Posts</Link>
              <Link href="/admin/settings" className="hover:text-gray-900 transition-colors">Settings</Link>
              <Link href="/" className="hover:text-gray-900 transition-colors" target="_blank">View Site</Link>
            </nav>
          </div>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
