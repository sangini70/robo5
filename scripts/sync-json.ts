import fs from 'fs';
import path from 'path';
import { writeJsonArtifacts } from '../src/lib/sync-json-artifacts';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const MASTER_FILE = path.join(DATA_DIR, 'posts-master.json');

function normalizeMasterPosts() {
  if (!fs.existsSync(MASTER_FILE)) {
    return [];
  }

  try {
    const content = fs.readFileSync(MASTER_FILE, 'utf8');
    const posts = JSON.parse(content);
    return Array.isArray(posts)
      ? posts.map((post: any, index: number) => ({
          ...post,
          id: post.id ?? post.slug ?? String(index + 1),
        }))
      : [];
  } catch (error) {
    console.error('Local sync-json failed to read posts-master.json:', error);
    return [];
  }
}

function filterPublicPosts(posts: any[]) {
  const now = new Date();
  return posts
    .filter(post => {
      if (post.status !== 'published') return false;
      const publishDate = post.publishDate ? new Date(post.publishDate) : null;
      if (publishDate && publishDate > now) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt).getTime();
      const dateB = new Date(b.publishDate || b.createdAt).getTime();
      return dateB - dateA;
    });
}

async function main() {
  console.log('Starting local sync-json script...');
  console.log('Reading posts from public/data/posts-master.json');

  const masterPosts = normalizeMasterPosts();
  const publicPosts = filterPublicPosts(masterPosts);

  console.log(`Loaded ${masterPosts.length} master posts.`);
  console.log(`Fetched ${publicPosts.length} published posts from posts-master.json.`);

  writeJsonArtifacts(publicPosts);
  console.log('Local sync-json complete.');
}

main().catch((error) => {
  console.error('Local sync-json failed:', error);
  process.exit(1);
});
