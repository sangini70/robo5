import fs from 'fs';
import path from 'path';

export function writeJsonArtifacts(posts: any[]) {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 2. Generate posts.json
  const postsFilePath = path.join(dataDir, 'posts.json');
  fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2), 'utf8');
  console.log("Generated posts.json");

  // 3. Generate flow-index.json (Category mapping)
  const flowIndex: Record<string, string[]> = {};
  posts.forEach(post => {
    const language = post.language ?? 'ko';
    if (post.category && language === 'ko') {
      const categorySource = post.categorySlug ?? post.category;
      const categoryKey = categorySource.trim().toLowerCase();
      if (!flowIndex[categoryKey]) {
        flowIndex[categoryKey] = [];
      }
      if (!flowIndex[categoryKey].includes(post.slug)) {
        flowIndex[categoryKey].push(post.slug);
      }
    }
  });

  const flowIndexPath = path.join(dataDir, 'flow-index.json');
  fs.writeFileSync(flowIndexPath, JSON.stringify(flowIndex, null, 2), 'utf8');
  console.log("Generated flow-index.json");

  // 4. Generate detail JSONs
  const koDetailDir = path.join(dataDir, 'ko', 'detail');
  const enDetailDir = path.join(dataDir, 'en', 'detail');

  if (!fs.existsSync(koDetailDir)) fs.mkdirSync(koDetailDir, { recursive: true });
  if (!fs.existsSync(enDetailDir)) fs.mkdirSync(enDetailDir, { recursive: true });

  posts.forEach(post => {
    const detailDir = post.language === 'en' ? enDetailDir : koDetailDir;
    const detailPath = path.join(detailDir, `${post.slug}.json`);
    fs.writeFileSync(detailPath, JSON.stringify(post, null, 2), 'utf8');
  });
  console.log(`Generated ${posts.length} detail JSON files.`);
}
