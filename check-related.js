const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('page.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const pages = walk('./app/(tools)');
let missing = [];
pages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('relatedTools')) {
    missing.push(path.relative('./app/(tools)', file));
  }
});

console.log(`Found ${missing.length} tools missing relatedTools:`);
missing.forEach(m => console.log(m));
