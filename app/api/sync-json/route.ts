import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log("Starting sync-json process...");
    
    // 1. Fetch all posts to debug and ensure we don't miss anything due to query constraints
    const q = query(collection(db, 'posts'));
    const querySnapshot = await getDocs(q);
    console.log('Total Firestore posts count (all statuses):', querySnapshot.size);
    
    const allFetchedPosts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });

    // Filter for published posts in memory (case-insensitive and handle missing status)
    const publishedPosts = allFetchedPosts.filter((post: any) => {
      const status = (post.status || '').toLowerCase();
      return status === 'published';
    });
    console.log('Published posts count (in-memory filter):', publishedPosts.length);

    if (allFetchedPosts.length > 0 && publishedPosts.length === 0) {
     console.log('Sample of non-published post status:', (allFetchedPosts[0] as any).status);
    }

    const posts = publishedPosts.map((data: any) => {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        shortDescription: data.description || data.shortDescription || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail || '',
        // Fallback for publishDate: use createdAt if publishDate is missing
        publishDate: data.publishDate ? data.publishDate.toDate().toISOString() : 
                     (data.createdAt ? data.createdAt.toDate().toISOString() : null),
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        content: data.content || '',
        seoTitle: data.seoTitle || '',
        seoDescription: data.seoDescription || '',
        language: data.language || 'ko',
        flowType: data.flowType || '',
        postViews: data.postViews || 0,
        dailyViews: data.dailyViews || {}
      };
    });

    // Sort in memory
    posts.sort((a, b) => {
      const dateA = a.publishDate ? new Date(a.publishDate) : new Date(0);
      const dateB = b.publishDate ? new Date(b.publishDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    console.log('Final posts.json count:', posts.length);
    if (posts.length > 0) {
      console.log('First post sample:', JSON.stringify({
        title: posts[0].title,
        slug: posts[0].slug,
        status: publishedPosts[0].status,
        publishDate: posts[0].publishDate
      }));
    }

    console.log(`Fetched ${posts.length} published posts.`);

    const dataDir = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 2. Generate posts.json (legacy/global list)
    const postsFilePath = path.join(dataDir, 'posts.json');
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
    console.log("Generated posts.json");

    // 3. Generate flow-index.json (Category mapping)
    const flowIndex: Record<string, string[]> = {};
    posts.forEach(post => {
      if (post.category && post.language === 'ko') {
        const categoryKey = post.category.trim().toLowerCase();
        if (!flowIndex[categoryKey]) {
          flowIndex[categoryKey] = [];
        }
        if (!flowIndex[categoryKey].includes(post.slug)) {
          flowIndex[categoryKey].push(post.slug);
        }
      }
    });
    
    const flowIndexPath = path.join(dataDir, 'flow-index.json');
    fs.writeFileSync(flowIndexPath, JSON.stringify(flowIndex, null, 2), 'utf8');
    console.log("Generated flow-index.json:", flowIndex);

    // 4. Generate detail JSONs
    const koDetailDir = path.join(dataDir, 'ko', 'detail');
    const enDetailDir = path.join(dataDir, 'en', 'detail');

    if (!fs.existsSync(koDetailDir)) fs.mkdirSync(koDetailDir, { recursive: true });
    if (!fs.existsSync(enDetailDir)) fs.mkdirSync(enDetailDir, { recursive: true });

    posts.forEach(post => {
      const detailDir = post.language === 'en' ? enDetailDir : koDetailDir;
      const detailPath = path.join(detailDir, `${post.slug}.json`);
      fs.writeFileSync(detailPath, JSON.stringify(post, null, 2), 'utf8');
    });
    console.log(`Generated ${posts.length} detail JSON files.`);

    return NextResponse.json({ 
      success: true, 
      count: posts.length,
      flowIndexKeys: Object.keys(flowIndex)
    });
  } catch (error: any) {
    console.error('Error in sync-json:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
