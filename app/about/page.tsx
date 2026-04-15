import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';

export const metadata: Metadata = {
  title: '사이트 소개 - robo-advisor.kr',
  description: '로보어드바이저 투자 가이드 사이트 소개입니다.',
};

export default function About() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-10">사이트 소개</h1>
        <div className="prose prose-lg prose-gray font-light">
          <p>
            <strong>robo-advisor.kr</strong>은 로보어드바이저를 활용한 스마트한 자산관리 방법을 공유하는 공간입니다.
          </p>
          <p>
            투자가 처음이신 분들도 쉽게 이해할 수 있도록 기초 개념부터 최신 시장 트렌드, 그리고 절세 혜택을 활용하는 방법까지 다양한 정보를 제공합니다.
          </p>
          <p>
            복잡한 금융 지식 없이도 누구나 안정적으로 자산을 불려나갈 수 있도록 돕는 것이 이 사이트의 목표입니다.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
