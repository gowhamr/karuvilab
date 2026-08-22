const fs = require('fs');
const path = require('path');

const registryDir = path.resolve(__dirname, '../src/registry/tools');

function toCamelCase(str) {
  return str.replace(/-([a-z0-9])/g, g => g[1].toUpperCase());
}

const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(registryDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find "export const something: ToolEntry ="
  const match = content.match(/export const ([a-zA-Z0-9_]+)\s*:\s*ToolEntry\s*=/);
  if (match) {
    const oldExport = match[1];
    const idMatch = content.match(/"id":\s*"([^"]+)"/);
    if (idMatch) {
      const id = idMatch[1];
      const correctExport = toCamelCase(id);
      
      if (oldExport !== correctExport) {
        content = content.replace(`export const ${oldExport}`, `export const ${correctExport}`);
        fs.writeFileSync(filePath, content);
        console.log(`Fixed export in ${file}: ${oldExport} -> ${correctExport}`);
      }
    }
  }
}
