
const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'src/content/tools');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
  const match = content.match(/detailedDescription:\s*`([\s\S]*?)`/);
  if (match) {
    const text = match[1];
    if (text.startsWith('\n') && text.match(/^\s{2,}/m)) {
      console.log(`Found indented description in ${file}`);
    }
  }
});
