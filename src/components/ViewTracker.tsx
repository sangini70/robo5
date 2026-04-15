'use client';

import { useEffect, useRef } from 'react';
<<<<<<< HEAD
export function ViewTracker({ slug }: { slug: string }) {
=======
import { auth } from '../firebase';

export function ViewTracker({ postId }: { postId: string }) {
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const trackView = async () => {
      try {
<<<<<<< HEAD
        // 2. Check localStorage for duplicate views within 12 hours
        const viewKey = `viewed_${slug}`;
=======
        // 1. Check if user is logged in (assume admin if logged in for public pages)
        if (auth.currentUser) {
          return; // Skip tracking for logged-in users (admins)
        }

        // 2. Check localStorage for duplicate views within 12 hours
        const viewKey = `viewed_${postId}`;
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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
<<<<<<< HEAD
          body: JSON.stringify({ slug }),
=======
          body: JSON.stringify({ postId }),
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        });

        // 4. Update localStorage
        localStorage.setItem(viewKey, now.toString());
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    trackView();
<<<<<<< HEAD
  }, [slug]);
=======
  }, [postId]);
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd

  return null;
}
