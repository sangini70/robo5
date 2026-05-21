import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { PostCard } from '@/src/components/PostCard';
import { cache } from 'react';
import { getFlowIndex, getPostDetail } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

const getPostsByCategory = cache(async (category: string) => {
  try {
    const decodedCategory = decodeURIComponent(category).trim().toLowerCase();
    console.log("category slug:", decodedCategory);
    
    // 1. Get slugs from flow-index.json
    const flowIndex = getFlowIndex();
    const slugs = flowIndex[decodedCategory] || [];
    console.log("flow index slugs:", slugs);
    
    // 2. Fetch details for each slug
    const now = new Date();
    const fetchedPosts = slugs
      .map((slug: string) => getPostDetail(slug))
      .filter((post: any) => {
        if (!post) return false;
        // Basic filtering (published status is already handled by sync-json, but we check date)
        if (!post.publishDate) return true;
        return new Date(post.publishDate) <= now;
      })
      .sort((a: any, b: any) => {
        const dateA = a.publishDate ? new Date(a.publishDate) : a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.publishDate ? new Date(b.publishDate) : b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .map((post: any) => {
        const dateObj = post.publishDate ? new Date(post.publishDate) : post.createdAt ? new Date(post.createdAt) : new Date();
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

    console.log("fetched posts:", fetchedPosts.length);

    // Try to get the original category name from the first post if available
    const originalCategoryName = fetchedPosts.length > 0 ? fetchedPosts[0].category : decodeURIComponent(category);

    return { posts: fetchedPosts, originalCategoryName };
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return { posts: [], originalCategoryName: decodeURIComponent(category) };
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { originalCategoryName } = await getPostsByCategory(slug);
  
  const title = `${originalCategoryName} 移댄뀒怨좊━ | 濡쒕낫?대뱶諛붿씠? ?ъ옄 媛?대뱶`;
  const description = `${originalCategoryName} 移댄뀒怨좊━? 愿?⑤맂 紐⑤뱺 寃뚯떆湲???뺤씤?대낫?몄슂.`;
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts, originalCategoryName } = await getPostsByCategory(slug);
  
  return (
    <MainLayout>
      <div className="w-full mx-auto px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {originalCategoryName}
          </h1>
          <p className="text-gray-600">
            ?대떦 移댄뀒怨좊━? 愿?⑤맂 {posts.length}媛쒖쓽 湲???덉뒿?덈떎.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">?깅줉??湲???놁뒿?덈떎</h3>
            <p className="text-gray-500 mb-6">??移댄뀒怨좊━???꾩쭅 ?묒꽦??湲???놁뒿?덈떎.</p>
            <a href="/" className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              ?ㅻⅨ 移댄뀒怨좊━ ?섎윭蹂닿린
            </a>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

