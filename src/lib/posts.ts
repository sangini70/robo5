import fs from 'fs';
import path from 'path';

export function getPostsFromJson() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'posts.json');
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading posts.json:', error);
    return [];
  }
}

export function getFlowIndex() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'flow-index.json');
    if (!fs.existsSync(filePath)) {
      return {};
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading flow-index.json:', error);
    return {};
  }
}

export function getPostDetail(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'detail', `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Post detail not found: ${filePath}`);
      return null;
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading post detail for ${slug}:`, error);
    return null;
  }
}
