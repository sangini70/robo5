import fs from 'fs';
import path from 'path';

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace react-router-dom imports
  content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
    let newImports = [];
    let nextNavigationImports = [];
    let nextLinkImports = [];

    if (imports.includes('Link')) nextLinkImports.push('Link');
    if (imports.includes('useNavigate')) nextNavigationImports.push('useRouter');
    if (imports.includes('useParams')) nextNavigationImports.push('useParams');
    if (imports.includes('Navigate')) nextNavigationImports.push('redirect');

    let result = '';
    if (nextLinkImports.length > 0) result += `import Link from 'next/link';\n`;
    if (nextNavigationImports.length > 0) result += `import { ${nextNavigationImports.join(', ')} } from 'next/navigation';\n`;
    
    return result;
  });

  // Replace useNavigate with useRouter
  content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');

  // Replace <Link to="..."> with <Link href="...">
  content = content.replace(/<Link\s+to=/g, '<Link href=');

  // Replace react-helmet-async
  content = content.replace(/import\s+\{\s*Helmet\s*\}\s+from\s+['"]react-helmet-async['"];?/g, '');
  content = content.replace(/<Helmet>[\s\S]*?<\/Helmet>/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      migrateFile(fullPath);
    }
  }
}

walkDir('./src/pages');
walkDir('./src/components');
console.log('Migration script completed.');
