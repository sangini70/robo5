'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function AdminLogin() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingPassword, setCheckingPassword] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">Loading...</div>;
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPassword(true);
    setError('');
    
    // Fetch correct password from settings.json
    try {
      const response = await fetch('/data/settings.json');
      const settings = await response.json();
      const correctPassword = settings.adminPassword || 'admin';

      if (password === correctPassword) {
        sessionStorage.setItem('admin_unlocked', 'true');
        // Trigger AuthContext update
        window.dispatchEvent(new Event('storage'));
        router.push('/admin/posts');
      } else {
        setError('비밀번호가 일치하지 않습니다.');
        setCheckingPassword(false);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('설정 정보를 불러오는 중 오류가 발생했습니다.');
      setCheckingPassword(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.dispatchEvent(new Event('storage'));
    setPassword('');
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

        {!isAdmin ? (
          <form onSubmit={handlePasswordSubmit}>
            <p className="text-sm text-gray-500 font-light mb-6">
              관리자 비밀번호를 입력해 주세요.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호"
              className="w-full mb-4 bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              disabled={checkingPassword}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {checkingPassword ? '확인 중...' : '확인'}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-8">
              이미 관리자로 로그인되어 있습니다.
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
        )}
      </div>
    </div>
  );
}
