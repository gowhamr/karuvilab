const fs = require('fs');
const path = require('path');

const registryDir = path.join(__dirname, 'src/registry/tools');
const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(registryDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Use global flag for replace
  content = content.replace(/(href:\s*['"`])(.*?)['"`]/g, (match, prefix, hrefVal) => {
    let cleanHref = hrefVal.trim();
    if (!cleanHref.startsWith('/')) cleanHref = '/' + cleanHref;
    if (!cleanHref.endsWith('/')) cleanHref = cleanHref + '/';
    cleanHref = cleanHref.replace(/\/{2,}/g, '/');
    return prefix + cleanHref + prefix.substring(prefix.length - 1);
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

// Also fix categories if they exist in core-registry or wherever
// Wait, categories are defined in `src/registry/index.ts` maybe?
