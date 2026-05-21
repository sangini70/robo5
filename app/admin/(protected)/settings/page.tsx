'use client';

import React, { useState } from 'react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '??鍮꾨?踰덊샇? ?뺤씤???쇱튂?섏? ?딆뒿?덈떎.' });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: '??鍮꾨?踰덊샇??理쒖냼 4?먮━ ?댁긽?댁뼱???⑸땲??' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const settings = await response.json();

      const actualCurrentPassword = settings.adminPassword || 'admin';

      if (currentPassword !== actualCurrentPassword) {
        setMessage({ type: 'error', text: '?꾩옱 鍮꾨?踰덊샇媛 ?쇱튂?섏? ?딆뒿?덈떎.' });
        setLoading(false);
        return;
      }

      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminPassword: newPassword })
      });

      setMessage({ type: 'success', text: '鍮꾨?踰덊샇媛 ?깃났?곸쑝濡?蹂寃쎈릺?덉뒿?덈떎.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: 'error', text: '鍮꾨?踰덊샇 蹂寃?以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-2">愿由ъ옄 怨꾩젙 諛?蹂댁븞 ?ㅼ젙??愿由ы빀?덈떎.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-6">鍮꾨?踰덊샇 蹂寃?</h2>

        {message.text && (
          <div className={`mb-6 p-4 text-sm rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">?꾩옱 鍮꾨?踰덊샇</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">??鍮꾨?踰덊샇</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">??鍮꾨?踰덊샇 ?뺤씤</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? '蹂寃?以?..' : '鍮꾨?踰덊샇 蹂寃?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
