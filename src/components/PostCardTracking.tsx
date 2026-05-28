'use client';

import { useEffect, useRef } from 'react';

interface PostCardTrackingProps {
  postId: string | number | undefined;
  trackingId: string;
  slug: string;
}

export function PostCardTracking({ postId, trackingId, slug }: PostCardTrackingProps) {
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    if (!postId || hasTrackedImpression.current) return;

    const article = document.getElementById(trackingId);
    if (!article) return;

    const trackImpression = async () => {
      if (hasTrackedImpression.current) return;
      hasTrackedImpression.current = true;

      try {
        if (typeof window !== 'undefined' && sessionStorage.getItem('admin_unlocked') === 'true') {
          return;
        }

        const impKey = `imp_${postId}`;
        const lastImp = localStorage.getItem(impKey);
        const now = Date.now();
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (lastImp && (now - parseInt(lastImp, 10)) < TWELVE_HOURS) return;

        await fetch('/api/track-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, type: 'impression' }),
        });

        localStorage.setItem(impKey, now.toString());
      } catch (error) {
        console.error('Failed to track impression:', error);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackImpression();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(article);

    const trackClick = async () => {
      try {
        if (typeof window !== 'undefined' && sessionStorage.getItem('admin_unlocked') === 'true') {
          return;
        }

        const clickKey = `click_${postId}`;
        const lastClick = localStorage.getItem(clickKey);
        const now = Date.now();
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        if (lastClick && (now - parseInt(lastClick, 10)) < TWELVE_HOURS) return;

        await fetch('/api/track-interaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId, type: 'click' }),
        });

        localStorage.setItem(clickKey, now.toString());
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href !== `/${slug}`) return;

      trackClick();
    };

    article.addEventListener('click', handleClick, true);

    return () => {
      observer.disconnect();
      article.removeEventListener('click', handleClick, true);
    };
  }, [postId, slug, trackingId]);

  return null;
}
