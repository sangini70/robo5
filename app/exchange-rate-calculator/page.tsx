import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';
import { ExchangeRateCalculator } from '@/src/components/ExchangeRateCalculator';

export const metadata: Metadata = {
  title: '실속 환율 계산기 - 우대율 반영 체감 환율 계산 | robo-advisor.kr',
  description: '환전 수수료와 환율 우대율을 반영하여 실제 필요한 원화 금액과 체감 환율을 계산해주는 실용적인 환율 계산기입니다.',
};

export default function ExchangeRateCalculatorPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">
            실속 환율 계산기
          </h1>
          <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            실제 환전 구조(수수료·우대율)를 반영하여
            <br className="hidden sm:block" />
            내가 내야 할 원화 금액과 체감 환율을 정확하게 계산해 드립니다.
          </p>
        </header>

        <ExchangeRateCalculator />

        <div className="prose prose-lg prose-gray mx-auto mt-16 leading-relaxed max-w-none">
          <h2 className="text-2xl font-medium tracking-tight text-gray-900 mb-6">환율 계산기 활용 가이드</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">1. 매매기준율이란?</h3>
              <p className="text-gray-600 font-light">
                외환시장에서 외환이 거래되는 기준 가격입니다. 우리가 실제로 외화를 살 때(현찰 살 때)나 팔 때(현찰 팔 때)는 이 매매기준율에 은행의 환전 수수료가 더해지거나 빼집니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2. 환전 수수료율 (스프레드)</h3>
              <p className="text-gray-600 font-light">
                은행이 환전 서비스를 제공하며 가져가는 마진입니다. 통화마다 다르며, 달러(USD), 엔(JPY), 유로(EUR) 등 주요 통화는 보통 1.75% 내외, 기타 통화는 2~8%까지 다양합니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">3. 환율 우대율의 비밀</h3>
              <p className="text-gray-600 font-light">
                '환율 90% 우대'라는 말은 매매기준율을 90% 깎아준다는 뜻이 아닙니다. <strong>은행이 가져가는 환전 수수료의 90%를 할인해 주겠다</strong>는 의미입니다. 따라서 우대율이 높을수록 내가 내야 할 수수료가 줄어들어 체감 환율이 매매기준율에 가까워집니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
