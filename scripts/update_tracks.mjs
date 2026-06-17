import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'data', 'certificationPaths.js');

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace " Track" with "" for names in branches
  content = content.replace(/name:\s*'([^']+?)\s+Track'/g, "name: '$1'");
  
  // Specific cleanups if any resulting names are weird (like "Database Admin" could stay)

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated branch names in certificationPaths.js');
} catch (error) {
  console.error('Error updating certificationPaths.js:', error);
}
