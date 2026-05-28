import { HomeContent } from '@/src/components/HomeContent';
import { getPostsFromJson } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

function normalizeHomePosts(posts: any[]) {
  return [...posts]
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
        description: post.description || post.excerpt || '',
        date: `${yyyy}.${mm}.${dd} ${hh}:${min}`,
      };
    });
}

export default function Home() {
  const posts = normalizeHomePosts(getPostsFromJson());

  return <HomeContent page={1} initialPosts={posts} />;
}
