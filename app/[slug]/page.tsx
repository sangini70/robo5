import { Metadata } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { Sidebar } from '@/src/components/Sidebar';
import { ViewTracker } from '@/src/components/ViewTracker';
import { ShareButtons } from '@/src/components/ShareButtons';
import Link from 'next/link';

// Fetch post data
async function getPost(slug: string) {
  const q = query(collection(db, 'posts'), where('slug', '==', slug), where('status', '==', 'published'));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const postData = querySnapshot.docs[0].data() as any;
  
  if (postData.publishDate && postData.publishDate.toDate() > new Date()) {
    return null;
  }
  
  const publishDateObj = postData.publishDate?.toDate() || postData.createdAt?.toDate() || new Date();
  const updatedAtObj = postData.updatedAt?.toDate() || publishDateObj;

  const formatDateTime = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  };

  return {
    id: querySnapshot.docs[0].id,
    ...postData,
    createdAtStr: formatDateTime(publishDateObj),
    updatedAtStr: formatDateTime(updatedAtObj),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description || post.shortDescription;

  return {
    title: `${title} | robo-advisor.kr`,
    description: description,
    alternates: {
      canonical: `https://robo-advisor.kr/${slug}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://robo-advisor.kr/${slug}`,
      siteName: 'robo-advisor.kr',
      images: post.thumbnail ? [
        {
          url: post.thumbnail,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      type: 'article',
      publishedTime: post.createdAt?.toDate()?.toISOString(),
      modifiedTime: post.updatedAt?.toDate()?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  // Check if post is related to exchange rates
  const exchangeKeywords = ['환율', '환전', '달러', '엔화', '유로', 'exchange', 'currency'];
  const isExchangeRelated = exchangeKeywords.some(keyword => 
    post.title?.includes(keyword) || 
    post.category?.includes(keyword) || 
    (post.tags && post.tags.some((t: string) => t.includes(keyword)))
  );

  const description = post.seoDescription || post.description || post.shortDescription;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://robo-advisor.kr/${slug}`
    },
    "headline": post.title,
    "description": description,
    "image": post.thumbnail ? [post.thumbnail] : [],
    "datePublished": post.createdAt?.toDate()?.toISOString(),
    "dateModified": post.updatedAt?.toDate()?.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "robo-advisor.kr",
      "url": "https://robo-advisor.kr"
    },
    "publisher": {
      "@type": "Organization",
      "name": "robo-advisor.kr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://robo-advisor.kr/logo.png"
      }
    }
  };

  return (
    <MainLayout maxWidth="max-w-[1200px]">
      <ViewTracker postId={post.id} />
      {post.customCss && <style dangerouslySetInnerHTML={{ __html: post.customCss }} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {post.structuredDataJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: post.structuredDataJsonLd }}
        />
      )}
      
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">{post.category || ''}</span>
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 font-light">
                  <time dateTime={post.createdAtStr}>작성일: {post.createdAtStr}</time>
                  {post.createdAtStr !== post.updatedAtStr && (
                    <>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <time dateTime={post.updatedAtStr}>최종 업데이트: {post.updatedAtStr}</time>
                    </>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">{post.title}</h1>
              <p className="text-lg text-gray-600 font-light leading-relaxed">{post.description}</p>
              
              <ShareButtons 
                url={`https://robo-advisor.kr/${slug}`}
                title={post.title}
                description={description}
                thumbnail={post.thumbnail}
              />
            </header>

            {post.thumbnail && (
              <div className="w-full aspect-[21/9] rounded-sm overflow-hidden mb-16 bg-gray-100 relative">
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 border border-black/5"></div>
              </div>
            )}

            {isExchangeRelated && (
              <div className="mb-10 p-6 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-indigo-900 mb-1">💱 실시간 체감 환율이 궁금하신가요?</h3>
                  <p className="text-sm text-indigo-700">실제 환전 구조(수수료·우대율)를 반영한 진짜 환율을 계산해보세요.</p>
                </div>
                <Link 
                  href="/exchange-rate-calculator" 
                  className="shrink-0 bg-indigo-600 text-white text-sm font-medium py-2.5 px-6 rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  실속 환율 계산기 &rarr;
                </Link>
              </div>
            )}

            <div 
              className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]"
              dangerouslySetInnerHTML={{ 
                __html: post.content
              }}
            />

            {isExchangeRelated && (
              <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">환전 수수료, 얼마나 아낄 수 있을까?</h3>
                <p className="text-gray-600 mb-6">
                  복잡한 환율 우대율 계산, 이제 직접 하지 마세요.<br />
                  실속 환율 계산기로 내가 내야 할 진짜 금액을 바로 확인하세요.
                </p>
                <Link 
                  href="/exchange-rate-calculator" 
                  className="inline-block bg-gray-900 text-white font-medium py-3 px-8 rounded-md hover:bg-gray-800 transition-colors shadow-sm"
                >
                  환율 계산기 바로가기
                </Link>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
                {post.tags.map((tag: string) => (
                  <Link 
                    key={tag} 
                    href={`/tag/${encodeURIComponent(tag.trim().replace(/\s+/g, '-'))}`}
                    className="text-xs font-medium tracking-widest uppercase text-gray-500 border border-gray-200 px-3 py-1.5 rounded-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 active:bg-gray-100 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </article>

          <aside className="lg:col-span-4 sticky top-24 h-fit">
            <Sidebar currentPostId={post.id} currentCategory={post.category} />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
