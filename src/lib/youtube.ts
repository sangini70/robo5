type YouTubeLanguage = 'ko' | 'en';

const YOUTUBE_COPY = {
  ko: {
    relatedVideo: '관련 영상',
    watchOnYouTube: 'YouTube에서 보기',
    brandLabel: 'YouTube',
  },
  en: {
    relatedVideo: 'Related video',
    watchOnYouTube: 'Watch on YouTube',
    brandLabel: 'YouTube',
  },
} as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, '\'')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function normalizeHost(hostname: string) {
  return hostname.toLowerCase().replace(/^www\./, '');
}

function isValidYouTubeVideoId(videoId: string | null | undefined) {
  return !!videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId);
}

export function extractYouTubeVideoId(rawUrl: string) {
  const cleaned = decodeHtmlEntities(rawUrl).trim();

  if (!cleaned) {
    return null;
  }

  try {
    const parsedUrl = new URL(cleaned);
    const host = normalizeHost(parsedUrl.hostname);

    if (host === 'youtu.be') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0] || null;
      return isValidYouTubeVideoId(videoId) ? videoId : null;
    }

    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      if (parsedUrl.pathname === '/watch' || parsedUrl.pathname === '/watch/') {
        const videoId = parsedUrl.searchParams.get('v');
        return isValidYouTubeVideoId(videoId) ? videoId : null;
      }
    }
  } catch {
    // Fall through to the string pattern below.
  }

  const shorthandMatch = cleaned.match(/^https?:\/\/(?:www\.)?youtu\.be\/([A-Za-z0-9_-]{11})(?:[?&/#].*)?$/i);
  if (shorthandMatch) {
    return shorthandMatch[1];
  }

  const watchMatch = cleaned.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{11})(?:[&#].*)?$/i);
  if (watchMatch) {
    return watchMatch[1];
  }

  return null;
}

function buildYouTubeCardHtml(videoId: string, videoUrl: string, language: YouTubeLanguage) {
  const copy = YOUTUBE_COPY[language];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return `
    <div class="not-prose my-8 w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener noreferrer" class="group block">
        <div class="relative aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src="${escapeHtml(thumbnailUrl)}"
            alt="${escapeHtml(copy.relatedVideo)}"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg transition-transform duration-300 group-hover:scale-105">
              <svg class="ml-0.5 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-4">
          <div class="min-w-0">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">${escapeHtml(copy.relatedVideo)}</p>
            <p class="mt-1 truncate text-sm font-medium text-gray-900">${escapeHtml(copy.watchOnYouTube)}</p>
          </div>
          <span class="shrink-0 text-sm font-medium text-gray-500 transition-colors group-hover:text-red-500">
            ${escapeHtml(copy.brandLabel)}
          </span>
        </div>
      </a>
    </div>
  `;
}

export function transformStandaloneYouTubeUrlsToCards(html: string, language: YouTubeLanguage = 'ko') {
  if (!html || !html.includes('<p')) {
    return html;
  }

  return html.replace(/<p>([\s\S]*?)<\/p>/gi, (match, innerHtml: string) => {
    if (/[<>\n\r]/.test(innerHtml)) {
      return match;
    }

    const cleanedText = decodeHtmlEntities(innerHtml).replace(/\u00a0/g, ' ').trim();
    const videoId = extractYouTubeVideoId(cleanedText);

    if (!videoId) {
      return match;
    }

    const normalizedVideoUrl = cleanedText.startsWith('https://')
      ? cleanedText
      : `https://${cleanedText.replace(/^\/\//, '')}`;

    return buildYouTubeCardHtml(videoId, normalizedVideoUrl, language);
  });
}
