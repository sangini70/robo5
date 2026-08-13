export type SearchIndex = {
  title: string[];
  slug: string[];
  tokens: string[];
};

function normalizeText(value: unknown, preserveHyphen = false) {
  if (typeof value !== 'string') {
    return '';
  }

  const specialCharacterPattern = preserveHyphen ? /[^\p{L}\p{N}\s-]/gu : /[^\p{L}\p{N}\s]/gu;

  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(specialCharacterPattern, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildPrefixTokens(value: string) {
  const characters = Array.from(value);
  return characters.map((_, index) => characters.slice(0, index + 1).join(''));
}

function buildTitleTokens(title: unknown) {
  const normalizedTitle = normalizeText(title);
  if (!normalizedTitle) {
    return [];
  }

  return normalizedTitle
    .split(' ')
    .flatMap((word) => buildPrefixTokens(word));
}

function buildSlugTokens(slug: unknown) {
  const normalizedSlug = normalizeText(slug, true);
  if (!normalizedSlug) {
    return [];
  }

  return normalizedSlug
    .split('-')
    .filter(Boolean)
    .flatMap((segment) => buildPrefixTokens(segment));
}

export function buildSearchIndex(title: unknown, slug: unknown): SearchIndex {
  const titleTokens = buildTitleTokens(title);
  const slugTokens = buildSlugTokens(slug);
  const tokens = Array.from(new Set([...titleTokens, ...slugTokens]));

  return {
    title: titleTokens,
    slug: slugTokens,
    tokens,
  };
}

export function buildSearchToken(value: unknown) {
  return normalizeText(value, true);
}
