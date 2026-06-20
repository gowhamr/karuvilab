const fs = require('fs');
const path = require('path');
const toolsDir = path.join(__dirname, 'src/registry/tools');
const files = fs.readdirSync(toolsDir);

const popularTools = [
  'compress-pdf.ts',
  'bg-remover.ts',
  'fake-data-generator.ts',
  'json-csv.ts',
  'json-formatter.ts',
  'merge-pdf.ts',
  'lock-unlock-pdf.ts',
  'code-minifier.ts'
];

for (const file of files) {
  if (file.endsWith('.ts')) {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Manage popular flag
    if (popularTools.includes(file)) {
      if (!content.includes('"popular": true') && !content.includes('"popular": false')) {
        content = content.replace(/"priority": ([\d.]+)/, '"priority": $1,\n  "popular": true');
      } else {
        content = content.replace(/"popular":\s*(true|false)/, '"popular": true');
      }
    } else {
      content = content.replace(/"popular":\s*true,?\s*\n/, ''); // remove popular flag if true, or set to false
      content = content.replace(/"popular":\s*true,?/, ''); 
    }

    // 2. Add inputs/outputs where missing
    if (file === 'json-csv.ts') {
      if (!content.includes('"input"')) content = content.replace(/"category": "developer",/, '"category": "developer",\n  "input": ["json", "csv"],\n  "output": ["json", "csv"],');
    }
    if (file === 'fake-data-generator.ts') {
      if (!content.includes('"output"')) content = content.replace(/"category": "developer",/, '"category": "developer",\n  "output": ["json", "csv", "sql"],');
    }
    if (file === 'merge-pdf.ts') {
      if (!content.includes('"input"')) content = content.replace(/"category": "pdf",/, '"category": "pdf",\n  "input": "pdf",\n  "output": "pdf",');
    }
    if (file === 'lock-unlock-pdf.ts') {
      if (!content.includes('"input"')) content = content.replace(/"category": "pdf",/, '"category": "pdf",\n  "input": "pdf",\n  "output": "pdf",');
    }
    
    fs.writeFileSync(filePath, content);
  }
}
