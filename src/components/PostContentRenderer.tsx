import React from 'react';
import { AdSense } from '@/src/components/AdSense';
import { transformStandaloneYouTubeUrlsToCards } from '@/src/lib/youtube';

interface PostContentRendererProps {
  content: string;
  language?: 'ko' | 'en';
}

type ManualAdSlot = 'content-1' | 'content-2' | 'content-3';

interface ContentBlock {
  html: string;
  textLength: number;
  h2Count: number;
  isProtected: boolean;
}

interface PlannedAdInsertion {
  afterBlockIndex: number;
  slotId: ManualAdSlot;
}

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const MANUAL_AD_SLOTS: ManualAdSlot[] = ['content-1', 'content-2', 'content-3'];

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#34;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtmlTags(value: string) {
  return value.replace(/<!--[\s\S]*?-->|<[^>]*>/g, '');
}

function normalizeText(value: string) {
  return decodeHtmlEntities(value)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countMatches(value: string, pattern: RegExp) {
  return (value.match(pattern) || []).length;
}

function splitRootBlocks(html: string) {
  const tokens = html.match(/<!--[\s\S]*?-->|<\/?[^>]+>|[^<]+/g) || [];
  const blocks: string[] = [];
  let current = '';
  let depth = 0;
  const stack: string[] = [];

  for (const token of tokens) {
    const isComment = token.startsWith('<!--');
    const closingMatch = !isComment ? /^<\s*\/\s*([a-z0-9-]+)/i.exec(token) : null;
    const openingMatch = !isComment ? /^<\s*([a-z0-9-]+)/i.exec(token) : null;
    const tagName = openingMatch?.[1].toLowerCase() || '';
    const selfClosing = !!openingMatch && (/\/\s*>$/.test(token) || VOID_TAGS.has(tagName));

    if (depth === 0 && !current && /^\s*$/.test(token)) {
      continue;
    }

    current += token;

    if (isComment) {
      continue;
    }

    if (closingMatch) {
      const closingTag = closingMatch[1].toLowerCase();

      while (stack.length) {
        const popped = stack.pop();
        depth = Math.max(0, depth - 1);

        if (popped === closingTag) {
          break;
        }
      }

      if (depth === 0 && current.trim()) {
        blocks.push(current);
        current = '';
      }

      continue;
    }

    if (openingMatch && !selfClosing) {
      stack.push(tagName);
      depth += 1;
      continue;
    }

    if (openingMatch && selfClosing && depth === 0 && current.trim()) {
      blocks.push(current);
      current = '';
    }
  }

  if (current.trim()) {
    blocks.push(current);
  }

  if (blocks.length === 1 && countMatches(blocks[0], /<h2\b/gi) > 1) {
    const wrappedContent = unwrapSingleContainerBlock(blocks[0]);

    if (wrappedContent) {
      const nestedBlocks = splitRootBlocks(wrappedContent);
      if (nestedBlocks.length > 1) {
        return nestedBlocks;
      }
    }
  }

  return blocks;
}

function splitSectionBlocksByHeading(html: string) {
  const trimmed = html.trim();
  const headingMatches = [...trimmed.matchAll(/<h2\b/gi)];

  if (headingMatches.length <= 1) {
    return [trimmed];
  }

  const sections: string[] = [];
  let startIndex = 0;

  headingMatches.forEach((match, matchIndex) => {
    const headingIndex = match.index ?? 0;

    if (matchIndex === 0) {
      if (headingIndex > 0) {
        sections.push(trimmed.slice(startIndex, headingIndex).trim());
      }

      startIndex = headingIndex;
      return;
    }

    sections.push(trimmed.slice(startIndex, headingIndex).trim());
    startIndex = headingIndex;
  });

  sections.push(trimmed.slice(startIndex).trim());

  return sections.filter(Boolean);
}

function getFirstHeadingText(html: string) {
  return normalizeText(
    (html.match(/^(?:<!--[\s\S]*?-->\s*)*<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/i)?.[1] || '')
  ).toLowerCase();
}

function unwrapSingleContainerBlock(html: string) {
  const trimmed = html.trim();
  const openTagMatch = /^<\s*(div|section|article|main|footer)\b[^>]*>/i.exec(trimmed);

  if (!openTagMatch) {
    return null;
  }

  const tagName = openTagMatch[1].toLowerCase();
  const openingTag = openTagMatch[0];
  const closingTag = new RegExp(`</\\s*${tagName}\\s*>\\s*$`, 'i');

  if (!closingTag.test(trimmed)) {
    return null;
  }

  return trimmed.slice(openingTag.length, trimmed.replace(closingTag, '').length);
}

function isProtectedAdBoundary(html: string) {
  const trimmedHtml = html.trim();
  const lowerHtml = trimmedHtml.toLowerCase();
  const normalizedText = normalizeText(stripHtmlTags(trimmedHtml)).toLowerCase();
  const firstTagMatch = /^(?:<!--[\s\S]*?-->\s*)*<\s*([a-z0-9-]+)/i.exec(trimmedHtml);
  const firstTagName = firstTagMatch?.[1].toLowerCase() || '';
  const headingText = getFirstHeadingText(trimmedHtml);
  const startsWithProtectedClass =
    lowerHtml.startsWith('<div') ||
    lowerHtml.startsWith('<section') ||
    lowerHtml.startsWith('<footer') ||
    lowerHtml.startsWith('<aside')
      ? /(?:summary-card-container|single-summary-card-container|summary-card-box|summary-box|faq-section|faq-box|card-box|related-posts|related-post|next-post)/i.test(lowerHtml)
      : false;

  const isProtectedHeading =
    (firstTagName === 'h2' || firstTagName === 'h3') &&
    (headingText.includes('frequently asked questions') ||
      headingText.includes('자주 묻는 질문') ||
      headingText.includes('summary') ||
      headingText.includes('요약') ||
      headingText.includes('related posts') ||
      headingText.includes('관련 글') ||
      headingText.includes('next post') ||
      headingText.includes('다음 글'));

  const looksLikeFaqBox =
    normalizedText.includes('q:') &&
    normalizedText.includes('a:') &&
    countMatches(normalizedText, /\bq:/gi) >= 2 &&
    countMatches(normalizedText, /\ba:/gi) >= 2;

  return (
    ['table', 'blockquote', 'pre', 'code', 'iframe', 'img', 'ul', 'ol'].includes(firstTagName) ||
    startsWithProtectedClass ||
    isProtectedHeading ||
    looksLikeFaqBox
  );
}

function isFaqBoundaryBlock(html: string) {
  const trimmedHtml = html.trim();
  if (!trimmedHtml) {
    return false;
  }

  const headingText = getFirstHeadingText(trimmedHtml);
  if (headingText.includes('frequently asked questions') || headingText.includes('자주 묻는 질문')) {
    return true;
  }

  if (trimmedHtml.includes('frequently asked questions') || trimmedHtml.includes('자주 묻는 질문')) {
    return true;
  }

  const normalizedText = normalizeText(stripHtmlTags(trimmedHtml)).toLowerCase();
  return (
    normalizedText.includes('q:') &&
    normalizedText.includes('a:') &&
    countMatches(normalizedText, /\bq:/gi) >= 2 &&
    countMatches(normalizedText, /\ba:/gi) >= 2
  );
}

function buildContentBlocks(html: string): ContentBlock[] {
  return splitRootBlocks(html)
    .flatMap((rootBlockHtml) => {
      const unwrappedHtml = unwrapSingleContainerBlock(rootBlockHtml) ?? rootBlockHtml;
      const sectionBlocks = splitSectionBlocksByHeading(unwrappedHtml);

      return sectionBlocks.flatMap((sectionHtml) => {
        const sectionHeadingText = getFirstHeadingText(sectionHtml);
        const sectionChildren = splitRootBlocks(sectionHtml);
        const sectionH2Count = countMatches(sectionHtml, /<h2\b/gi);
        const isFaqSection = sectionHeadingText.includes('frequently asked questions') || sectionHeadingText.includes('자주 묻는 질문');

        return sectionChildren.map((blockHtml, blockIndex) => {
          const normalizedText = normalizeText(stripHtmlTags(blockHtml));
          const isLastBlockInSection = blockIndex === sectionChildren.length - 1;

          return {
            html: blockHtml,
            textLength: normalizedText.length,
            h2Count: isLastBlockInSection ? sectionH2Count : 0,
            isProtected: isFaqSection || isProtectedAdBoundary(blockHtml),
          };
        });
      });
    })
    .filter((block) => block.html.trim().length > 0);
}

function getManualAdCount(totalTextLength: number, h2Count: number) {
  const lengthCap =
    totalTextLength <= 800 ? 0 : totalTextLength <= 2000 ? 1 : totalTextLength <= 4000 ? 2 : 3;
  const structureCap = Math.min(3, Math.floor(h2Count / 2));

  return Math.min(lengthCap, structureCap);
}

function findAdInsertionCandidate(blocks: ContentBlock[], minimumH2Ordinal: number) {
  let seenH2Count = 0;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (!block.h2Count) {
      continue;
    }

    const blockStartOrdinal = seenH2Count + 1;
    const blockEndOrdinal = seenH2Count + block.h2Count;
    seenH2Count += block.h2Count;

    if (blockEndOrdinal < minimumH2Ordinal) {
      continue;
    }

    if (blockStartOrdinal > minimumH2Ordinal + 1) {
      break;
    }

    const nextBlock = blocks[index + 1];
    const currentHtml = block.html;
    const nextHtml = nextBlock?.html ?? '';
    const hasFaqMarker = /frequently\s+asked\s+questions|자주\s*묻는\s*질문/i;

    if (
      block.isProtected ||
      (nextBlock?.isProtected ?? false) ||
      isFaqBoundaryBlock(block.html) ||
      isFaqBoundaryBlock(nextHtml) ||
      hasFaqMarker.test(currentHtml) ||
      hasFaqMarker.test(nextHtml)
    ) {
      continue;
    }

    return {
      afterBlockIndex: index,
      h2Ordinal: blockEndOrdinal,
    };
  }

  return null;
}

