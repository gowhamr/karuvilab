const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('Client.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('/root/karuvilab/app/(tools)');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // We want to replace `<div className="max-w-6xl mx-auto space-y-8 pb-12">` 
  // with `<div className="w-full space-y-8 pb-12">`
  
  // Regex to match className="..." containing max-w-something and mx-auto
  let newContent = content.replace(/className="([^"]*)max-w-[a-z0-9]+([^"]*)mx-auto([^"]*)"/g, (match, p1, p2, p3) => {
    // only if it's the outermost div? We can just replace the strings
    let clean = (p1 + " w-full " + p2 + " " + p3).replace(/\s+/g, ' ').trim();
    return `className="${clean}"`;
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${file}`);
  }
});
