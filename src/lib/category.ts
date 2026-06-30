const CATEGORY_LABEL_ALIASES: Array<{ label: string; aliases: string[] }> = [
  { label: '환율', aliases: ['환율'] },
  { label: 'ETF', aliases: ['ETF'] },
  { label: '경제기초', aliases: ['경제기초', '경제 기초'] },
  { label: '미국증시', aliases: ['미국증시'] },
  { label: '세금', aliases: ['세금', '세금/지원금'] },
];

function normalizeCategoryLabel(value: string) {
  return value.replace(/\s+/g, '').toLowerCase();
}

export function getCategoryDisplayName(category?: string, categorySlug?: string) {
  const candidates = [categorySlug, category].filter(
    (value): value is string => typeof value === 'string' && value.trim().length > 0,
  );

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeCategoryLabel(candidate);
    for (const entry of CATEGORY_LABEL_ALIASES) {
      if (entry.aliases.some((alias) => normalizeCategoryLabel(alias) === normalizedCandidate)) {
        return entry.label;
      }
    }
  }

  return candidates[0]?.replace(/\s+/g, '') ?? '';
}
