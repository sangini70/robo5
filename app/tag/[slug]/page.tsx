import { Metadata } from 'next';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { PostCard } from '@/src/components/PostCard';
import { cache } from 'react';

function slugify(tag: string) {
  return encodeURIComponent(tag.trim().replace(/\s+/g, '-'));
}

const getPostsByTagSlug = cache(async (slug: string) => {
  const q = query(
    collection(db, 'posts'),
    where('status', '==', 'published'),
    orderBy('publishDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const now = new Date();
  
  const posts = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as any))
    .filter(post => {
      if (post.publishDate && post.publishDate.toDate() > now) return false;
      if (!post.tags || !Array.isArray(post.tags)) return false;
      
      // Check if any tag slugifies to the requested slug
      return post.tags.some((tag: string) => slugify(tag) === slug);
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

  // Find the original tag name for display
  let originalTagName = decodeURIComponent(slug).replace(/-/g, ' ');
  for (const post of posts) {
    const matchedTag = post.tags.find((tag: string) => slugify(tag) === slug);
    if (matchedTag) {
      originalTagName = matchedTag;
      break;
    }
  }

  return { posts, originalTagName };
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
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            #{originalTagName}
          </h1>
          <p className="text-gray-600">
            해당 태그와 관련된 {posts.length}개의 글이 있습니다.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
