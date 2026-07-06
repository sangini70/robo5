import { Metadata } from 'next';
import { SearchContent } from '@/src/components/SearchContent';
import { getPostsFromJson } from '@/src/lib/posts';

export const metadata: Metadata = {
  title: '寃??| robo-advisor.kr',
  description: 'robo-advisor.kr?먯꽌 ?먰븯??湲덉쑖 ?뺣낫瑜?寃?됲빐蹂댁꽭??',
  alternates: {
    canonical: 'https://robo-advisor.kr/search',
    languages: {
      'ko-KR': 'https://robo-advisor.kr/search',
      'x-default': 'https://robo-advisor.kr/search',
    },
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '寃??| robo-advisor.kr',
    description: 'robo-advisor.kr?먯꽌 ?먰븯??湲덉쑖 ?뺣낫瑜?寃?됲빐蹂댁꽭??',
    url: 'https://robo-advisor.kr/search',
    siteName: 'robo-advisor.kr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '寃??| robo-advisor.kr',
    description: 'robo-advisor.kr?먯꽌 ?먰븯??湲덉쑖 ?뺣낫瑜?寃?됲빐蹂댁꽭??',
  },
};

export default function SearchPage() {
  return <SearchContent initialPosts={getPostsFromJson()} />;
}
