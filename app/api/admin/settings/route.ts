import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'public', 'data', 'settings.json');

export async function GET() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return NextResponse.json({ adminPassword: 'admin' });
    }
    const content = fs.readFileSync(SETTINGS_FILE, 'utf8');
    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    let currentSettings = {};
    if (fs.existsSync(SETTINGS_FILE)) {
      currentSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
    
    const newSettings = { ...currentSettings, ...data };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
