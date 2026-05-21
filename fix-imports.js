const fs = require('fs');
const path = require('path');

const files = [
  './app/admin/(protected)/layout.tsx',
  './app/admin/(protected)/posts/[id]/edit/page.tsx',
  './app/admin/(protected)/posts/page.tsx',
  './app/admin/(protected)/migrate/page.tsx',
  './app/admin/(protected)/dashboard/page.tsx',
  './app/admin/(protected)/settings/page.tsx',
  './app/admin/login/page.tsx',
  './app/tag/[slug]/page.tsx',
  './app/en/page.tsx',
  './app/category/[slug]/page.tsx',
  './app/sitemap.ts',
  './app/[slug]/page.tsx',
  './src/components/FlowSection.tsx',
  './src/components/HomeContent.tsx',
  './src/components/SearchContent.tsx',
  './src/components/Sidebar.tsx',
  './src/components/PopularPosts.tsx',
  './src/components/PopularPostsWidget.tsx'
];

const targetFile = path.resolve('./src/firebase.ts');

files.forEach(file => {
  const absoluteFilePath = path.resolve(file);
  const dir = path.dirname(absoluteFilePath);
  let relativePath = path.relative(dir, targetFile);
  
  // Remove .ts extension
  relativePath = relativePath.replace(/\.ts$/, '');
  
  // Ensure it starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }

  // Read file and replace
  let content = fs.readFileSync(absoluteFilePath, 'utf8');
  content = content.replace(/from\s+['"]@\/src\/firebase['"]/g, `from '${relativePath}'`);
  fs.writeFileSync(absoluteFilePath, content, 'utf8');
  console.log(`Updated ${file} with ${relativePath}`);
});
