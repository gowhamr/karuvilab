const fs = require('fs');
const path = require('path');

const registryDir = path.join(__dirname, 'src/registry/tools');
const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(registryDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(/(href:\s*['"`])(.*?)['"`]/, (match, prefix, hrefVal) => {
    let cleanHref = hrefVal.trim();
    if (!cleanHref.startsWith('/')) cleanHref = '/' + cleanHref;
    if (!cleanHref.endsWith('/')) cleanHref = cleanHref + '/';
    // Clean up any potential double slashes, but keep the starting slash
    cleanHref = cleanHref.replace(/\/{2,}/g, '/');
    return prefix + cleanHref + prefix.substring(prefix.length - 1);
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
});
console.log("Registry normalized!");
