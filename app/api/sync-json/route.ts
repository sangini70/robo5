import { NextResponse } from 'next/server';
import { adminDb } from '@/src/firebase-admin';
import firebaseConfig from '@/firebase-applet-config.json';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    console.log("Starting sync-json process with firebase-admin...");
    console.log("Admin Config:", JSON.stringify({
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId
    }));

    // 1. Fetch published posts using admin SDK
    try {
      const allPostsSnap = await adminDb.collection('posts').limit(5).get();
      console.log(`Debug: Total posts in collection (limit 5): ${allPostsSnap.size}`);
      if (allPostsSnap.size > 0) {
        console.log(`Debug: First post status: "${allPostsSnap.docs[0].data().status}"`);
      }
    } catch (debugErr: any) {
      console.error("Debug fetch failed:", debugErr.message);
    }

    const postsSnapshot = await adminDb.collection('posts')
      .where('status', '==', 'published')
      .get();
    
    console.log(`Found ${postsSnapshot.size} published posts.`);
    
    const posts = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        shortDescription: data.description || data.shortDescription || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail || '',
        // Fallback for publishDate: use createdAt if publishDate is missing
        publishDate: data.publishDate && typeof data.publishDate.toDate === 'function' 
          ? data.publishDate.toDate().toISOString() 
          : (data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : null),
        createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? data.updatedAt.toDate().toISOString() : null,
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
      config: {
        projectId: firebaseConfig.projectId,
        databaseId: firebaseConfig.firestoreDatabaseId
      },
      flowIndexKeys: Object.keys(flowIndex)
    });
  } catch (error: any) {
    console.error('Error in sync-json:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
