const fs = require('fs');
const path = require('path');

const registryDir = path.join(__dirname, 'src/registry/tools');
const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(registryDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Use global flag for replace, match "href": as well as href:
  content = content.replace(/(["']?href["']?:\s*['"`])(.*?)['"`]/g, (match, prefix, hrefVal) => {
    let cleanHref = hrefVal.trim();
    if (!cleanHref.startsWith('/')) cleanHref = '/' + cleanHref;
    if (!cleanHref.endsWith('/')) cleanHref = cleanHref + '/';
    cleanHref = cleanHref.replace(/\/{2,}/g, '/');
    // We need to re-append the closing quote. The match has the closing quote at the very end.
    const closingQuote = match.slice(-1);
    return prefix + cleanHref + closingQuote;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
});
