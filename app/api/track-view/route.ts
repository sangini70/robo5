import { NextResponse } from 'next/server';
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
  }
}
