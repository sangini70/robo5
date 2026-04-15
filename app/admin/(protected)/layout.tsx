'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/contexts/AuthContext';
<<<<<<< HEAD
=======
import { auth, db } from '../../../src/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
=======
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd

  useEffect(() => {
    setUnlocked(sessionStorage.getItem('admin_unlocked') === 'true');
  }, []);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (!loading && unlocked !== null && (!user || !isAdmin || !unlocked)) {
      router.replace('/admin/login');
    }
  }, [user, isAdmin, unlocked, loading, router]);

  useEffect(() => {
    const checkPassword = async () => {
      try {
        const docRef = doc(db, 'settings', 'security');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || !docSnap.data().adminPassword || docSnap.data().adminPassword === 'admin') {
          setIsDefaultPassword(true);
        }
      } catch (error) {
        console.error("Error checking password:", error);
      }
    };
    if (user && isAdmin && unlocked) {
      checkPassword();
    }
  }, [user, isAdmin, unlocked]);

  if (loading || unlocked === null || !user || !isAdmin || !unlocked) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('admin_unlocked');
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
<<<<<<< HEAD
=======
      {isDefaultPassword && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-sm text-yellow-800 flex justify-center items-center gap-4 z-50">
          <span>보안을 위해 기본 관리자 비밀번호를 변경해 주세요.</span>
          <Link href="/admin/settings" className="font-medium underline hover:text-yellow-900">설정으로 이동</Link>
        </div>
      )}
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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
