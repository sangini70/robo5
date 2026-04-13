import { NextResponse } from 'next/server';
import { adminDb } from '@/src/firebase-admin';
import firebaseConfig from '@/firebase-applet-config.json';
import fs from 'fs';
import path from 'path';

async function handleSync() {
  try {
    console.log("Starting sync-json process with firebase-admin...");
    console.log("Admin Config:", JSON.stringify({
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId
    }));

    // 1. Fetch ALL posts using admin SDK to debug
    let postsSnapshot;
    let collectionIds: string[] = [];
    try {
      const collections = await adminDb.listCollections();
      collectionIds = collections.map(c => c.id);
      console.log("Available collections:", collectionIds);

      postsSnapshot = await adminDb.collection('posts').get();
      console.log(`Admin fetch: Found ${postsSnapshot.size} total posts in 'posts' collection.`);
    } catch (fetchErr: any) {
      console.error("Admin fetch failed:", fetchErr.message);
      return NextResponse.json({ 
        success: false, 
        error: `Admin fetch failed: ${fetchErr.message}`,
        debug: {
          projectId: firebaseConfig.projectId,
          databaseId: firebaseConfig.firestoreDatabaseId
        }
      }, { status: 500 });
    }
    
    const allDocs = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const statuses = [...new Set(allDocs.map((p: any) => p.status))];
    console.log("Statuses present in DB:", statuses);

    // Filter for published posts in memory to be 100% sure
    const publishedPosts = allDocs.filter((p: any) => 
      p.status === 'published' || p.status === 'Published'
    );
    
    console.log(`Filtered to ${publishedPosts.length} published posts.`);
    
    if (publishedPosts.length === 0 && allDocs.length > 0) {
      console.log("CRITICAL DEBUG: No published posts found. Sample of raw data from Firestore:");
      allDocs.slice(0, 5).forEach(d => {
        console.log(`ID: ${d.id}, Status: "${d.status}", Title: "${d.title}", Keys: ${Object.keys(d).join(', ')}`);
      });
    }
    
    const posts = publishedPosts.map(data => {
      // Helper to convert Firestore Timestamp to ISO string
      const toISO = (val: any) => {
        if (val && typeof val.toDate === 'function') return val.toDate().toISOString();
        if (val instanceof Date) return val.toISOString();
        return val;
      };

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
        publishDate: toISO(data.publishDate) || toISO(data.createdAt) || new Date().toISOString(),
        createdAt: toISO(data.createdAt) || new Date().toISOString(),
        updatedAt: toISO(data.updatedAt) || new Date().toISOString(),
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
      debug: {
        totalInCollection: postsSnapshot.size,
        statusesFound: statuses,
        collections: collectionIds,
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

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}
