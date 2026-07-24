const fs = require('fs');
const path = require('path');

const registryDir = path.join(__dirname, 'src/registry/tools');
const appToolsDir = path.join(__dirname, 'app/(tools)');

const files = fs.readdirSync(registryDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(registryDir, file), 'utf-8');
  const match = content.match(/href:\s*['"`](.*?)['"`]/);
  if (match) {
    let href = match[1];
    if (href.startsWith('/')) href = href.substring(1);
    if (href.endsWith('/')) href = href.substring(0, href.length - 1);
    
    const pagePath = path.join(appToolsDir, href, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      console.log(`404: Tool ${file} points to href ${href}, but ${pagePath} is missing!`);
    }
  }
});
