import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MASTER_FILE = path.join(process.cwd(), 'public', 'data', 'posts-master.json');

export async function GET() {
  try {
    if (!fs.existsSync(MASTER_FILE)) {
      return NextResponse.json({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        googleIndexed: 0,
        naverIndexed: 0,
        recentPosts: []
      });
    }

    const content = fs.readFileSync(MASTER_FILE, 'utf8');
    const posts = JSON.parse(content);

    const stats = {
      totalPosts: posts.length,
      publishedPosts: posts.filter((p: any) => p.status === 'published').length,
      draftPosts: posts.filter((p: any) => p.status === 'draft').length,
      googleIndexed: posts.filter((p: any) => p.googleIndexStatus === 'indexed').length,
      naverIndexed: posts.filter((p: any) => p.naverIndexStatus === 'requested').length, // In this app 'requested' seems to be the "done" state for naver
      recentPosts: [...posts]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5)
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
