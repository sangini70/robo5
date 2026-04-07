import { Metadata } from 'next';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { PostCard } from '@/src/components/PostCard';
import { cache } from 'react';

const getPostsByCategory = cache(async (category: string) => {
  const q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('publishDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const now = new Date();
  
  const decodedCategory = decodeURIComponent(category).trim().toLowerCase();

  const posts = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as any))
    .filter(post => {
      if (post.publishDate && post.publishDate.toDate() > now) return false;
      if (!post.category) return false;
      
      return post.category.trim().toLowerCase() === decodedCategory;
    })
    .map(post => {
      const dateObj = post.publishDate?.toDate() || post.createdAt?.toDate() || new Date();
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const min = String(dateObj.getMinutes()).padStart(2, '0');
      
      return {
        ...post,
        date: `${yyyy}.${mm}.${dd} ${hh}:${min}`
      };
    });

  return { posts, originalCategoryName: decodeURIComponent(category) };
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { originalCategoryName } = await getPostsByCategory(slug);
  
  const title = `${originalCategoryName} 카테고리 | 로보어드바이저 투자 가이드`;
  const description = `${originalCategoryName} 카테고리와 관련된 모든 게시글을 확인해보세요.`;
  const url = `https://robo-advisor.kr/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const VALID_CATEGORIES = [
  '환율', 'etf', '경제기초', '미국증시', '세금', '계산기'
];

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts, originalCategoryName } = await getPostsByCategory(slug);
  
  const decodedCategory = decodeURIComponent(slug).trim().toLowerCase();
  const isValidCategory = VALID_CATEGORIES.includes(decodedCategory);

  if (!isValidCategory) {
    return (
      <MainLayout>
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 text-gray-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">존재하지 않는 카테고리입니다</h1>
          <p className="text-gray-500 mb-8">요청하신 '{originalCategoryName}' 카테고리를 찾을 수 없습니다.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            홈으로 돌아가기
          </a>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {originalCategoryName}
          </h1>
          <p className="text-gray-600">
            해당 카테고리와 관련된 {posts.length}개의 글이 있습니다.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 글이 없습니다</h3>
            <p className="text-gray-500 mb-6">이 카테고리에 아직 작성된 글이 없습니다.</p>
            <a href="/" className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              다른 카테고리 둘러보기
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
