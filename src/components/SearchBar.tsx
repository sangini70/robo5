'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = query.trim().replace(/\s+/g, ' ');
    if (sanitizedQuery) {
      router.push(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden border border-gray-200 shadow-sm transition-shadow duration-300">
          <div className="grid place-items-center h-full w-12 text-gray-400">
            <Search size={20} />
          </div>
          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-4 bg-transparent"
            type="text"
            id="search"
            placeholder="환율, ETF, 금융 가이드를 검색해보세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="h-full px-6 bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
}
