import fs from 'fs';
import path from 'path';
import { writeJsonArtifacts } from '../src/lib/sync-json-artifacts';

const MASTER_FILE = path.join(process.cwd(), 'public', 'data', 'posts-master.json');

function normalizeMasterValue(value: any): any {
  if (value == null) return value;
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeMasterValue);
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeMasterValue(nestedValue)])
    );
  }
  return value;
}

function normalizeMasterPosts(posts: any[]) {
  return posts.map((post: any, index: number) => ({
    ...normalizeMasterValue(post),
    id: post.id ?? post.slug ?? String(index + 1),
  }));
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
  console.log('Reading posts from public/data/posts-master.json...');

  if (!fs.existsSync(MASTER_FILE)) {
    throw new Error(`Master file not found: ${MASTER_FILE}`);
  }

  const rawMasterPosts = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
  if (!Array.isArray(rawMasterPosts)) {
    throw new Error('posts-master.json must contain an array of posts.');
  }

  const normalizedPosts = normalizeMasterPosts(rawMasterPosts);
  const publicPosts = filterPublicPosts(normalizedPosts);

  console.log(`Loaded ${rawMasterPosts.length} master posts from posts-master.json.`);
  console.log(`Fetched ${publicPosts.length} published posts from posts-master.json.`);

  writeJsonArtifacts(publicPosts);
  console.log('Local sync-json complete.');
}

main().catch((error) => {
  console.error('Local sync-json failed:', error);
  process.exit(1);
});
