const fs = require('fs');
const glob = require('glob');

function fix() {
  const files = glob.sync('app/\\(tools\\)/**/page.tsx');
  for (const f of files) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('ssr: false')) {
      content = content.replace(/ssr: false,\s*/g, '');
      fs.writeFileSync(f, content);
      console.log(`Fixed: ${f}`);
    }
  }
}

fix();