function planManualAdInsertions(blocks: ContentBlock[]): PlannedAdInsertion[] {
  const totalTextLength = blocks.reduce((sum, block) => sum + block.textLength, 0);
  const totalH2Count = blocks.reduce((sum, block) => sum + block.h2Count, 0);
  const maxAds = getManualAdCount(totalTextLength, totalH2Count);

  if (maxAds <= 0) {
    return [];
  }

  const insertions: PlannedAdInsertion[] = [];
  let minimumH2Ordinal = 2;
  let slotIndex = 0;

  while (slotIndex < MANUAL_AD_SLOTS.length && insertions.length < maxAds) {
    const candidate = findAdInsertionCandidate(blocks, minimumH2Ordinal);

    if (!candidate) {
      break;
    }

    insertions.push({
      afterBlockIndex: candidate.afterBlockIndex,
      slotId: MANUAL_AD_SLOTS[slotIndex],
    });

    minimumH2Ordinal = candidate.h2Ordinal + 2;
    slotIndex += 1;
  }

  return insertions;
}

function renderHtmlBlock(blockHtml: string, blockIndex: number) {
  return (
    <div
      key={`content-block-${blockIndex}`}
      className="contents"
      dangerouslySetInnerHTML={{
        __html: blockHtml,
      }}
    />
  );
}

