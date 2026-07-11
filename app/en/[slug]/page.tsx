import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MainLayout } from '@/src/components/MainLayout';
import { Sidebar } from '@/src/components/Sidebar';
import { ViewTracker } from '@/src/components/ViewTracker';
import { ShareButtons } from '@/src/components/ShareButtons';
import { PostContentRenderer } from '@/src/components/PostContentRenderer';
import { createBreadcrumbList } from '@/src/lib/breadcrumb';
import { getCategoryDisplayName } from '@/src/lib/category';

export const dynamic = 'force-dynamic';

const BLOCKED_SCHEMA_TYPES = new Set([
  'BlogPosting',
  'Article',
  'Organization',
  'BreadcrumbList',
  'WebPage',
  'ImageObject',
]);

function normalizeSchemaTypes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(normalizeSchemaTypes);
  }

  if (typeof value !== 'string') {
    return [];
  }

  return value
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasBlockedSchemaType(node: any) {
  return normalizeSchemaTypes(node?.['@type']).some((type) => BLOCKED_SCHEMA_TYPES.has(type));
}

function sanitizeStructuredDataJsonLd(rawJsonLd?: string) {
  if (!rawJsonLd || !rawJsonLd.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawJsonLd);

    if (Array.isArray(parsed)) {
      const filtered = parsed.filter((node) => !hasBlockedSchemaType(node));
      return filtered.length > 0 ? JSON.stringify(filtered) : null;
    }

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    if (hasBlockedSchemaType(parsed)) {
      return null;
    }

    if (Array.isArray((parsed as any)['@graph'])) {
      const filteredGraph = (parsed as any)['@graph'].filter((node: any) => !hasBlockedSchemaType(node));
      if (filteredGraph.length === 0) {
        return null;
      }

      return JSON.stringify({
        ...(parsed as Record<string, any>),
        '@graph': filteredGraph,
      });
    }

    return JSON.stringify(parsed);
  } catch {
    return null;
  }
}

async function getEnglishPost(slug: string): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'en', 'detail', `${slug}.json`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const postData = JSON.parse(fileContents);

    if (!postData) {
      return null;
    }

    if (postData.status !== 'published') {
      return null;
    }

    if (postData.publishDate && new Date(postData.publishDate) > new Date()) {
      return null;
    }

    const publishDateObj = postData.publishDate ? new Date(postData.publishDate) : postData.createdAt ? new Date(postData.createdAt) : new Date();
    const updatedAtObj = postData.updatedAt ? new Date(postData.updatedAt) : publishDateObj;

    const formatDateTime = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    };

    return {
      ...postData,
      createdAtStr: formatDateTime(publishDateObj),
      updatedAtStr: formatDateTime(updatedAtObj),
    };
  } catch (error) {
    console.error('Error fetching English post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getEnglishPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.description || post.shortDescription;
  const url = `https://robo-advisor.kr/en/${slug}`;

  return {
    title: `${title} | robo-advisor.kr`,
    description,
    alternates: {
      canonical: url,
      languages: {
        'ko-KR': `https://robo-advisor.kr/${slug}`,
        'en-US': url,
        'x-default': `https://robo-advisor.kr/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'robo-advisor.kr',
      images: post.thumbnail
        ? [
            {
              url: post.thumbnail,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      type: 'article',
      publishedTime: post.publishDate || post.createdAt,
      modifiedTime: post.updatedAt || post.publishDate || post.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function EnglishPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getEnglishPost(slug);

  if (!post) {
    notFound();
  }

  const description = post.seoDescription || post.description || post.shortDescription;
  const categoryLabel = getCategoryDisplayName(post.category, post.categorySlug);
  const sanitizedStructuredDataJsonLd = sanitizeStructuredDataJsonLd(post.structuredDataJsonLd);
  const breadcrumbStructuredData = createBreadcrumbList([
    { name: 'Home', url: 'https://robo-advisor.kr/en' },
    { name: post.title, url: `https://robo-advisor.kr/en/${slug}` },
  ]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://robo-advisor.kr/en/${slug}`,
    },
    headline: post.title,
    description,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: post.publishDate || post.createdAt,
    dateModified: post.updatedAt || post.publishDate || post.createdAt,
    author: {
      '@type': 'Organization',
      name: 'robo-advisor.kr',
      url: 'https://robo-advisor.kr',
    },
    publisher: {
      '@type': 'Organization',
      name: 'robo-advisor.kr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://robo-advisor.kr/logo.png',
      },
    },
  };

  return (
    <MainLayout>
      <ViewTracker slug={post.slug} />
      {post.customCss && <style dangerouslySetInnerHTML={{ __html: post.customCss }} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {sanitizedStructuredDataJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitizedStructuredDataJsonLd }}
        />
      )}

      <div className="w-full mx-auto px-6 lg:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
          <article className="lg:col-span-8 max-w-[840px]">
            <header className="mb-10 lg:mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">{categoryLabel}</span>
                <span className="w-8 h-[1px] bg-gray-300"></span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-500 font-light">
                  <time dateTime={post.createdAtStr}>?묒꽦?? {post.createdAtStr}</time>
                  {post.createdAtStr !== post.updatedAtStr && (
                    <>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <time dateTime={post.updatedAtStr}>理쒖쥌 ?낅뜲?댄듃: {post.updatedAtStr}</time>
                    </>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-gray-600 font-light leading-relaxed">{post.description}</p>

              <ShareButtons
                url={`https://robo-advisor.kr/en/${slug}`}
                title={post.title}
                description={description}
                thumbnail={post.thumbnail}
              />
            </header>

            {post.thumbnail && (
              <div className="w-full aspect-[21/9] rounded-sm overflow-hidden mb-12 lg:mb-14 bg-gray-100 relative">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border border-black/5"></div>
              </div>
            )}

            <PostContentRenderer content={post.content} language={post.language} />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 lg:mt-14 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
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
            <Sidebar currentPostId={post.id} currentCategory={categoryLabel} />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
