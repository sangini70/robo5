import { NextResponse } from 'next/server';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';

const INTERACTIONS_FILE = path.join(process.cwd(), 'public', 'data', 'interactions.json');

export async function POST(request: Request) {
  try {
    const { slug, type } = await request.json();
    if (!slug || !type) return NextResponse.json({ error: 'Slug and type are required' }, { status: 400 });

    const dir = path.dirname(INTERACTIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let interactions: Record<string, Record<string, number>> = {};
    if (fs.existsSync(INTERACTIONS_FILE)) {
      interactions = JSON.parse(fs.readFileSync(INTERACTIONS_FILE, 'utf8'));
    }

    if (!interactions[slug]) interactions[slug] = {};
    interactions[slug][type] = (interactions[slug][type] || 0) + 1;
    
    fs.writeFileSync(INTERACTIONS_FILE, JSON.stringify(interactions, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
=======
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/src/firebase';

export async function POST(request: Request) {
  let type = 'unknown';
  try {
    const body = await request.json();
    const postId = body.postId;
    type = body.type;

    if (!postId || !type) {
      return NextResponse.json({ error: 'Post ID and type are required' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (type === 'impression') {
      await updateDoc(doc(db, 'posts', postId), {
        impressions: increment(1),
        [`dailyImpressions.${today}`]: increment(1)
      });
    } else if (type === 'click') {
      await updateDoc(doc(db, 'posts', postId), {
        clicks: increment(1),
        [`dailyClicks.${today}`]: increment(1)
      });
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to track ${type}:`, error);
    return NextResponse.json({ error: `Failed to track ${type}` }, { status: 500 });
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  }
}
