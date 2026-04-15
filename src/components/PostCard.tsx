'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
=======
import { auth } from '../firebase';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const hasTrackedImpression = useRef(false);

  useEffect(() => {
    if (!post.id || hasTrackedImpression.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackImpression();
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Track when 50% of the card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [post.id]);

  const trackImpression = async () => {
    if (hasTrackedImpression.current) return;
    hasTrackedImpression.current = true;

    try {
<<<<<<< HEAD
      // Skip tracking for admins
      if (typeof window !== 'undefined' && sessionStorage.getItem('admin_unlocked') === 'true') {
        return;
=======
      if (auth.currentUser) {
        return; // Skip tracking for logged-in users (admins)
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      }

      const impKey = `imp_${post.id}`;
      const lastImp = localStorage.getItem(impKey);
      const now = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;

      if (lastImp && (now - parseInt(lastImp, 10)) < TWELVE_HOURS) return;

      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
<<<<<<< HEAD
        body: JSON.stringify({ slug: post.slug, type: 'impression' }),
=======
        body: JSON.stringify({ postId: post.id, type: 'impression' }),
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      });

      localStorage.setItem(impKey, now.toString());
    } catch (error) {
      console.error('Failed to track impression:', error);
    }
  };

  const trackClick = async () => {
    try {
<<<<<<< HEAD
      // Skip tracking for admins
      if (typeof window !== 'undefined' && sessionStorage.getItem('admin_unlocked') === 'true') {
        return;
=======
      if (auth.currentUser) {
        return; // Skip tracking for logged-in users (admins)
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      }

      const clickKey = `click_${post.id}`;
      const lastClick = localStorage.getItem(clickKey);
      const now = Date.now();
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;

      if (lastClick && (now - parseInt(lastClick, 10)) < TWELVE_HOURS) return;

      await fetch('/api/track-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
<<<<<<< HEAD
        body: JSON.stringify({ slug: post.slug, type: 'click' }),
=======
        body: JSON.stringify({ postId: post.id, type: 'click' }),
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      });

      localStorage.setItem(clickKey, now.toString());
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  return (
    <article ref={cardRef} className="group cursor-pointer flex flex-col">
      <Link href={`/${post.slug}`} onClick={trackClick} className="block w-full aspect-[4/3] bg-gray-100 overflow-hidden mb-6 relative rounded-sm">
        {post.thumbnail && (
          <img 
            src={post.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="text-xl font-medium tracking-tight text-gray-900 group-hover:text-black transition-colors line-clamp-2">
          <Link href={`/${post.slug}`} onClick={trackClick}>
            {post.title}
          </Link>
        </h3>
        <span className="text-xs text-gray-500 font-medium tracking-[0.2em] uppercase shrink-0 mt-1">
          {post.category}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2 mb-4">
        {post.description}
      </p>
      
      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {post.tags && post.tags.map((tag: string) => (
            <Link 
              key={tag} 
              href={`/tag/${encodeURIComponent(tag.trim().replace(/\s+/g, '-'))}`}
              className="text-xs text-gray-400 hover:text-gray-900 transition-colors focus:outline-none focus:underline active:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              #{tag}
            </Link>
          ))}
        </div>
        <time dateTime={post.date} className="text-xs text-gray-400 font-light">
          {post.date}
        </time>
      </div>
    </article>
  );
}
