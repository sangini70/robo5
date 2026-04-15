import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'public', 'data', 'views.json');
const MASTER_FILE = path.join(process.cwd(), 'public', 'data', 'posts-master.json');

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const dir = path.dirname(VIEWS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let views: Record<string, number> = {};
    if (fs.existsSync(VIEWS_FILE)) {
      views = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf8'));
    }

    views[slug] = (views[slug] || 0) + 1;
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf8');

    // Also update master file if it exists (optional, maybe better to do periodically)
    if (fs.existsSync(MASTER_FILE)) {
      const posts = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
      const postIndex = posts.findIndex((p: any) => p.slug === slug);
      if (postIndex !== -1) {
        posts[postIndex].postViews = (posts[postIndex].postViews || 0) + 1;
        fs.writeFileSync(MASTER_FILE, JSON.stringify(posts, null, 2), 'utf8');
      }
    }

    return NextResponse.json({ success: true, views: views[slug] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
