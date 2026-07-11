const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/data/data/com.termux/files/home/karuvilab/app').concat(walk('/data/data/com.termux/files/home/karuvilab/components')).concat(walk('/data/data/com.termux/files/home/karuvilab/src'));

let deadElements = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Very basic regex to find <button ...> tags
  // We want to check if they lack onClick, type="submit", disabled, or a ref spread {...
  const buttonRegex = /<button([^>]+)>/g;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (
      !attrs.includes('onClick') &&
      !attrs.includes('type="submit"') &&
      !attrs.includes('disabled') &&
      !attrs.includes('{...') // could be spreading props that contain onClick
    ) {
      // It might be a button used purely for Radix UI Trigger (which injects onClick via asChild or context)
      if (content.includes('asChild') && attrs.includes('className')) {
         // rough heuristic: if it's inside a file that imports radix, it might be a trigger, but let's log it anyway.
      }
      deadElements.push({ file: path.relative('/data/data/com.termux/files/home/karuvilab', file), line: content.substring(0, match.index).split('\n').length, tag: match[0] });
    }
  }
});

console.log(`Found ${deadElements.length} potential dead buttons:`);
deadElements.forEach(d => console.log(`${d.file}:${d.line} -> ${d.tag.substring(0, 100)}`));
