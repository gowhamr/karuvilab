const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const pages = walk('app/(tools)').filter(f => f.endsWith('/page.tsx') && f.split('/').length >= 4);

let migrated = 0;

for (const file of pages) {
    const parts = file.split('/');
    const categoryId = parts[2];
    const toolId = parts[3];
    
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.includes(`toolId="${toolId}"`) || content.includes(`toolId={toolId}`)) {
        if (!content.includes('generateToolMetadata')) {
            // Needs metadata migration
        } else {
            continue;
        }
    }
    
    let title = "";
    let desc = "";
    const titleMatch = content.match(/title=(["'])(.*?)\1/);
    if (titleMatch) title = titleMatch[2];
    else {
        const metaTitleMatch = content.match(/title:\s*(["'])(.*?)\1/);
        if (metaTitleMatch) {
            title = metaTitleMatch[2].replace(' – KV', '').replace(' - KaruviLab', '').replace(' – KaruviLab', '');
        }
    }
    
    const descMatch = content.match(/description=(["'])(.*?)\1/);
    if (descMatch) desc = descMatch[2];
    else {
        const metaDescMatch = content.match(/description:\s*(["'])(.*?)\1/);
        if (metaDescMatch) desc = metaDescMatch[2];
    }
    
    const wrapperMatch = content.match(/<([A-Za-z0-9_]+Wrapper)\s*\/?(>| \/>)/);
    let wrapper = "";
    if (wrapperMatch) {
        wrapper = wrapperMatch[1];
    } else {
        const clientMatch = content.match(/<([A-Za-z0-9_]+Client)\s*\/?(>| \/>)/);
        if (clientMatch) wrapper = clientMatch[1];
    }
    
    let inlineContentStr = "";
    const contentPropMatch = content.match(/content=\{\{([\s\S]*?)\}\}\s*>/);
    if (contentPropMatch) {
        inlineContentStr = `\n      content={{${contentPropMatch[1]}}}`;
    }
    
    if (!wrapper) {
        console.log(`Could not find wrapper for ${toolId}`);
        continue;
    }
    
    const wrapperImportMatch = content.match(new RegExp(`import\\s+${wrapper}\\s+from\\s+['"](.*?)['"]`));
    const importPath = wrapperImportMatch ? wrapperImportMatch[1] : `./${wrapper}`;
    
    const newFileContent = `import { Metadata } from 'next';
import { CATEGORIES } from '@/src/tool-registry';
import { ToolShell } from '@/components/ui/ToolShell';
import { generateToolMetadata } from '@/src/lib/seo';

import ${wrapper} from '${importPath}';

const toolId = '${toolId}';
const cat = CATEGORIES.find(c => c.id === '${categoryId}');

export const metadata: Metadata = generateToolMetadata(toolId);

export default function Page() {
  return (
    <ToolShell 
      title="${title || toolId}"
      description="${desc || ''}"
      category={cat}
      toolId={toolId}${inlineContentStr}
    >
      <${wrapper} />
    </ToolShell>
  );
}
`;
    
    fs.writeFileSync(file, newFileContent, 'utf8');
    migrated++;
}

console.log(`Migrated ${migrated} tools.`);
