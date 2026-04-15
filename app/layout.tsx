import '@/src/index.css';
import { Metadata } from 'next';
<<<<<<< HEAD
=======
import { AuthProvider } from '@/src/contexts/AuthContext';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd

export const metadata: Metadata = {
  title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
  description: '로보어드바이저 수수료, ETF 투자 기초, 환율 계산, 나스닥 선물 보는 법 등 금융 정보를 쉽게 정리한 가이드 사이트.',
  alternates: {
    canonical: 'https://robo-advisor.kr',
  },
  openGraph: {
    title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
    description: '로보어드바이저 수수료, ETF 투자 기초, 환율 계산, 나스닥 실시간 확인법 등 금융 정보를 쉽게 정리한 가이드 사이트.',
    url: 'https://robo-advisor.kr',
    siteName: 'robo-advisor.kr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
    description: '로보어드바이저 수수료, ETF 투자 기초, 환율 계산, 나스닥 실시간 확인법 등 금융 정보를 쉽게 정리한 가이드 사이트.',
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
<<<<<<< HEAD
        <div className="min-h-screen flex flex-col font-sans">
          {children}
        </div>
=======
        <AuthProvider>
          <div className="min-h-screen flex flex-col font-sans">
            {children}
          </div>
        </AuthProvider>
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      </body>
    </html>
  );
}
