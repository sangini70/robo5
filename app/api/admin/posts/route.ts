import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const MASTER_FILE = path.join(DATA_DIR, 'posts-master.json');

// Helper to ensure directory exists
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper to read master posts
function getMasterPosts() {
  if (!fs.existsSync(MASTER_FILE)) {
    return [];
  }
  try {
    const content = fs.readFileSync(MASTER_FILE, 'utf8');
    return JSON.parse(content);
  } catch (e) {
    console.error('Error reading master file', e);
    return [];
  }
}

// Helper to save master posts and regenerate public files
function saveAndSync(posts: any[]) {
  ensureDir(DATA_DIR);
  
  console.log('--- JSON Sync Debug ---');
  console.log('Master File Path:', MASTER_FILE);
  
  // 1. Save Master File
  fs.writeFileSync(MASTER_FILE, JSON.stringify(posts, null, 2), 'utf8');
  console.log('Master file saved. Total posts:', posts.length);
  
  // 2. Filter for public posts (published and not future-dated)
  const now = new Date();
  const publicPosts = posts.filter(post => {
    if (post.status !== 'published') return false;
    const publishDate = post.publishDate ? new Date(post.publishDate) : null;
    if (publishDate && publishDate > now) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a.publishDate || a.createdAt).getTime();
    const dateB = new Date(b.publishDate || b.createdAt).getTime();
    return dateB - dateA;
  });

  // 3. Generate posts.json
  const postsJsonPath = path.join(DATA_DIR, 'posts.json');
  fs.writeFileSync(postsJsonPath, JSON.stringify(publicPosts, null, 2), 'utf8');
  console.log('posts.json saved. Public posts count:', publicPosts.length);
  console.log('posts.json path:', postsJsonPath);

  // 4. Generate flow-index.json
  const flowIndexPath = path.join(DATA_DIR, 'flow-index.json');
  const flowIndex: Record<string, string[]> = {};
  publicPosts.forEach(post => {
    if (post.category && post.language === 'ko') {
      const categoryKey = post.category.trim().toLowerCase();
      if (!flowIndex[categoryKey]) {
        flowIndex[categoryKey] = [];
      }
      if (!flowIndex[categoryKey].includes(post.slug)) {
        flowIndex[categoryKey].push(post.slug);
      }
    }
  });
  fs.writeFileSync(flowIndexPath, JSON.stringify(flowIndex, null, 2), 'utf8');
  console.log('flow-index.json saved.');

  // 5. Generate detail JSONs
  const detailDir = path.join(DATA_DIR, 'detail');
  ensureDir(detailDir);

  posts.forEach(post => {
    const detailPath = path.join(detailDir, `${post.slug}.json`);
    fs.writeFileSync(detailPath, JSON.stringify(post, null, 2), 'utf8');
  });
  
  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    const lastDetailPath = path.join(detailDir, `${lastPost.slug}.json`);
    console.log('Last detail file saved:', lastDetailPath);
    console.log('Last saved slug:', lastPost.slug);
  }
  console.log('--- End JSON Sync Debug ---');
}

export async function GET() {
  const posts = getMasterPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const posts = getMasterPosts();
    
    if (postData.id) {
      // Update
      const index = posts.findIndex((p: any) => p.id === postData.id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...postData, updatedAt: new Date().toISOString() };
      } else {
        // If ID provided but not found, treat as new or error
        posts.push({ ...postData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
    } else {
      // Create
      const newPost = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      posts.push(newPost);
    }
    
    try {
      saveAndSync(posts);
      return NextResponse.json({ success: true });
    } catch (syncError: any) {
      console.error("Sync Error:", syncError);
      return NextResponse.json({ success: false, error: `JSON 동기화 실패: ${syncError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }
    
    const posts = getMasterPosts();
    const filteredPosts = posts.filter((p: any) => p.id !== id);
    
    saveAndSync(filteredPosts);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
