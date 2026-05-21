import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';

export const metadata: Metadata = {
  title: '개인정보처리방침 - robo-advisor.kr',
  description: '로보어드바이저 투자 가이드 사이트 개인정보처리방침입니다.',
};

export default function Privacy() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-10">개인정보처리방침</h1>
        <div className="prose prose-lg prose-gray font-light">
          <p>
            <strong>robo-advisor.kr</strong>은 이용자의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률을 준수하고 있습니다.
          </p>
          
          <h2 className="text-2xl font-medium tracking-tight text-gray-900 mt-12 mb-6">1. 수집하는 개인정보 항목</h2>
          <p>
            본 사이트는 별도의 회원가입 절차 없이 콘텐츠를 이용할 수 있으며, 이 과정에서 어떠한 개인정보도 수집하지 않습니다.
            단, 서비스 이용 과정에서 IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록 등이 자동으로 생성되어 수집될 수 있습니다.
          </p>

          <h2 className="text-2xl font-medium tracking-tight text-gray-900 mt-12 mb-6">2. 개인정보의 수집 및 이용목적</h2>
          <p>
            자동으로 수집되는 정보는 사이트의 접속 빈도 파악 및 이용자의 서비스 이용에 대한 통계 분석을 위해서만 사용됩니다.
          </p>

          <h2 className="text-2xl font-medium tracking-tight text-gray-900 mt-12 mb-6">3. 쿠키(Cookie)의 운용 및 거부</h2>
          <p>
            본 사이트는 이용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다. 이용자는 웹 브라우저의 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
