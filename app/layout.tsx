import '@/src/index.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
  description: '로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.',
  alternates: {
    canonical: 'https://robo-advisor.kr',
  },
  openGraph: {
    title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
    description: '로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.',
    url: 'https://robo-advisor.kr',
    siteName: 'robo-advisor.kr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
    description: '로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col font-sans">
          {children}
        </div>
      </body>
    </html>
  );
}