function renderContentWithAds(blocks: ContentBlock[], insertions: PlannedAdInsertion[]) {
  if (!insertions.length) {
    return null;
  }

  const insertionMap = new Map<number, ManualAdSlot>();
  insertions.forEach(({ afterBlockIndex, slotId }) => {
    insertionMap.set(afterBlockIndex, slotId);
  });

  const renderedBlocks: React.ReactNode[] = [];

  blocks.forEach((block, index) => {
    renderedBlocks.push(renderHtmlBlock(block.html, index));

    const slotId = insertionMap.get(index);
    if (slotId) {
      renderedBlocks.push(<AdSense key={`ad-slot-${slotId}-${index}`} slotId={slotId} />);
    }
  });

  return renderedBlocks;
}

export function PostContentRenderer({ content, language = 'ko' }: PostContentRendererProps) {
  const transformedContent = transformStandaloneYouTubeUrlsToCards(content, language);
  const blocks = buildContentBlocks(transformedContent);
  const adInsertions = planManualAdInsertions(blocks);

  if (!adInsertions.length) {
    return (
      <div
        className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]"
        dangerouslySetInnerHTML={{
          __html: transformedContent,
        }}
      />
    );
  }

  const renderedContent = renderContentWithAds(blocks, adInsertions);

  return (
    <div className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]">
      {renderedContent}
    </div>
  );
}
