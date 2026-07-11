import React from 'react';
import { transformStandaloneYouTubeUrlsToCards } from '@/src/lib/youtube';

interface PostContentRendererProps {
  content: string;
  language?: 'ko' | 'en';
}

export function PostContentRenderer({ content, language = 'ko' }: PostContentRendererProps) {
  return (
    <div
      className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]"
      dangerouslySetInnerHTML={{
        __html: transformStandaloneYouTubeUrlsToCards(content, language),
      }}
    />
  );
}
