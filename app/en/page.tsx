import { Metadata } from 'next';
import { MainLayout } from '@/src/components/MainLayout';
import { PostCard } from '@/src/components/PostCard';
import { getPostsFromJson } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'English Posts | robo-advisor.kr',
  description: 'Read our latest financial guides and market updates in English.',
};

async function getEnglishPosts() {
  try {
    const allPosts = getPostsFromJson();
    const now = new Date();
    
    const posts = allPosts
      .filter((post: any) => {
        if (post.language !== 'en') return false;
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

    return posts;
  } catch (error) {
    console.error('Error fetching English posts:', error);
    return [];
  }
}

export default async function EnglishPage() {
  const posts = await getEnglishPosts();

  return (
    <MainLayout>
      <div className="w-full mx-auto px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            English Posts
          </h1>
          <p className="text-gray-600">
            Latest financial guides and market updates in English.
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500">English posts are coming soon.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
