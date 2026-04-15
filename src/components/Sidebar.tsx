import Link from 'next/link';
import { getPostsFromJson } from '@/src/lib/posts';
import { PopularPostsWidget } from './PopularPostsWidget';

async function getLatestPosts(excludeId?: string) {
  try {
    const allPosts = getPostsFromJson();
    const now = new Date();
    
    const posts = allPosts
      .filter((post: any) => {
        if (post.language === 'en') return false;
        if (post.id === excludeId) return false;
        if (!post.publishDate) return true;
        return new Date(post.publishDate) <= now;
      })
      .sort((a: any, b: any) => {
        const dateA = a.publishDate ? new Date(a.publishDate) : a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.publishDate ? new Date(b.publishDate) : b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4);
      
    return posts;
  } catch (error) {
    console.error('Error fetching latest posts for sidebar:', error);
    return [];
  }
}

async function getRelatedPosts(category?: string, excludeId?: string) {
  if (!category) return [];
  try {
    const allPosts = getPostsFromJson();
    const now = new Date();
    
    const posts = allPosts
      .filter((post: any) => {
        if (post.language === 'en') return false;
        if (post.id === excludeId) return false;
        if (post.category !== category) return false;
        if (!post.publishDate) return true;
        return new Date(post.publishDate) <= now;
      })
      .sort((a: any, b: any) => {
        const dateA = a.publishDate ? new Date(a.publishDate) : a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.publishDate ? new Date(b.publishDate) : b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4);
      
    return posts;
  } catch (error) {
    console.error('Error fetching related posts for sidebar:', error);
    return [];
  }
}

const formatDateTime = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

export async function Sidebar({ currentPostId, currentCategory }: { currentPostId?: string, currentCategory?: string }) {
  const latestPosts = await getLatestPosts(currentPostId);
  const relatedPosts = await getRelatedPosts(currentCategory, currentPostId);

  return (
    <div className="flex flex-col gap-8">
      {/* Calculator Widget CTA */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>
        <div className="relative z-10">
          <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold tracking-widest uppercase rounded-sm mb-3">
            Utility
          </span>
          <h3 className="text-lg font-bold text-indigo-900 mb-2 leading-tight">
            실속 환율 계산기
          </h3>
          <p className="text-sm text-indigo-700 mb-4 leading-relaxed">
            실제 환전 구조(수수료·우대율)를 반영한 진짜 체감 환율을 지금 바로 확인해보세요.
          </p>
          <Link 
            href="/exchange-rate-calculator" 
            className="block w-full text-center bg-indigo-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
          >
            계산기 바로가기 &rarr;
          </Link>
        </div>
      </div>

      {/* Popular Posts Widget */}
      <PopularPostsWidget currentPostId={currentPostId} />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <h3 className="text-sm font-medium tracking-widest uppercase text-gray-900 mb-4 border-b border-gray-100 pb-2">관련 글</h3>
          <ul className="space-y-4">
            {relatedPosts.map(post => (
<<<<<<< HEAD
              <li key={post.slug || post.id}>
=======
              <li key={post.id}>
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
                <Link href={`/${post.slug}`} className="group block">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
<<<<<<< HEAD
                    {post.publishDate ? formatDateTime(new Date(post.publishDate)) : (post.createdAt ? formatDateTime(new Date(post.createdAt)) : (post.date ? post.date : ''))}
=======
                    {post.publishDate ? formatDateTime(post.publishDate.toDate()) : (post.createdAt ? formatDateTime(post.createdAt.toDate()) : '')}
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-sm p-6">
          <h3 className="text-sm font-medium tracking-widest uppercase text-gray-900 mb-4 border-b border-gray-100 pb-2">최신 글</h3>
          <ul className="space-y-4">
            {latestPosts.map(post => (
<<<<<<< HEAD
              <li key={post.slug || post.id}>
=======
              <li key={post.id}>
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
                <Link href={`/${post.slug}`} className="group block">
                  <h4 className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
<<<<<<< HEAD
                    {post.publishDate ? formatDateTime(new Date(post.publishDate)) : (post.createdAt ? formatDateTime(new Date(post.createdAt)) : (post.date ? post.date : ''))}
=======
                    {post.publishDate ? formatDateTime(post.publishDate.toDate()) : (post.createdAt ? formatDateTime(post.createdAt.toDate()) : '')}
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ad/Widget Placeholder */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-6 flex flex-col items-center justify-center min-h-[250px]">
        <span className="text-xs text-gray-400 uppercase tracking-widest mb-2">Advertisement</span>
        <div className="text-gray-300 text-sm text-center">
          광고 또는 위젯 영역<br/>(추후 삽입)
        </div>
      </div>
    </div>
  );
}
