import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const INTERACTIONS_FILE = path.join(process.cwd(), 'public', 'data', 'interactions.json');

export async function POST(request: Request) {
  try {
    const { slug, type } = await request.json();
    if (!slug || !type) return NextResponse.json({ error: 'Slug and type are required' }, { status: 400 });

    const dir = path.dirname(INTERACTIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let interactions: Record<string, Record<string, number>> = {};
    if (fs.existsSync(INTERACTIONS_FILE)) {
      interactions = JSON.parse(fs.readFileSync(INTERACTIONS_FILE, 'utf8'));
    }

    if (!interactions[slug]) interactions[slug] = {};
    interactions[slug][type] = (interactions[slug][type] || 0) + 1;
    
    fs.writeFileSync(INTERACTIONS_FILE, JSON.stringify(interactions, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
