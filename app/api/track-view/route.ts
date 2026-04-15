import { NextResponse } from 'next/server';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'public', 'data', 'views.json');
const MASTER_FILE = path.join(process.cwd(), 'public', 'data', 'posts-master.json');

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const dir = path.dirname(VIEWS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let views: Record<string, number> = {};
    if (fs.existsSync(VIEWS_FILE)) {
      views = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf8'));
    }

    views[slug] = (views[slug] || 0) + 1;
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf8');

    // Also update master file if it exists (optional, maybe better to do periodically)
    if (fs.existsSync(MASTER_FILE)) {
      const posts = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
      const postIndex = posts.findIndex((p: any) => p.slug === slug);
      if (postIndex !== -1) {
        posts[postIndex].postViews = (posts[postIndex].postViews || 0) + 1;
        fs.writeFileSync(MASTER_FILE, JSON.stringify(posts, null, 2), 'utf8');
      }
    }

    return NextResponse.json({ success: true, views: views[slug] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
=======
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';

export async function POST(request: Request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    await updateDoc(doc(db, 'posts', postId), {
      postViews: increment(1),
      [`dailyViews.${today}`]: increment(1)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to increment view count:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  }
}
