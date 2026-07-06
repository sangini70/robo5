import fs from 'fs';
import path from 'path';

export function getPostsFromJson() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'posts.json');
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    const exists = fs.existsSync(filePath);
    let fileHead = '';

    if (exists) {
      try {
        fileHead = fs.readFileSync(filePath, 'utf8').slice(0, 120);
      } catch (readError) {
        fileHead = `<failed to read file head: ${readError instanceof Error ? readError.message : String(readError)}>`;
      }
    }

    console.error('Error reading posts.json:', {
      cwd: process.cwd(),
      filePath,
      exists,
      fileHead,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
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
    const posts = getPostsFromJson();
    const post = posts.find((item: any) => item.slug === slug);

    if (!post) {
      return null;
    }

    const detailDir = post.language === 'en' ? 'en' : 'ko';
    const filePath = path.join(process.cwd(), 'public', 'data', detailDir, 'detail', `${slug}.json`);
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
