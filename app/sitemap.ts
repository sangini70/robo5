import { MetadataRoute } from 'next';
import { getPostsFromJson } from '@/src/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://robo-advisor.kr';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/exchange-rate-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    const allPosts = getPostsFromJson();
    const now = new Date();
    
    const publishedPosts = allPosts.filter((post: any) => {
      if (!post.publishDate) return true;
      return new Date(post.publishDate) <= now;
    });
    
    const posts: MetadataRoute.Sitemap = publishedPosts.map((post: any) => {
      const updatedAt = post.updatedAt ? new Date(post.updatedAt) : post.createdAt ? new Date(post.createdAt) : new Date();
      return {
        url: `${baseUrl}/${post.slug}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    return [...staticPages, ...posts];
  } catch (error) {
    console.error('sitemap generation failed:', error);
    return staticPages;
  }
}
