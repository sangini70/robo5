'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

export function ShareButtons({ url, title, description, thumbnail }: ShareButtonsProps) {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!kakaoKey) {
      console.warn('Kakao JS Key is missing in environment variables.');
      return;
    }

    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          try {
            window.Kakao.init(kakaoKey);
          } catch (e) {
            console.error('Kakao init error', e);
          }
        }
      };
      document.head.appendChild(script);
    } else if (!window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(kakaoKey);
      } catch (e) {
        console.error('Kakao init error', e);
      }
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      console.error('Kakao SDK not initialized');
      alert('카카오톡 공유 기능을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.');
      handleCopyLink();
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title,
          description: description || title,
          imageUrl: thumbnail || 'https://robo-advisor.kr/logo.png',
          link: {
            mobileWebUrl: url,
            webUrl: url,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Kakao share error:', error);
      alert('카카오톡 공유 중 오류가 발생했습니다. 링크가 복사됩니다.');
      handleCopyLink();
    }
  };

  const handleXShare = () => {
    const text = encodeURIComponent(title);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-3 my-6 relative">
      <button
        onClick={handleKakaoShare}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FEE500] hover:bg-[#F4DC00] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEE500]"
        aria-label="카카오톡으로 공유하기"
      >
        <svg viewBox="0 0 32 32" className="w-5 h-5" fill="#000000" aria-hidden="true">
          <path d="M16 4.64c-6.96 0-12.64 4.48-12.64 10.08 0 3.52 2.32 6.64 5.76 8.48l-1.44 5.44c-.16.48.4.8.8.48l6.24-4.16c.4.08.8.08 1.28.08 6.96 0 12.64-4.48 12.64-10.08S22.96 4.64 16 4.64z" />
        </svg>
      </button>

      <button
        onClick={handleXShare}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        aria-label="X(트위터)로 공유하기"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      <button
        onClick={handleFacebookShare}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
        aria-label="페이스북으로 공유하기"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>
      
      <button
        onClick={handleCopyLink}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
        aria-label="링크 복사하기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      </button>

      {showToast && (
        <div className="absolute left-0 top-12 px-3 py-1.5 bg-gray-800 text-white text-xs rounded shadow-lg animate-fade-in-up whitespace-nowrap z-10">
          링크가 복사되었습니다.
        </div>
      )}
    </div>
  );
}
