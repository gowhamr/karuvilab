import fs from 'fs';
import path from 'path';

const tools = ['remove-pages', 'extract-pages', 'reverse-pages', 'duplicate-pages', 'even-pages-extractor', 'odd-pages-extractor'];

tools.forEach(tool => {
  const pascalName = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  // Fix page.tsx
  const pagePath = path.join('app/(tools)/pdf-tools', tool, 'page.tsx');
  let pageContent = fs.readFileSync(pagePath, 'utf8');
  pageContent = pageContent.replace(`import ${tool}ClientWrapper`, `import ${pascalName}ClientWrapper`);
  pageContent = pageContent.replace(`<${tool}ClientWrapper />`, `<${pascalName}ClientWrapper />`);
  fs.writeFileSync(pagePath, pageContent);
  
  // Fix ClientWrapper.tsx
  const wrapperPath = path.join('src/features', tool, `${tool}ClientWrapper.tsx`);
  let wrapperContent = fs.readFileSync(wrapperPath, 'utf8');
  wrapperContent = wrapperContent.replace(`const ${tool}Client = dynamic`, `const ${pascalName}Client = dynamic`);
  wrapperContent = wrapperContent.replace(`export default function ${tool}ClientWrapper()`, `export default function ${pascalName}ClientWrapper()`);
  wrapperContent = wrapperContent.replace(`<${tool}Client />`, `<${pascalName}Client />`);
  fs.writeFileSync(wrapperPath, wrapperContent);
});

console.log("Identifiers fixed.");
