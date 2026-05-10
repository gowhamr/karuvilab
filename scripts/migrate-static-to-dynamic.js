const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, fileList);
    } else if (file === 'page.tsx') {
      fileList.push(name);
    }
  });
  return fileList;
}

const allPages = getFiles('app/(tools)');

allPages.forEach(filePath => {
  if (filePath === 'app/(tools)/page.tsx') return;

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Case A: Import already exists but is static
  const staticImportMatch = content.match(/import (\w+Client) from "\.\/(\w+Client)";/);
  if (staticImportMatch) {
    const componentName = staticImportMatch[1];
    console.log(`Converting static to dynamic: ${filePath}`);
    
    content = content.replace(
      staticImportMatch[0],
      `import dynamic from "next/dynamic";\nconst ${componentName} = dynamic(() => import("./${componentName}"), {\n  loading: () => null,\n});`
    );
    // Remove duplicate next/dynamic if already present
    content = content.replace(/import dynamic from "next\/dynamic";\s*import dynamic from "next\/dynamic";/, 'import dynamic from "next/dynamic";');
    
    fs.writeFileSync(filePath, content);
  }
});
