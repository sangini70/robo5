import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';

export const metadata: Metadata = {
  title: '연락처 - robo-advisor.kr',
  description: '로보어드바이저 투자 가이드 사이트 연락처입니다.',
};

export default function Contact() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-10">연락처</h1>
        <div className="prose prose-lg prose-gray font-light">
          <p>
            문의사항이나 제휴 관련 제안이 있으신 경우 아래 이메일로 연락해 주시기 바랍니다.
          </p>
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
            <h3 className="text-sm font-medium tracking-widest uppercase text-gray-900 mb-2">Email</h3>
            <a href="mailto:contact@robo-advisor.kr" className="text-lg text-indigo-600 hover:text-indigo-900 transition-colors">
              contact@robo-advisor.kr
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
