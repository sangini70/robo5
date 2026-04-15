import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';
import { Sidebar } from '@/src/components/Sidebar';

export const metadata: Metadata = {
  title: '로보어드바이저 선택 기준: MDD(최대 낙폭) 가이드 - robo-advisor.kr',
  description: '로보어드바이저를 선택할 때 가장 중요한 지표 중 하나인 MDD(Maximum Drawdown)에 대해 알아보고, 안정적인 투자를 위한 가이드를 제공합니다.',
};

export default function MDDGuide() {
  return (
    <MainLayout maxWidth="max-w-[1200px]">
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Guide</span>
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 font-light">
                  <time dateTime="2024-03-28">작성일: 2024년 3월 28일</time>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">
                로보어드바이저 선택 기준: MDD(최대 낙폭) 가이드
              </h1>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                로보어드바이저를 선택할 때 수익률만큼이나 중요한 것이 바로 '방어력'입니다. MDD 지표를 통해 안정적인 투자를 시작하는 방법을 알아봅니다.
              </p>
            </header>

            <div className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none">
              <h2>MDD(Maximum Drawdown)란 무엇인가요?</h2>
              <p>
                MDD는 '최대 낙폭'을 의미하며, 특정 기간 동안 최고점에서 최저점까지 얼마나 하락했는지를 나타내는 지표입니다. 
                예를 들어 MDD가 -20%라면, 가장 운이 나쁜 시점에 투자했을 때 원금의 20%를 잃을 수 있었다는 뜻입니다.
              </p>

              <h2>왜 로보어드바이저에서 MDD가 중요한가요?</h2>
              <p>
                로보어드바이저 투자의 핵심은 <strong>장기적이고 안정적인 자산 증식</strong>입니다. 
                시장이 좋을 때 높은 수익을 내는 것도 중요하지만, 시장이 폭락할 때 내 자산을 얼마나 잘 지켜주는지가 더 중요합니다.
              </p>
              <ul>
                <li><strong>심리적 안정감:</strong> MDD가 낮을수록 하락장에서 버틸 수 있는 심리적 여유가 생깁니다.</li>
                <li><strong>복리의 마법:</strong> 크게 잃지 않아야 복리 효과를 제대로 누릴 수 있습니다.</li>
              </ul>

              <h2>좋은 로보어드바이저를 선택하는 기준</h2>
              <p>
                단순히 과거 수익률이 높은 서비스보다는, <strong>수익률 대비 MDD가 얼마나 잘 관리되고 있는지</strong>를 확인해야 합니다.
                일반적으로 주식 비중이 높은 포트폴리오일수록 MDD가 높고, 채권 등 안전 자산 비중이 높을수록 MDD가 낮습니다.
              </p>
              
              <h3>투자 성향에 따른 MDD 가이드라인</h3>
              <ul>
                <li><strong>안정형:</strong> MDD -5% ~ -10% 내외 (원금 손실을 최소화하고 싶은 투자자)</li>
                <li><strong>중립형:</strong> MDD -10% ~ -15% 내외 (적당한 위험을 감수하며 시중 금리 이상의 수익을 추구)</li>
                <li><strong>공격형:</strong> MDD -15% ~ -25% 내외 (높은 변동성을 견디며 고수익을 추구)</li>
              </ul>

              <h2>결론</h2>
              <p>
                로보어드바이저 서비스를 선택할 때는 반드시 과거 운용 성과에서 MDD 지표를 확인하세요. 
                자신의 투자 성향과 감내할 수 있는 손실 수준(MDD)이 일치하는 서비스를 선택하는 것이 성공적인 장기 투자의 첫걸음입니다.
              </p>
            </div>
          </article>

          <aside className="lg:col-span-4 sticky top-24 h-fit">
            <Sidebar currentCategory="Guide" />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
