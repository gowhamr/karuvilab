import fs from 'fs';
import path from 'path';

const tools = ['organize-pdf', 'reorder-pages', 'move-pages', 'rotate-selected-pages', 'delete-blank-pages'];

tools.forEach(tool => {
  const wrapperPath = path.join('src/features', tool, `${tool}Client.tsx`);
  if (fs.existsSync(wrapperPath)) {
    let wrapperContent = fs.readFileSync(wrapperPath, 'utf8');
    wrapperContent = wrapperContent.replace(`import { PdfOrganizer } from "../../advanced-pdf-editor/components/PdfOrganizer";`, `import { PdfOrganizer } from "@/src/features/advanced-pdf-editor/components/PdfOrganizer";`);
    fs.writeFileSync(wrapperPath, wrapperContent);
  }
});

console.log("Imports fixed for Phase 2.");
