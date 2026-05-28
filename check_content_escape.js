
const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'src/content/tools');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
  if (content.includes('&lt;') || content.includes('&gt;')) {
    console.log(`Potential escaped HTML in ${file}`);
  }
});
