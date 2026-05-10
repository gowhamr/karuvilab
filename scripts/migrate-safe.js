const fs = require('fs');
const path = require('path');

// Use a simple recursive file finder since glob might be missing
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

  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('"use client"')) return;

  console.log(`Processing: ${filePath}`);

  // 1. Identify component name
  const componentMatch = content.match(/export default function (\w+)/);
  if (!componentMatch) return;
  const componentName = componentMatch[1];
  const clientFileName = `${componentName}Client.tsx`;
  const clientPath = path.join(path.dirname(filePath), clientFileName);

  // 2. Extract metadata and tool details
  const titleMatch = content.match(/title="([^"]+)"/);
  const descMatch = content.match(/description="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : '';
  const description = descMatch ? descMatch[1] : '';
  
  const toolIdMatch = filePath.match(/\/([^/]+)\/page\.tsx/);
  const toolId = toolIdMatch[1];
  
  const catIdMatch = filePath.match(/app\/\(tools\)\/([^/]+)/);
  let catId = catIdMatch[1].replace('-tools', '');
  if (catId === 'developer') catId = 'developer';

  // 3. Create Client Component
  // We need to keep everything EXCEPT the metadata and the ToolShell wrapper in page.tsx
  let clientContent = content
    .replace(/import { Metadata } from "next";\s*/g, '')
    .replace(/export const metadata: Metadata = [\s\S]*?;\s*/g, '')
    .replace(/import { generateToolMetadata } from "@\/src\/lib\/seo";\s*/g, '')
    // Change export default function Name() to export default function NameClient()
    .replace(/export default function (\w+)/, `export default function ${componentName}Client`)
    // Remove ToolShell wrapper but KEEP its children
    .replace(
      /<ToolShell[\s\S]*?>([\s\S]*?)<\/ToolShell>/,
      `$1`
    );

  fs.writeFileSync(clientPath, clientContent);

  // 4. Create Server Component page.tsx
  const serverContent = `import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const ${componentName}Client = dynamic(() => import("./${componentName}Client"), {
  loading: () => null,
});

export const metadata: Metadata = generateToolMetadata("${toolId}");

export default function page() {
  const cat = CATEGORIES.find(c => c.id === "${catId}")!;
  return (
    <ToolShell
      title="${title}"
      description="${description}"
      category={cat}
    >
      <${componentName}Client />
    </ToolShell>
  );
}
`;

  fs.writeFileSync(filePath, serverContent);
});
