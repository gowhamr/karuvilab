const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve(__dirname, '../app/(tools)');

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Look for <ToolShell toolId={camelCaseName.id}>
      // Replace with <ToolShell title={camelCaseName.name} toolId={camelCaseName.id}>
      // Using regex: <ToolShell\s+toolId=\{([a-zA-Z0-9_]+)\.id\}>
      
      const newContent = content.replace(/<ToolShell\s+toolId=\{([a-zA-Z0-9_]+)\.id\}>/g, (match, p1) => {
        return `<ToolShell title={${p1}.name} toolId={${p1}.id}>`;
      });

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed ToolShell title in: ${fullPath}`);
      }
    }
  }
}

traverse(toolsDir);
