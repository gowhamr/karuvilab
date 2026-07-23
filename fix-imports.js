import fs from 'fs';
import path from 'path';

const tools = ['remove-pages', 'extract-pages', 'reverse-pages', 'duplicate-pages', 'even-pages-extractor', 'odd-pages-extractor'];

tools.forEach(tool => {
  const wrapperPath = path.join('src/features', tool, `${tool}Client.tsx`);
  if (fs.existsSync(wrapperPath)) {
    let wrapperContent = fs.readFileSync(wrapperPath, 'utf8');
    wrapperContent = wrapperContent.replace(`import { BasicPdfEditor } from "../../basic-pdf-editor/components/BasicPdfEditor";`, `import { BasicPdfEditor } from "@/src/features/basic-pdf-editor/components/BasicPdfEditor";`);
    fs.writeFileSync(wrapperPath, wrapperContent);
  }
});

console.log("Imports fixed.");
