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

<<<<<<< HEAD
export function getPostDetail(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'detail', `${slug}.json`);
=======
export function getPostDetail(slug: string, lang: string = 'ko') {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', lang, 'detail', `${slug}.json`);
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
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
