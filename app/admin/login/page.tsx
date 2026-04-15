'use client';

<<<<<<< HEAD
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
=======
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../src/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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

<<<<<<< HEAD
=======
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError('');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || 'Google 로그인에 실패했습니다.');
    }
  };

>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPassword(true);
    setError('');
<<<<<<< HEAD
    
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
=======
    try {
      const docRef = doc(db, 'settings', 'security');
      let correctPassword = 'admin'; // Default fallback
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().adminPassword) {
        correctPassword = docSnap.data().adminPassword;
      } else {
        // Initialize if not exists
        await setDoc(docRef, { adminPassword: 'admin' }, { merge: true });
      }

      if (password === correctPassword) {
        sessionStorage.setItem('admin_unlocked', 'true');
        router.push('/admin/posts');
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err: any) {
      console.error("Password check failed", err);
      if (err.code === 'resource-exhausted' || err.message?.includes('Quota')) {
        setError('현재 데이터베이스 접근이 불안정합니다. 잠시 후 다시 시도하세요.');
      } else {
        setError('비밀번호 확인 중 오류가 발생했습니다.');
      }
    } finally {
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      setCheckingPassword(false);
    }
  };

<<<<<<< HEAD
  const handleLogout = () => {
    sessionStorage.removeItem('admin_unlocked');
    window.dispatchEvent(new Event('storage'));
=======
  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('admin_unlocked');
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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

<<<<<<< HEAD
        {!isAdmin ? (
          <form onSubmit={handlePasswordSubmit}>
            <p className="text-sm text-gray-500 font-light mb-6">
              관리자 비밀번호를 입력해 주세요.
=======
        {!user ? (
          <>
            <p className="text-sm text-gray-500 font-light mb-8">
              관리자 계정(Google)으로 로그인해 주세요.
            </p>
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Sign in with Google
            </button>
          </>
        ) : !isAdmin ? (
          <>
            <p className="text-sm text-red-600 font-medium mb-8">
              접근 권한이 없습니다. 등록된 관리자 이메일이 아닙니다.
            </p>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              다른 계정으로 로그인
            </button>
          </>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <p className="text-sm text-gray-500 font-light mb-6">
              보안을 위해 관리자 비밀번호를 한 번 더 입력해 주세요.
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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
<<<<<<< HEAD
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
=======
            <button
              type="button"
              onClick={handleLogout}
              className="w-full mt-4 inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </form>
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        )}
      </div>
    </div>
  );
}
