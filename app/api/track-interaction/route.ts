import { NextResponse } from 'next/server';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/src/firebase';

export async function POST(request: Request) {
  try {
    const { postId, type } = await request.json();

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
   console.error('Failed to track:', error);
   return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}
