'use client';

import { useEffect, useRef } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export function ViewTracker({ postId }: { postId: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
        // 1. Check if user is admin
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            return; // Skip tracking for admins
          }
        }

        // 2. Check localStorage for duplicate views within 12 hours
        const viewKey = `viewed_${postId}`;
        const lastViewed = localStorage.getItem(viewKey);
        const now = Date.now();
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (lastViewed && (now - parseInt(lastViewed, 10)) < TWELVE_HOURS) {
          return; // Skip if viewed within 12 hours
        }

        // 3. Increment view count and daily view count
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        await updateDoc(doc(db, 'posts', postId), {
          postViews: increment(1),
          [`dailyViews.${today}`]: increment(1)
        });

        // 4. Update localStorage
        localStorage.setItem(viewKey, now.toString());
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    trackView();
  }, [postId]);

  return null;
}
