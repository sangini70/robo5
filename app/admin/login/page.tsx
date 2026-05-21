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
        setError('鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.');
        setCheckingPassword(false);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('?ㅼ젙 ?뺣낫瑜?遺덈윭?ㅻ뒗 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.');
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
              愿由ъ옄 鍮꾨?踰덊샇瑜??낅젰??二쇱꽭??
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="愿由ъ옄 鍮꾨?踰덊샇"
              className="w-full mb-4 bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              required
            />
            <button
              type="submit"
              disabled={checkingPassword}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {checkingPassword ? '?뺤씤 以?..' : '?뺤씤'}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-sm text-emerald-600 font-medium mb-8">
              ?대? 愿由ъ옄濡?濡쒓렇?몃릺???덉뒿?덈떎.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/admin/posts')}
                className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                愿由ъ옄 ?섏씠吏濡??대룞
              </button>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 transition-colors"
              >
                濡쒓렇?꾩썐
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

