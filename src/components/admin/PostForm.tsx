import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import DOMPurify from 'dompurify';
import { RichTextEditor } from './RichTextEditor';

interface PostFormProps {
  initialData?: any;
  postId?: string;
}

type OptimizationStatus = '충족' | '검토' | '누락';

type OptimizationCheck = {
  status: OptimizationStatus;
  detail: string;
  count?: number;
};

type OptimizationAnalysis = {
  mainKeyword: OptimizationCheck;
  title: OptimizationCheck;
  seoTitle: OptimizationCheck;
  seoDescription: OptimizationCheck;
  firstParagraph: OptimizationCheck;
  headings: OptimizationCheck;
  bodyUsage: OptimizationCheck;
  repetition: OptimizationCheck;
};

type PlannerMetaField =
  | 'title'
  | 'slug'
  | 'status'
  | 'mainKeyword'
  | 'secondaryKeywords'
  | 'searchIntent'
  | 'category'
  | 'categorySlug'
  | 'seoTitle'
  | 'seoDescription'
  | 'description'
  | 'tags';

type PlannerMetaValues = Partial<Record<PlannerMetaField, string>>;

type PlannerMetaApplyState = {
  kind: 'idle' | 'success' | 'warning' | 'error';
  message: string;
  appliedLabels: string[];
  missingLabels: string[];
  appliedCount: number;
};

const PLANNER_META_FIELD_MAP: Record<string, PlannerMetaField> = {
  TITLE: 'title',
  SLUG: 'slug',
  'POST STATUS': 'status',
  'POST URL': 'slug',
  'MAIN KEYWORD': 'mainKeyword',
  'SECONDARY KEYWORDS': 'secondaryKeywords',
  'SEARCH INTENT': 'searchIntent',
  CATEGORY: 'category',
  'CATEGORY SLUG': 'categorySlug',
  'SEO TITLE': 'seoTitle',
  'META DESCRIPTION': 'seoDescription',
  EXCERPT: 'description',
  TAGS: 'tags',
};

const PLANNER_META_IGNORED_LABELS = new Set([
  'SCHEMA TYPE',
  'HUB ANCHOR TEXT',
  'INTERNAL LINK URLS',
]);

const PLANNER_META_DISPLAY_ORDER: Array<{
  field: PlannerMetaField;
  label: string;
  required?: boolean;
}> = [
  { field: 'title', label: 'TITLE', required: true },
  { field: 'slug', label: 'SLUG', required: true },
  { field: 'mainKeyword', label: 'MAIN KEYWORD', required: true },
  { field: 'secondaryKeywords', label: 'SECONDARY KEYWORDS' },
  { field: 'searchIntent', label: 'SEARCH INTENT' },
  { field: 'category', label: 'CATEGORY', required: true },
  { field: 'categorySlug', label: 'CATEGORY SLUG' },
  { field: 'status', label: 'POST STATUS' },
  { field: 'seoTitle', label: 'SEO TITLE' },
  { field: 'seoDescription', label: 'META DESCRIPTION' },
  { field: 'description', label: 'EXCERPT' },
  { field: 'tags', label: 'TAGS' },
];

const PLANNER_META_LABELS = [
  'CATEGORY SLUG',
  'SECONDARY KEYWORDS',
  'SEARCH INTENT',
  'META DESCRIPTION',
  'HUB ANCHOR TEXT',
  'INTERNAL LINK URLS',
  'POST STATUS',
  'POST URL',
  'MAIN KEYWORD',
  'SEO TITLE',
  'SCHEMA TYPE',
  'EXCERPT',
  'CATEGORY',
  'TITLE',
  'SLUG',
  'TAGS',
];

const SEARCH_INTENT_OPTIONS = [
  { value: '', label: '선택 안함' },
  { value: 'informational', label: '정보형' },
  { value: 'definition', label: '정의형' },
  { value: 'comparison', label: '비교형' },
  { value: 'problem-solving', label: '문제 해결형' },
  { value: 'decision', label: '의사결정형' },
] as const;

const OPTIMIZATION_IGNORED_SELECTOR = [
  'table',
  'thead',
  'tbody',
  'tfoot',
  'nav',
  'aside',
  'blockquote',
  'figure',
  'script',
  'style',
  'iframe',
  'noscript',
  'template',
  '[data-toc]',
  '.toc',
  '.table-of-contents',
  '.faq',
  '.faq-item',
  '.notice-box',
  '.info-box',
  '.guide-box',
  '.callout',
  '.tip-box',
].join(', ');

