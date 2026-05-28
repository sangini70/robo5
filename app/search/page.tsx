import { Metadata } from 'next';
import { SearchContent } from '@/src/components/SearchContent';
import { getPostsFromJson } from '@/src/lib/posts';

export const metadata: Metadata = {
  title: '검색 | robo-advisor.kr',
  description: 'robo-advisor.kr에서 원하는 금융 정보를 검색해보세요.',
};

export default function SearchPage() {
  return <SearchContent initialPosts={getPostsFromJson()} />;
}
