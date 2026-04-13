import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { PostCard } from '@/src/components/PostCard';
import { cache } from 'react';
import { getPostsFromJson } from '@/src/lib/posts';

export const dynamic = 'force-dynamic';

function slugify(tag: string) {
  return encodeURIComponent(tag.trim().replace(/\s+/g, '-'));
}

const getPostsByTagSlug = cache(async (slug: string) => {
  try {
    const allPosts = getPostsFromJson();
    const now = new Date();
    
    let originalTagName = decodeURIComponent(slug).replace(/-/g, ' ');

    const posts = allPosts
      .filter((post: any) => {
        if (post.language === 'en') return false;
        if (!post.publishDate) return true;
        return new Date(post.publishDate) <= now;
      })
      .filter((post: any) => {
        if (!post.tags || !Array.isArray(post.tags)) return false;
        return post.tags.some((tag: string) => {
          if (slugify(tag) === slug) {
            originalTagName = tag;
            return true;
          }
          return false;
        });
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

    return { posts, originalTagName };
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return { posts: [], originalTagName: decodeURIComponent(slug).replace(/-/g, ' ') };
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { originalTagName } = await getPostsByTagSlug(slug);
  
  const title = `#${originalTagName} 태그 검색 결과 | 로보어드바이저 투자 가이드`;
  const description = `${originalTagName} 태그와 관련된 모든 게시글을 확인해보세요.`;
  const url = `https://robo-advisor.kr/tag/${slug}`;

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

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts, originalTagName } = await getPostsByTagSlug(slug);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="w-full mx-auto px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            #{originalTagName}
          </h1>
          <p className="text-gray-600">
            해당 태그와 관련된 {posts.length}개의 글이 있습니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
