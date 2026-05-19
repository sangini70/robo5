const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const DETAIL_DIR = path.join(DATA_DIR, 'detail');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DETAIL_DIR)) fs.mkdirSync(DETAIL_DIR, { recursive: true });

/**
 * Sample Data from robo5 (Mocked for migration template)
 * Replace this array with actual data if available.
 */
const rawPosts = [
  {
    id: "1",
    title: "로보어드바이저 수수료 비교 및 선택 가이드",
    slug: "robo-advisor-fees-comparison",
    description: "국내 주요 로보어드바이저 서비스의 수수료 체계를 상세히 비교하고 나에게 맞는 서비스를 선택하는 방법을 알아봅니다.",
    content: "<h1>로보어드바이저 수수료 비교</h1><p>로보어드바이저를 선택할 때 가장 중요한 요소 중 하나는 수수료입니다. [cite: 1] 대부분의 서비스는 운용자산의 일정 비율을 수수료로 책정합니다.</p><p>수수료는 보통 연 0.4%에서 0.8% 사이입니다. [cite: 2, 3]</p>",
    category: "환율",
    tags: ["로보어드바이저", "수수료", "투자"],
    thumbnail: "https://picsum.photos/seed/robo/800/450",
    status: "published",
    publishDate: "2026-04-10T09:00:00Z",
    createdAt: "2026-04-10T08:00:00Z",
    updatedAt: "2026-04-10T09:00:00Z",
    language: "ko"
  },
  {
    id: "2",
    title: "ETF 투자 기초: 초보자를 위한 핵심 정리",
    slug: "etf-investment-basics",
    description: "ETF란 무엇인가? 주식처럼 거래되는 펀드인 ETF의 장점과 투자 전략을 쉽게 설명합니다.",
    content: "<h1>ETF 투자 시작하기</h1><p>ETF는 Exchange Traded Fund의 약자로, 거래소에서 주식처럼 실시간으로 매매되는 인덱스 펀드입니다. [cite: 4]</p><p>분산 투자가 가능하며 수수료가 저렴하다는 장점이 있습니다.</p>",
    category: "ETF",
    tags: ["ETF", "기초", "재테크"],
    thumbnail: "https://picsum.photos/seed/etf/800/450",
    status: "published",
    publishDate: "2026-04-12T10:00:00Z",
    createdAt: "2026-04-12T09:00:00Z",
    updatedAt: "2026-04-12T10:00:00Z",
    language: "ko"
  },
  {
    id: "3",
    title: "임시 저장된 글 테스트",
    slug: "draft-post-test",
    description: "이 글은 공개 사이트에 노출되지 않아야 합니다.",
    content: "<p>테스트 내용입니다.</p>",
    category: "경제 기초",
    tags: ["테스트"],
    status: "draft",
    createdAt: "2026-04-13T11:00:00Z",
    updatedAt: "2026-04-13T11:00:00Z",
    language: "ko"
  }
];

function cleanHtml(html) {
  if (!html) return "";
  // Remove [cite: ...]
  return html.replace(/\[cite:[^\]]+\]/gi, '').trim();
}

function getExcerpt(html, maxLength = 120) {
  if (!html) return "";
  // Simple tag stripping
  const text = html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function migrate() {
  console.log('Starting migration to static JSON...');

  // 1. Prepare Master Data
  const masterPosts = rawPosts.map(post => ({
    ...post,
    content: cleanHtml(post.content)
  }));

  fs.writeFileSync(
    path.join(DATA_DIR, 'posts-master.json'),
    JSON.stringify(masterPosts, null, 2),
    'utf8'
  );
  console.log('Generated posts-master.json');

  // 2. Prepare Public List (posts.json)
  const now = new Date();
  const publicPosts = masterPosts
    .filter(post => {
      if (post.status !== 'published') return false;
      if (!post.slug) return false;
      const pubDate = new Date(post.publishDate || post.createdAt);
      return pubDate <= now;
    })
    .map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.description || getExcerpt(post.content),
      thumbnail: post.thumbnail || "",
      category: post.category || "",
      date: (post.publishDate || post.createdAt).split('T')[0],
      language: post.language || 'ko'
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  fs.writeFileSync(
    path.join(DATA_DIR, 'posts.json'),
    JSON.stringify(publicPosts, null, 2),
    'utf8'
  );
  console.log(`Generated posts.json with ${publicPosts.length} posts`);

  // 3. Generate Detail JSONs
  masterPosts.forEach(post => {
    if (!post.slug) {
      console.warn(`Skipping post without slug: ${post.title}`);
      return;
    }
    const detailPath = path.join(DETAIL_DIR, `${post.slug}.json`);
    fs.writeFileSync(detailPath, JSON.stringify(post, null, 2), 'utf8');
  });
  console.log(`Generated ${masterPosts.length} detail files in /public/data/detail/`);

  console.log('Migration completed successfully!');
}

migrate();
