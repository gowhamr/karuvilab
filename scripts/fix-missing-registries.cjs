const fs = require('fs');
const path = require('path');

const appToolsDir = path.resolve(__dirname, '../app/(tools)');
const registryDir = path.resolve(__dirname, '../src/registry/tools');

function titleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// 1. Get all hrefs that are already registered
const existingHrefs = new Set();
const registryFiles = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));
for (const file of registryFiles) {
  const content = fs.readFileSync(path.join(registryDir, file), 'utf-8');
  const match = content.match(/"href":\s*"([^"]+)"/);
  if (match) {
    existingHrefs.add(match[1].replace(/\/$/, ''));
  }
}

// 2. Scan app/(tools) for all tool directories
const categories = fs.readdirSync(appToolsDir).filter(f => fs.statSync(path.join(appToolsDir, f)).isDirectory());

let addedCount = 0;

for (const cat of categories) {
  const catDir = path.join(appToolsDir, cat);
  const tools = fs.readdirSync(catDir).filter(f => fs.statSync(path.join(catDir, f)).isDirectory());
  
  for (const toolId of tools) {
    const href = `${cat}/${toolId}`;
    if (!existingHrefs.has(href)) {
      // It's missing! Generate a registry file.
      const categoryLabel = cat.endsWith('-tools') ? cat.replace('-tools', '') : cat;
      const toolName = titleCase(toolId);
      
      const fileContent = `import { ToolEntry } from '../types';

export const ${toolId.replace(/-/g, '_')}: ToolEntry = {
  "id": "${toolId}",
  "name": "${toolName}",
  "desc": "${toolName} tool",
  "href": "${cat}/${toolId}/",
  "category": "${categoryLabel}",
  "icon": null,
  "color": null,
  "featured": false,
  "popular": false,
  "status": "new",
  "lastAdded": new Date().toISOString().split('T')[0],
  "keywords": [
    "${toolName.toLowerCase()}",
    "${categoryLabel}"
  ],
  "input": null,
  "output": null,
  "related": [],
  "subCategory": null,
  "requiresNetwork": false
};
`;
      const outputPath = path.join(registryDir, `${toolId}.ts`);
      fs.writeFileSync(outputPath, fileContent);
      console.log(`Created missing registry file: ${outputPath}`);
      addedCount++;
    }
  }
}

console.log(`Done. Added ${addedCount} missing registry entries.`);