function normalizeOptimizationText(value: string) {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function splitOptimizationKeywords(value: string) {
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function countExactKeywordOccurrences(text: string, keyword: string) {
  const normalizedText = normalizeOptimizationText(text);
  const normalizedKeyword = normalizeOptimizationText(keyword);

  if (!normalizedText || !normalizedKeyword) {
    return 0;
  }

  let count = 0;
  let index = 0;

  while (index !== -1) {
    index = normalizedText.indexOf(normalizedKeyword, index);
    if (index === -1) {
      break;
    }
    count += 1;
    index += normalizedKeyword.length;
  }

  return count;
}

function createOptimizationCheck(status: OptimizationStatus, detail: string, count?: number): OptimizationCheck {
  return { status, detail, count };
}

function getEmptyOptimizationAnalysis(): OptimizationAnalysis {
  const neutral = createOptimizationCheck('검토', '키워드 입력 후 점검됩니다.');
  return {
    mainKeyword: createOptimizationCheck('누락', '메인 키워드를 입력해 주세요.'),
    title: neutral,
    seoTitle: neutral,
    seoDescription: neutral,
    firstParagraph: neutral,
    headings: neutral,
    bodyUsage: createOptimizationCheck('검토', '본문 사용 횟수를 계산합니다.', 0),
    repetition: createOptimizationCheck('검토', '반복 경고를 계산합니다.', 0),
  };
}

function analyzeContentOptimization(params: {
  title: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  mainKeyword: string;
  secondaryKeywords: string;
}): OptimizationAnalysis {
  const title = normalizeOptimizationText(params.title);
  const seoTitle = normalizeOptimizationText(params.seoTitle);
  const seoDescription = normalizeOptimizationText(params.seoDescription);
  const mainKeyword = normalizeOptimizationText(params.mainKeyword);
  const secondaryKeywords = splitOptimizationKeywords(params.secondaryKeywords).map((keyword) =>
    normalizeOptimizationText(keyword)
  );

  if (!params.content || typeof DOMParser === 'undefined') {
    const mainKeywordStatus: OptimizationStatus = mainKeyword ? '충족' : '누락';
    return {
      mainKeyword: createOptimizationCheck(mainKeywordStatus, mainKeyword ? '메인 키워드가 설정되어 있습니다.' : '메인 키워드를 입력해 주세요.'),
      title: createOptimizationCheck(mainKeyword ? '검토' : '검토', '본문 편집 후 자동 점검됩니다.'),
      seoTitle: createOptimizationCheck(mainKeyword ? '검토' : '검토', '본문 편집 후 자동 점검됩니다.'),
      seoDescription: createOptimizationCheck(mainKeyword ? '검토' : '검토', '본문 편집 후 자동 점검됩니다.'),
      firstParagraph: createOptimizationCheck(mainKeyword ? '검토' : '검토', '본문 편집 후 자동 점검됩니다.'),
      headings: createOptimizationCheck(mainKeyword ? '검토' : '검토', '본문 편집 후 자동 점검됩니다.'),
      bodyUsage: createOptimizationCheck('검토', '본문 사용 횟수를 계산합니다.', 0),
      repetition: createOptimizationCheck('검토', '반복 경고를 계산합니다.', 0),
    };
  }

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(
    `<div data-optimization-root="true">${params.content || ''}</div>`,
    'text/html'
  );
  const root = parsedDocument.body.querySelector('[data-optimization-root="true"]');

  if (!root) {
    return getEmptyOptimizationAnalysis();
  }

  const cleanedRoot = root.cloneNode(true) as HTMLElement;
  cleanedRoot.querySelectorAll('script, style, iframe, noscript, template').forEach((node) => node.remove());
  cleanedRoot.querySelectorAll(OPTIMIZATION_IGNORED_SELECTOR).forEach((node) => node.remove());

  const bodyText = normalizeOptimizationText(cleanedRoot.textContent || '');
  const paragraphs = Array.from(root.querySelectorAll('p'))
    .filter((paragraph) => {
      const element = paragraph as HTMLElement;
      const text = normalizeOptimizationText(element.textContent || '');
      return Boolean(text) && !element.closest(OPTIMIZATION_IGNORED_SELECTOR);
    })
    .map((paragraph) => normalizeOptimizationText((paragraph as HTMLElement).textContent || ''))
    .filter(Boolean);

  const headings = Array.from(root.querySelectorAll('h2, h3'))
    .filter((heading) => {
      const element = heading as HTMLElement;
      const text = normalizeOptimizationText(element.textContent || '');
      return Boolean(text) && !element.closest(OPTIMIZATION_IGNORED_SELECTOR);
    })
    .map((heading) => normalizeOptimizationText((heading as HTMLElement).textContent || ''))
    .filter(Boolean);

  const firstParagraph = paragraphs[0] || '';
  const bodyCount = mainKeyword ? countExactKeywordOccurrences(bodyText, mainKeyword) : 0;
  const mainKeywordHitsInHeadings = headings.some((heading) => heading.includes(mainKeyword));
  const secondaryKeywordHitsInHeadings = secondaryKeywords.some((keyword) =>
    headings.some((heading) => heading.includes(keyword))
  );

  const titleStatus: OptimizationStatus = !title ? '누락' : mainKeyword && title.includes(mainKeyword) ? '충족' : '검토';
  const seoTitleStatus: OptimizationStatus = !seoTitle
    ? '누락'
    : mainKeyword && seoTitle.includes(mainKeyword)
      ? '충족'
      : '검토';
  const seoDescriptionStatus: OptimizationStatus = !seoDescription
    ? '누락'
    : mainKeyword && seoDescription.includes(mainKeyword)
      ? '충족'
      : '검토';
  const firstParagraphStatus: OptimizationStatus = !firstParagraph
    ? '누락'
    : mainKeyword && firstParagraph.includes(mainKeyword)
      ? '충족'
      : '검토';
  const headingsStatus: OptimizationStatus = !headings.length
    ? '누락'
    : (mainKeywordHitsInHeadings || secondaryKeywordHitsInHeadings)
      ? '충족'
      : '검토';

  const bodyUsageStatus: OptimizationStatus = !bodyText
    ? '누락'
    : !mainKeyword
      ? '검토'
      : bodyCount === 0
        ? '검토'
        : bodyCount >= 5
          ? '검토'
          : '충족';

  const repetitionStatus: OptimizationStatus = !bodyText
    ? '누락'
    : !mainKeyword
      ? '검토'
      : bodyCount >= 5
        ? '검토'
        : '충족';

  return {
    mainKeyword: createOptimizationCheck(
      mainKeyword ? '충족' : '누락',
      mainKeyword ? '메인 키워드가 설정되어 있습니다.' : '메인 키워드를 입력해 주세요.'
    ),
    title: createOptimizationCheck(titleStatus, title ? '제목을 점검했습니다.' : '제목이 비어 있습니다.'),
    seoTitle: createOptimizationCheck(seoTitleStatus, seoTitle ? 'SEO 제목을 점검했습니다.' : 'SEO 제목이 비어 있습니다.'),
    seoDescription: createOptimizationCheck(
      seoDescriptionStatus,
      seoDescription ? 'SEO 설명을 점검했습니다.' : 'SEO 설명이 비어 있습니다.'
    ),
    firstParagraph: createOptimizationCheck(
      firstParagraphStatus,
      firstParagraph ? '첫 문단을 점검했습니다.' : '첫 문단이 없습니다.'
    ),
    headings: createOptimizationCheck(
      headingsStatus,
      headings.length ? 'H2/H3를 점검했습니다.' : 'H2/H3가 없습니다.'
    ),
    bodyUsage: createOptimizationCheck(
      bodyUsageStatus,
      mainKeyword ? `정확 일치 ${bodyCount}회` : '메인 키워드 입력 후 횟수를 계산합니다.',
      bodyCount
    ),
    repetition: createOptimizationCheck(
      repetitionStatus,
      mainKeyword
        ? bodyCount >= 5
          ? '반복이 많아 검토가 필요합니다.'
          : '반복 과다로 보이지 않습니다.'
        : '메인 키워드 입력 후 반복을 계산합니다.',
      bodyCount
    ),
  };
}

function getOptimizationBadgeClass(status: OptimizationStatus) {
  switch (status) {
    case '충족':
      return 'bg-emerald-100 text-emerald-700';
    case '검토':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-rose-100 text-rose-700';
  }
}

function extractPlannerMetaBlock(text: string) {
  const startMarker = '[PLANNER POST META 시작]';
  const endMarker = '[PLANNER POST META 종료]';
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  return text.slice(startIndex + startMarker.length, endIndex);
}

function stripPlannerDecorations(line: string) {
  return line
    .replace(/^\s*[-*•]+\s*/, '')
    .replace(/^#{1,6}\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .trim();
}

function normalizePlannerIntent(value: string) {
  const normalized = value.trim().toLowerCase();

  const lookup: Record<string, string> = {
    informational: 'informational',
    정보형: 'informational',
    definition: 'definition',
    정의형: 'definition',
    comparison: 'comparison',
    비교형: 'comparison',
    'problem-solving': 'problem-solving',
    'problem solving': 'problem-solving',
    '문제 해결형': 'problem-solving',
    decision: 'decision',
    의사결정형: 'decision',
  };

  return lookup[normalized] || '';
}

function normalizePlannerStatus(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return '';

  const lookup: Record<string, string> = {
    draft: 'draft',
    임시저장: 'draft',
    임시: 'draft',
    published: 'published',
    발행: 'published',
    공개: 'published',
  };

  return lookup[normalized] || '';
}

function normalizePlannerSlug(value: string) {
  const raw = value.trim();
  if (!raw) return '';

  try {
    if (/^https?:\/\//i.test(raw)) {
      const url = new URL(raw);
      const segments = url.pathname.split('/').filter(Boolean);
      return (segments[segments.length - 1] || '').trim();
    }
  } catch {
    // Fall through to plain text normalization.
  }

  return raw
    .replace(/^\/+|\/+$/g, '')
    .trim();
}

function normalizePlannerTags(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(', ');
}

function parsePlannerMeta(text: string) {
  const block = extractPlannerMetaBlock(text);
  const values: PlannerMetaValues = {};

  if (!block) {
    return { values, found: false };
  }

  const lines = block.split(/\r?\n/);
  let currentField: PlannerMetaField | null = null;
  let ignoringField = false;
  let currentParts: string[] = [];

  const commitCurrentField = () => {
    if (!currentField) return;
    const value = currentParts.join(' ').trim();
    if (value) {
      values[currentField] = value;
    }
    currentField = null;
    currentParts = [];
  };

  for (const rawLine of lines) {
    const line = stripPlannerDecorations(rawLine);
    if (!line) continue;

    const upperLine = line.toUpperCase();
    const matchedLabel = PLANNER_META_LABELS.find((label) => {
      return upperLine === label || upperLine.startsWith(`${label}:`);
    });

    if (matchedLabel) {
      commitCurrentField();
      ignoringField = false;

      const field = PLANNER_META_FIELD_MAP[matchedLabel];
      const inlineValue = line.slice(matchedLabel.length).replace(/^:\s*/, '').trim();

      if (field && !PLANNER_META_IGNORED_LABELS.has(matchedLabel)) {
        currentField = field;
        currentParts = [];
        if (inlineValue) {
          values[field] = inlineValue;
          currentField = null;
        }
      } else {
        currentField = null;
        currentParts = [];
        ignoringField = true;
      }
      continue;
    }

    if (currentField) {
      currentParts.push(line);
    } else if (ignoringField) {
      continue;
    }
  }

  commitCurrentField();

  if (values.searchIntent) {
    values.searchIntent = normalizePlannerIntent(values.searchIntent);
  }

  if (values.status) {
    values.status = normalizePlannerStatus(values.status);
  }

  if (values.slug) {
    values.slug = normalizePlannerSlug(values.slug);
  }

  if (values.tags) {
    values.tags = normalizePlannerTags(values.tags);
  }

  return { values, found: true };
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const contentEditorContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '?섏쑉',
    categorySlug: '',
    tags: '',
    thumbnail: '',
    status: 'draft',
    publishDate: '',
    mainKeyword: '',
    secondaryKeywords: '',
    searchIntent: '',
    seoTitle: '',
    seoDescription: '',
    customCss: '',
    customJs: '',
    structuredDataJsonLd: '',
    flowType: '',
    language: 'ko',
  });
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [titleHistory, setTitleHistory] = useState<any[]>([]);
  const [optimizationAnalysis, setOptimizationAnalysis] = useState<OptimizationAnalysis>(getEmptyOptimizationAnalysis());
  const [plannerMetaOpen, setPlannerMetaOpen] = useState(false);
  const [plannerMetaText, setPlannerMetaText] = useState('');
  const [plannerMetaResult, setPlannerMetaResult] = useState<PlannerMetaApplyState | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (initialData) {
      setOriginalTitle(initialData.title || '');
      setTitleHistory(initialData.titleHistory || []);
      const rawPublishDate = initialData.publishDate;
      const publishDateValue = rawPublishDate
        ? (typeof rawPublishDate?.toDate === 'function' ? rawPublishDate.toDate() : new Date(rawPublishDate))
        : null;
      const normalizedPublishDate = publishDateValue && !Number.isNaN(publishDateValue.getTime())
        ? new Date(publishDateValue.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16)
        : '';
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        content: initialData.content || '',
        category: initialData.category || '?섏쑉',
        categorySlug: initialData.categorySlug || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        thumbnail: initialData.thumbnail || '',
        status: initialData.status || 'draft',
        publishDate: normalizedPublishDate,
        mainKeyword: initialData.mainKeyword || '',
        secondaryKeywords: Array.isArray(initialData.secondaryKeywords)
          ? initialData.secondaryKeywords.join(', ')
          : initialData.secondaryKeywords || '',
        searchIntent: initialData.searchIntent || '',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
        customCss: initialData.customCss || '',
        customJs: initialData.customJs || '',
        structuredDataJsonLd: initialData.structuredDataJsonLd || '',
        flowType: initialData.flowType || '',
        language: initialData.language || 'ko',
      });
      if (initialData.status === 'published' && publishDateValue && publishDateValue > new Date()) {
        setPublishMode('schedule');
      }
    }
  }, [initialData]);

  useEffect(() => {
    setOptimizationAnalysis(
      analyzeContentOptimization({
        title: formData.title,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        content: formData.content,
        mainKeyword: formData.mainKeyword,
        secondaryKeywords: formData.secondaryKeywords,
      })
    );
  }, [
    formData.title,
    formData.seoTitle,
    formData.seoDescription,
    formData.content,
    formData.mainKeyword,
    formData.secondaryKeywords,
  ]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => {
      // Only auto-generate slug if it's a new post and user hasn't manually edited slug much
      if (!postId && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        return { ...prev, title, slug: generateSlug(title) };
      }
      return { ...prev, title };
    });
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return;
    try {
      const response = await fetch('/api/admin/posts', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('게시글 목록을 불러오지 못했습니다.');
      }
      const posts = await response.json();
      const isDuplicate = Array.isArray(posts)
        ? posts.some((doc: any) => doc.slug === slug && doc.id !== postId)
        : false;
      if (isDuplicate) {
        setSlugError('이미 사용 중인 슬러그입니다.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData(prev => ({ ...prev, slug }));
    checkSlugAvailability(slug);
  };

  const handleSlugBlur = () => {
    checkSlugAvailability(formData.slug);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlannerMetaApply = () => {
    const parsed = parsePlannerMeta(plannerMetaText);
    const entries = Object.entries(parsed.values) as Array<[PlannerMetaField, string]>;

    if (!parsed.found) {
      setPlannerMetaResult({
        kind: 'error',
        message: 'PLANNER POST META를 찾을 수 없습니다.',
        appliedLabels: [],
        missingLabels: [],
        appliedCount: 0,
      });
      return;
    }

    if (entries.length === 0) {
      setPlannerMetaResult({
        kind: 'error',
        message: '적용할 항목이 없습니다.',
        appliedLabels: [],
        missingLabels: [],
        appliedCount: 0,
      });
      return;
    }

    const nextFormData: Record<string, string> = {};
    const changedSlugs: string[] = [];

    setFormData(prev => {
      const nextState = { ...prev };

      for (const [field, value] of entries) {
        const trimmedValue = value.trim();
        if (!trimmedValue) continue;
        nextState[field] = trimmedValue;
        if (field === 'slug') {
          changedSlugs.push(trimmedValue);
        }
        nextFormData[field] = trimmedValue;
      }

      return nextState;
    });

    if (changedSlugs[0]) {
      checkSlugAvailability(changedSlugs[0]);
    }

    const appliedLabels = PLANNER_META_DISPLAY_ORDER
      .filter(({ field }) => Boolean(nextFormData[field]?.trim()))
      .map(({ label }) => label);

    const missingLabels = PLANNER_META_DISPLAY_ORDER
      .filter(({ field, required }) => required && !nextFormData[field]?.trim())
      .map(({ label }) => label);

    setPlannerMetaResult({
      kind: missingLabels.length ? 'warning' : 'success',
      message: missingLabels.length
        ? '누락된 항목이 있습니다.'
        : 'PLANNER META 적용 완료',
      appliedLabels,
      missingLabels,
      appliedCount: appliedLabels.length,
    });
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const getLatestEditorContent = () => {
    const editorContainer = contentEditorContainerRef.current;
    if (!editorContainer) return formData.content;

    const activeElement = document.activeElement as HTMLElement | null;
    if (activeElement && editorContainer.contains(activeElement) && activeElement.isContentEditable) {
      return activeElement.innerHTML;
    }

    const contentEditable = editorContainer.querySelector<HTMLElement>('[contenteditable]');
    if (contentEditable) return contentEditable.innerHTML;

    const textarea = editorContainer.querySelector<HTMLTextAreaElement>('textarea');
    if (textarea) return textarea.value;

    return formData.content;
  };

  const cleanHtmlContent = (content: string, customJs: string, customCss: string, jsonLd: string) => {
    let html = content;

    // 1. Remove JS wrappers
    const wrapperRegex = /(?:export\s+const\s+\w+\s*=\s*(?:\{\s*content\s*:\s*)?|const\s+\w+\s*=\s*)`([\s\S]*?)`(?:[\s\S]*)/;
    const match = html.match(wrapperRegex);
    if (match) {
      html = match[1];
    }

    // 2. Remove citations like [cite: 1] or [cite: 1, 2]
    html = html.replace(/\[cite:[^\]]+\]/gi, '');

    // 3. Remove markdown code blocks and backticks
    html = html.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
    html = html.replace(/`/g, '');

    // 4. Extract scripts and styles
    let newCustomJs = customJs || '';
    let newStructuredDataJsonLd = jsonLd || '';
    let newCustomCss = customCss || '';
    
    // Extract application/ld+json
    const ldJsonRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    html = html.replace(ldJsonRegex, (match, scriptContent) => {
      newStructuredDataJsonLd += (newStructuredDataJsonLd ? '\n' : '') + scriptContent.trim();
      return '';
    });

    // Extract other scripts
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    html = html.replace(scriptRegex, (match, scriptContent) => {
      newCustomJs += (newCustomJs ? '\n' : '') + scriptContent.trim();
      return '';
    });

    // Extract styles
    const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    html = html.replace(styleRegex, (match, styleContent) => {
      newCustomCss += (newCustomCss ? '\n' : '') + styleContent.trim();
      return '';
    });

    return {
      content: html.trim(),
      customJs: newCustomJs,
      structuredDataJsonLd: newStructuredDataJsonLd,
      customCss: newCustomCss
    };
  };

  const handleCleanHtml = () => {
    const cleaned = cleanHtmlContent(formData.content, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
    setFormData(prev => ({ ...prev, ...cleaned }));
    showToast('HTML을 정리하고 스크립트/스타일을 추출했습니다.');
  };

  const handlePreview = () => {
    const cleaned = cleanHtmlContent(formData.content, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
    setFormData(prev => ({ ...prev, ...cleaned }));
    setShowPreview(true);
  };

  const normalizeJsonDateValue = (value: any) => {
    if (!value) return null;
    if (typeof value?.toDate === 'function') return value.toDate().toISOString();
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return value;
    return null;
  };

  const buildJsonPostPayload = (sourcePostData: any, currentMode: 'create' | 'edit') => {
    const jsonPayload = { ...sourcePostData };
    const publishDateValue = normalizeJsonDateValue(sourcePostData.publishDate) || (
      formData.status === 'published'
        ? (publishMode === 'schedule' && formData.publishDate
          ? new Date(`${formData.publishDate}+09:00`).toISOString()
          : new Date().toISOString())
        : null
    );
    const createdAtValue = currentMode === 'edit'
      ? (normalizeJsonDateValue(initialData?.createdAt) || normalizeJsonDateValue(sourcePostData.createdAt))
      : (normalizeJsonDateValue(sourcePostData.createdAt) || new Date().toISOString());

    if (publishDateValue) {
      jsonPayload.publishDate = publishDateValue;
    } else {
      delete jsonPayload.publishDate;
    }

    if (createdAtValue) {
      jsonPayload.createdAt = createdAtValue;
    } else {
      delete jsonPayload.createdAt;
    }

    jsonPayload.updatedAt = new Date().toISOString();
    return jsonPayload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) {
      showToast('슬러그 오류를 확인해 주세요.');
      return;
    }
    if (formData.flowType === '') {
      showToast('플로우 타입을 선택하세요');
      return;
    }
    setLoading(true);

    try {
      const latestContent = getLatestEditorContent();
      if (latestContent !== formData.content) {
        setFormData(prev => ({ ...prev, content: latestContent }));
      }
      const cleaned = cleanHtmlContent(latestContent, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
      console.log('POST CONTENT DEBUG', {
        latestContent,
        cleanedContent: cleaned.content,
      });
      setFormData(prev => ({ ...prev, ...cleaned }));

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const existingPublishDateValue = normalizeJsonDateValue(initialData?.publishDate);

      let publishTimestamp = existingPublishDateValue;
      let publishHour: number | null = null;
      if (!publishTimestamp && formData.status === 'published') {
        if (publishMode === 'schedule' && formData.publishDate) {
          const kstDate = new Date(`${formData.publishDate}+09:00`);
          publishTimestamp = kstDate.toISOString();
          publishHour = kstDate.getHours();
        } else {
          publishTimestamp = new Date().toISOString();
          const now = new Date();
          const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
          publishHour = kstNow.getUTCHours();
        }
      }

      const titleHistoryValue = postId
        ? (originalTitle && originalTitle !== formData.title
          ? [
              ...titleHistory,
              {
                oldTitle: originalTitle,
                newTitle: formData.title,
                changedAt: new Date().toISOString(),
              },
            ]
          : titleHistory)
        : [];

      const postData: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: cleaned.content,
        category: formData.category,
        categorySlug: formData.categorySlug,
        tags: tagsArray,
        thumbnail: formData.thumbnail,
        status: formData.status,
        publishDate: publishTimestamp,
        mainKeyword: formData.mainKeyword.trim(),
        secondaryKeywords: splitOptimizationKeywords(formData.secondaryKeywords),
        searchIntent: formData.searchIntent,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        customCss: cleaned.customCss,
        customJs: cleaned.customJs,
        structuredDataJsonLd: cleaned.structuredDataJsonLd,
        flowType: formData.flowType,
        language: formData.language,
        authorId: auth.currentUser?.uid,
        updatedAt: new Date().toISOString(),
        titleHistory: titleHistoryValue,
      };

      if (publishHour !== null) {
        postData.publishHour = publishHour;
      }

      const mode = postId ? 'edit' : 'create';
      const path = '/api/admin/posts';
      const jsonPayload = buildJsonPostPayload(postData, mode);
      const savePayload = postId
        ? { ...jsonPayload, id: postId }
        : {
            ...jsonPayload,
            titleHistory: [],
            postViews: 0,
            impressions: 0,
            clicks: 0,
            googleIndexStatus: 'none',
            naverIndexStatus: 'none',
          };

      console.log("POST SAVE DEBUG", {
        mode,
        id: postId || null,
        slug: formData.slug,
        path,
        firestorePath: postId ? `posts/${postId}` : 'posts/<generated-id>',
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        payloadKeys: Object.keys(savePayload),
      });

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savePayload),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || '게시글 저장에 실패했습니다.');
      }

      const successMessage = result?.published === false
        ? '게시글 저장 완료! 공개 반영은 수동입니다.'
        : '게시글 저장 완료!';
      showToast(successMessage);
      if (result?.nextStep) {
        console.warn('PUBLISH NEXT STEP:', result.nextStep);
      }
      router.push('/admin/posts');
    } catch (error: any) {
      console.error("Error saving post:", error);
      showToast(`저장 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 text-gray-900 font-sans">
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Left Column: Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="Post Title"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <button
              type="button"
              onClick={handleCleanHtml}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Clean HTML & Extract Scripts
            </button>
          </div>
          <div ref={contentEditorContainerRef}>
            <RichTextEditor value={formData.content} onChange={handleContentChange} />
          </div>
        </div>
      </div>

      {/* Right Column: Settings */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Publish Settings</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="draft">Draft (임시저장)</option>
              <option value="published">Published (발행)</option>
            </select>
          </div>

          {formData.status === 'published' && (
            <div className="mt-2 space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishMode"
                    checked={publishMode === 'now'}
                    onChange={() => setPublishMode('now')}
                    className="text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">지금 발행</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishMode"
                    checked={publishMode === 'schedule'}
                    onChange={() => {
                      setPublishMode('schedule');
                      if (!formData.publishDate) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const randomHour = Math.floor(Math.random() * 14) + 8; // 8 to 21
                        const randomMinute = Math.floor(Math.random() * 60);
                        tomorrow.setHours(randomHour, randomMinute, 0, 0);
                        
                        const yyyy = tomorrow.getFullYear();
                        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                        const dd = String(tomorrow.getDate()).padStart(2, '0');
                        const hh = String(tomorrow.getHours()).padStart(2, '0');
                        const min = String(tomorrow.getMinutes()).padStart(2, '0');
                        setFormData(prev => ({ ...prev, publishDate: `${yyyy}-${mm}-${dd}T${hh}:${min}` }));
                      }
                    }}
                    className="text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">예약 발행</span>
                </label>
              </div>

              {publishMode === 'schedule' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">예약 발행 시간 (대한민국 시간)</label>
                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required={publishMode === 'schedule'}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={loading || !!slugError}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Post Details</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              onBlur={handleSlugBlur}
              required
              className={`w-full bg-white border ${slugError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'} rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
              placeholder="my-post-slug"
            />
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
            <p className="text-xs text-gray-400 mt-1">예: my-first-post (공백 대신 하이픈 사용)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="환율">환율</option>
              <option value="ETF">ETF</option>
              <option value="경제 기초">경제 기초</option>
              <option value="미국 증시">미국 증시</option>
              <option value="세금/지원금">세금/지원금</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category Slug</label>
            <input
              type="text"
              name="categorySlug"
              value={formData.categorySlug}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="예: 환율, ETF, 미국증시"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">흐름 섹션 배치 (선택)</label>
            <select
              name="flowType"
              value={formData.flowType}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="">배치 없음</option>
              <option value="지금 시장 흐름">지금 시장 흐름</option>
              <option value="과거에서 찾는 답">과거에서 찾는 답</option>
              <option value="위로의 방향">위로의 방향</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">언어 (Language)</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="ko">한국어 (Korean)</option>
              <option value="en">영어 (English)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="tag1, tag2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="https://..."
            />
          </div>

          {titleHistory && titleHistory.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Title History</label>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200 max-h-40 overflow-y-auto">
                <ul className="space-y-3">
                  {titleHistory.map((history, idx) => (
                    <li key={idx} className="text-xs">
                      <div className="text-gray-400 mb-1">{new Date(history.changedAt).toLocaleString()}</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-red-500 line-through">{history.oldTitle}</span>
                        <span className="text-emerald-600">{history.newTitle}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">SEO</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">SEO Description</label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="Used for post cards..."
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <h3 className="text-sm font-semibold text-gray-900">PLANNER META</h3>
            {!plannerMetaOpen && (
              <button
                type="button"
                onClick={() => setPlannerMetaOpen(true)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-900 transition-colors"
              >
                메타 붙여넣기 열기
              </button>
            )}
          </div>

          {plannerMetaOpen ? (
            <div className="space-y-4">
              <textarea
                value={plannerMetaText}
                onChange={(e) => setPlannerMetaText(e.target.value)}
                rows={10}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono leading-6"
                placeholder={'[PLANNER POST META 시작]\nTITLE\n로보어드바이저 수수료 비교\n...\n[PLANNER POST META 종료]'}
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlannerMetaApply}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  적용하기
                </button>
                <button
                  type="button"
                  onClick={() => setPlannerMetaOpen(false)}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
              {plannerMetaResult && (
                <div
                  className={`rounded-md border px-4 py-3 text-sm ${
                    plannerMetaResult.kind === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : plannerMetaResult.kind === 'warning'
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-rose-200 bg-rose-50 text-rose-900'
                  }`}
                >
                  <p className="font-medium">{plannerMetaResult.message}</p>
                  {plannerMetaResult.appliedLabels.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">적용 항목</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {plannerMetaResult.appliedLabels.map((label) => (
                          <li key={label}>- {label}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs opacity-80">총 {plannerMetaResult.appliedCount}개 항목 적용</p>
                    </div>
                  )}
                  {plannerMetaResult.missingLabels.length > 0 && (
                    <div className="mt-3 rounded-md border border-current/20 bg-white/50 px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-wider">누락된 항목</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {plannerMetaResult.missingLabels.map((label) => (
                          <li key={label}>- {label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              PLANNER POST META 블록을 붙여넣어 기존 입력 필드를 자동 반영합니다.
            </p>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">CONTENT OPTIMIZATION</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">메인 키워드</label>
              <input
                type="text"
                name="mainKeyword"
                value={formData.mainKeyword}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                placeholder="예: 로보어드바이저"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">서브 키워드</label>
              <textarea
                name="secondaryKeywords"
                value={formData.secondaryKeywords}
                onChange={handleChange}
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                placeholder="예: ETF, 자산배분, 분산투자"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">검색 의도</label>
              <select
                name="searchIntent"
                value={formData.searchIntent}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              >
                {SEARCH_INTENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">검사 결과</h4>
            <div className="space-y-3">
              {[
                { label: '제목', check: optimizationAnalysis.title },
                { label: 'SEO Title', check: optimizationAnalysis.seoTitle },
                { label: 'SEO Description', check: optimizationAnalysis.seoDescription },
                { label: '첫 문단', check: optimizationAnalysis.firstParagraph },
                { label: 'H2/H3', check: optimizationAnalysis.headings },
                { label: '본문 사용 횟수', check: optimizationAnalysis.bodyUsage },
                { label: '반복 여부', check: optimizationAnalysis.repetition },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4 rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.label === '본문 사용 횟수'
                        ? typeof item.check.count === 'number'
                          ? `본문 사용 ${item.check.count}회`
                          : item.check.detail
                        : item.check.detail}
                    </p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOptimizationBadgeClass(item.check.status)}`}>
                    {item.check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!formData.mainKeyword && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              메인 키워드를 입력하면 콘텐츠 점검이 활성화됩니다.
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Advanced (HTML/JS)</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Custom CSS</label>
            <textarea
              name="customCss"
              value={formData.customCss}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder=".my-class { color: red; }"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Custom JS</label>
            <textarea
              name="customJs"
              value={formData.customJs}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder="console.log('Hello');"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Structured Data (JSON-LD)</label>
            <textarea
              name="structuredDataJsonLd"
              value={formData.structuredDataJsonLd}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder='{ "@context": "https://schema.org", ... }'
            />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              <button 
                type="button"
                onClick={() => setShowPreview(false)} 
                className="text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <article className="max-w-3xl mx-auto">
                <header className="mb-12">
                  <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">
                    {formData.title || 'Untitled Post'}
                  </h1>
                </header>
                {formData.customCss && <style>{formData.customCss}</style>}
                <div 
                  className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(formData.content, { 
                      ADD_ATTR: ['target', 'class', 'style'], 
                      ADD_TAGS: ['iframe', 'style'] 
                    }) 
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

