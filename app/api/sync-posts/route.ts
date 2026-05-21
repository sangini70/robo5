import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/src/firebase';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const q = query(collection(db, 'posts'), where('status', '==', 'published'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription || data.description || '',
        description: data.description || '',
        category: data.category || '',
        tags: data.tags || [],
        thumbnail: data.thumbnail || '',
        publishDate: data.publishDate ? data.publishDate.toDate().toISOString() : null,
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

    const dirPath = path.join(process.cwd(), 'public', 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    const filePath = path.join(dirPath, 'posts.json');
    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), 'utf8');

    return NextResponse.json({ success: true, count: posts.length });
  } catch (error: any) {
    console.error('Error syncing posts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
