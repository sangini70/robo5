import '@/src/index.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '濡쒕낫?대뱶諛붿씠?쨌ETF쨌?섏쑉 ?뺣낫 ?뺣━ | robo-advisor.kr',
  description: '濡쒕낫?대뱶諛붿씠? ?섏닔猷? ETF ?ъ옄 湲곗큹, ?섏쑉 怨꾩궛, ?섏뒪???좊Ъ 蹂대뒗 踰???湲덉쑖 ?뺣낫瑜??쎄쾶 ?뺣━??媛?대뱶 ?ъ씠??',
  alternates: {
    canonical: 'https://robo-advisor.kr',
  },
  openGraph: {
    title: '濡쒕낫?대뱶諛붿씠?쨌ETF쨌?섏쑉 ?뺣낫 ?뺣━ | robo-advisor.kr',
    description: '濡쒕낫?대뱶諛붿씠? ?섏닔猷? ETF ?ъ옄 湲곗큹, ?섏쑉 怨꾩궛, ?섏뒪???ㅼ떆媛??뺤씤踰???湲덉쑖 ?뺣낫瑜??쎄쾶 ?뺣━??媛?대뱶 ?ъ씠??',
    url: 'https://robo-advisor.kr',
    siteName: 'robo-advisor.kr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '濡쒕낫?대뱶諛붿씠?쨌ETF쨌?섏쑉 ?뺣낫 ?뺣━ | robo-advisor.kr',
    description: '濡쒕낫?대뱶諛붿씠? ?섏닔猷? ETF ?ъ옄 湲곗큹, ?섏쑉 怨꾩궛, ?섏뒪???ㅼ떆媛??뺤씤踰???湲덉쑖 ?뺣낫瑜??쎄쾶 ?뺣━??媛?대뱶 ?ъ씠??',
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

