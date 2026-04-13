import React from 'react';
import Link from 'next/link';
import { AdSense } from '@/src/components/AdSense';

interface MainLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function MainLayout({ children, maxWidth = 'max-w-6xl' }: MainLayoutProps) {
  return (
    <>
      <header className="border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className={`${maxWidth} mx-auto px-6 lg:px-8 h-16 flex items-center justify-between`}>
          <Link href="/" className="text-base font-medium tracking-[0.2em] uppercase text-gray-900">
            robo-advisor.kr
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-light tracking-wide text-gray-600">
            <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            <Link href="/en" className="hover:text-gray-900 transition-colors font-medium text-indigo-600">English</Link>
          </nav>
        </div>
      </header>

      {/* Global Top AdSense */}
      <div className={`${maxWidth} mx-auto px-6 lg:px-8 w-full`}>
        <AdSense slotId="global-top-ad" />
      </div>

      <main className={`flex-grow w-full ${maxWidth} mx-auto px-6 lg:px-8 py-8`}>
        {children}
      </main>

      {/* Global Bottom AdSense */}
      <div className={`${maxWidth} mx-auto px-6 lg:px-8 w-full`}>
        <AdSense slotId="global-bottom-ad" />
      </div>

      <footer className="border-t border-black/5 mt-24">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-neutral-500">
            <Link href="/privacy" className="hover:text-neutral-900 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-neutral-900 transition-colors">Contact</Link>
          </div>

          <p className="mt-6 text-sm leading-7 text-neutral-500">
            본 사이트는 금융 교육을 목적으로 하며, 투자 판단과 책임은 이용자 본인에게 있습니다.
          </p>

          <p className="mt-6 text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} robo-advisor.kr. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
