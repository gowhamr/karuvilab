import fs from 'fs';
import path from 'path';

const tools = ['organize-pdf', 'reorder-pages', 'move-pages', 'rotate-selected-pages', 'delete-blank-pages'];

tools.forEach(tool => {
  const pascalName = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  // Fix page.tsx
  const pagePath = path.join('app/(tools)/pdf-tools', tool, 'page.tsx');
  let pageContent = fs.readFileSync(pagePath, 'utf8');
  pageContent = pageContent.replace(new RegExp(`import ${tool}ClientWrapper`, 'g'), `import ${pascalName}ClientWrapper`);
  pageContent = pageContent.replace(new RegExp(`<${tool}ClientWrapper />`, 'g'), `<${pascalName}ClientWrapper />`);
  fs.writeFileSync(pagePath, pageContent);
  
  // Fix ClientWrapper.tsx
  const wrapperPath = path.join('src/features', tool, `${tool}ClientWrapper.tsx`);
  let wrapperContent = fs.readFileSync(wrapperPath, 'utf8');
  wrapperContent = wrapperContent.replace(new RegExp(`const ${tool}Client = dynamic`, 'g'), `const ${pascalName}Client = dynamic`);
  wrapperContent = wrapperContent.replace(new RegExp(`export default function ${tool}ClientWrapper\\(\\)`, 'g'), `export default function ${pascalName}ClientWrapper()`);
  wrapperContent = wrapperContent.replace(new RegExp(`<${tool}Client />`, 'g'), `<${pascalName}Client />`);
  fs.writeFileSync(wrapperPath, wrapperContent);
});

console.log("Identifiers fixed for Phase 2.");
