import { NextResponse } from 'next/server';
import { adminDb } from '@/src/firebase-admin';
import fs from 'fs';
import path from 'path';

async function syncPosts() {
  console.log("Starting sync-json process...");
  
  // 1. Fetch all published posts using firebase-admin
  try {
    const querySnapshot = await adminDb.collection('posts')
      .where('status', '==', 'published')
      .orderBy('publishDate', 'desc')
      .get();
    
    const posts = querySnapshot.docs.map(doc => {
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
      publishDate: data.publishDate ? (data.publishDate.toDate ? data.publishDate.toDate().toISOString() : data.publishDate) : null,
      createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : null,
      updatedAt: data.updatedAt ? (data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt) : null,
      content: data.content || '',
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      language: data.language || 'ko',
      flowType: data.flowType || '',
      postViews: data.postViews || 0,
      dailyViews: data.dailyViews || {}
    };
  });

  console.log(`Fetched ${posts.length} published posts.`);

  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 2. Generate posts.json
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
  console.log("Generated flow-index.json");

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

  return posts.length;
  } catch (err: any) {
    console.error('Firestore Fetch Error in syncPosts:', err);
    throw err;
  }
}

export async function GET() {
  try {
    const count = await syncPosts();
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Error in sync-json GET:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const count = await syncPosts();
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('Error in sync-json POST:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
