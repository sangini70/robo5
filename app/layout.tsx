import '@/src/index.css';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '로보어드바이저·ETF·환율 정보 정리 | robo-advisor.kr',
  description: '로보어드바이저 수수료, ETF 자산 기초, 환율 계산 등 금융 정보를 쉽게 정리한 가이드 사이트입니다.',
  metadataBase: new URL('https://robo-advisor.kr'),
  alternates: {
    canonical: 'https://robo-advisor.kr',
  },
  robots: {
    index: true,
    follow: true,
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
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col font-sans">
          {isProduction && (
            <>
              <Script
                id="adsense-auto-ads"
                async
                strategy="afterInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6091782335427561"
                crossOrigin="anonymous"
              />
              <Script
                id="ga4-tag"
                async
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-W8ET67HGWC"
              />
              <Script id="ga4-config" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-W8ET67HGWC');
                `}
              </Script>
            </>
          )}
          {children}
        </div>
      </body>
    </html>
  );
}
