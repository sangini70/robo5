'use client';

import { useEffect, useRef } from 'react';
import { auth } from '../firebase';

export function ViewTracker({ postId }: { postId: string }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
        // 1. Check if user is logged in (assume admin if logged in for public pages)
        if (auth.currentUser) {
          return; // Skip tracking for logged-in users (admins)
        }

        // 2. Check localStorage for duplicate views within 12 hours
        const viewKey = `viewed_${postId}`;
        const lastViewed = localStorage.getItem(viewKey);
        const now = Date.now();
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (lastViewed && (now - parseInt(lastViewed, 10)) < TWELVE_HOURS) {
          return; // Skip if viewed within 12 hours
        }

        // 3. Call API to increment view count
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
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
