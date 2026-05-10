const fs = require('fs');
const path = require('path');

const targetFiles = [
  'app/(tools)/seo-tools/image-seo/page.tsx',
  'app/(tools)/seo-tools/meta-tags/page.tsx',
  'app/(tools)/seo-tools/og-preview/page.tsx',
  'app/(tools)/seo-tools/robots-txt/page.tsx',
  'app/(tools)/seo-tools/seo-title/page.tsx',
  'app/(tools)/seo-tools/sitemap-generator/page.tsx',
  'app/(tools)/seo-tools/slug-generator/page.tsx',
  'app/(tools)/developer-tools/json-csv/page.tsx',
  'app/(tools)/developer-tools/json-formatter/page.tsx'
];

function transform() {
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('"use client"')) continue;

    // 1. Identify component name
    const componentMatch = content.match(/export default function (\w+)/);
    if (!componentMatch) continue;
    const componentName = componentMatch[1];
    const clientFileName = `${componentName}Client.tsx`;
    const clientPath = path.join(path.dirname(filePath), clientFileName);

    // 2. Extract ToolShell props more robustly
    const titleMatch = content.match(/title="([^"]+)"/);
    const descMatch = content.match(/description="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : '';
    const description = descMatch ? descMatch[1] : '';

    // 3. Identify toolId and categoryId
    const toolIdMatch = filePath.match(/\/([^/]+)\/page\.tsx/);
    const toolId = toolIdMatch[1];
    const catIdMatch = filePath.match(/app\/\(tools\)\/([^/]+)/);
    let catId = catIdMatch[1].replace('-tools', '');

    // 4. Create Client Component
    // Find the content inside <ToolShell ...> ... </ToolShell>
    const shellContentMatch = content.match(/<ToolShell[\s\S]*?>([\s\S]*?)<\/ToolShell>/);
    if (!shellContentMatch) continue;
    const children = shellContentMatch[1];

    let clientContent = content
      .replace(/import { Metadata } from "next";\s*/g, '')
      .replace(/export const metadata: Metadata = [\s\S]*?;\s*/g, '')
      .replace(/const cat = CATEGORIES\.find\(c => c\.id === "[^"]+"\)!;\s*/g, '')
      .replace(/import { CATEGORIES } from "@\/src\/tool-registry";\s*/g, '')
      .replace(/import { ToolShell } from "@\/components\/ui\/ToolShell";\s*/g, '')
      .replace(/import { generateToolMetadata } from "@\/src\/lib\/seo";\s*/g, '');

    // Replace the default export with the client component
    clientContent = clientContent.replace(
      /export default function \w+\(\) {[\s\S]*?return \(\s*<ToolShell[\s\S]*?>[\s\S]*?<\/ToolShell>\s*\);\s*}/,
      `export default function ${componentName}Client() {\n  return (\n    <div className="space-y-8">\n${children}\n    </div>\n  );\n}`
    );

    fs.writeFileSync(clientPath, clientContent);

    // 5. Replace original page.tsx with Server Component
    const serverContent = `import { Metadata } from "next";
import dynamic from "next/dynamic";
import { CATEGORIES } from "@/src/tool-registry";
import { ToolShell } from "@/components/ui/ToolShell";
import { generateToolMetadata } from "@/src/lib/seo";

const ${componentName}Client = dynamic(() => import("./${componentName}Client"), {
  ssr: false,
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
    console.log(`Successfully refactored: ${filePath}`);
  }
}

transform();
