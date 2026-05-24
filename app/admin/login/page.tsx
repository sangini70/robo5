'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '@/src/contexts/AuthContext';
import { auth } from '@/src/firebase';

const googleProvider = new GoogleAuthProvider();

export default function AdminLogin() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = useState('');
  const [checkingPassword, setCheckingPassword] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      router.replace('/admin/posts');
    }
  }, [user, isAdmin, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  const handleGoogleLogin = async () => {
    setCheckingPassword(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err?.message || 'Google 로그인에 실패했습니다.');
    } finally {
      setCheckingPassword(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900 mb-6">Admin Login</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}

        {!user ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-light">
              Google 계정으로 관리자 로그인해 주세요.
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={checkingPassword}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {checkingPassword ? '로그인 중...' : 'Google로 로그인'}
            </button>
          </div>
        ) : isAdmin ? (
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-8">
              이미 관리자 로그인되어 있습니다.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/admin/posts')}
                className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                관리자 페이지로 이동
              </button>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-red-600 font-medium">
              관리자 권한이 없는 Google 계정입니다.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
