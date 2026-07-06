const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve(__dirname, '../app/(tools)');

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Look for export const metadata: Metadata = generateToolMetadata(camelCaseName);
      // Ensure it's not a string literal in quotes, and doesn't already have .id
      // Regex: generateToolMetadata\(([a-zA-Z0-9_]+)\) where $1 doesn't have quotes
      
      const newContent = content.replace(/generateToolMetadata\(([a-zA-Z0-9_]+)\)/g, (match, p1) => {
        // if it's already a string or already has .id, skip
        if (p1 === 'toolId' || p1.includes('.id') || p1.startsWith('"') || p1.startsWith("'")) {
          return match;
        }
        return `generateToolMetadata(${p1}.id)`;
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed page.tsx: ${fullPath}`);
      }
    }
  }
}

traverse(toolsDir);
