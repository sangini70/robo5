import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    // Fetch all published posts
    const q = query(collection(db, 'posts'), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const posts: MetadataRoute.Sitemap = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const updatedAt = data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date();
      return {
        url: `${baseUrl}/${data.slug}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    });

    return [...staticPages, ...posts];
  } catch (error) {
    console.error('sitemap generation failed (possibly due to Firestore quota):', error);
    return staticPages;
  }
}
