import React from 'react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="py-16 sm:py-24 border-b border-gray-200 mb-16">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gray-900"></span>
              <span className="text-xs uppercase tracking-[0.15em] text-gray-500 font-medium">Guide 01</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-gray-900 mb-6 leading-[1.1]">
              로보어드바이저, ETF, 환율을 이해하는 금융 가이드
            </h1>
            <p className="text-base md:text-lg text-gray-600 font-light mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              로보어드바이저, ETF, 환율 구조를 이해하기 쉽게 설명합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3.5 text-xs font-medium uppercase tracking-widest rounded-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                사이트 소개
              </Link>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="flex-1 w-full max-w-md lg:max-w-none mx-auto">
            <div className="aspect-w-16 aspect-h-9 lg:aspect-w-4 lg:aspect-h-3 rounded-sm overflow-hidden bg-gray-100 relative">
              <img
                src="/hero-image.svg"
                alt="금융 데이터 및 투자 구조 분석 차트"
                className="w-full h-full object-cover opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 border border-black/5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
