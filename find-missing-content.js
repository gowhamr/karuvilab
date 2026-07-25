import fs from 'fs';
import path from 'path';

// read core-registry to extract tool IDs
const registryPath = path.join(process.cwd(), 'src/registry/core-registry.ts');
const registryStr = fs.readFileSync(registryPath, 'utf8');

// match all id: "tool-id"
const toolIds = [...registryStr.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log(`Total tools in registry: ${toolIds.length}`);

const contentDir = path.join(process.cwd(), 'src/content/tools');
const existingFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).map(f => f.replace(/\.tsx?$/, ''));

console.log(`Total content files: ${existingFiles.length}`);

const missing = toolIds.filter(id => !existingFiles.includes(id));
console.log(`Missing content for ${missing.length} tools:`);
missing.forEach(id => console.log(id));
