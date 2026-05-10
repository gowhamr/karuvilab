const fs = require('fs');
const path = require('path');

const targetFiles = [
  'app/(tools)/pdf-tools/extract-images/page.tsx',
  'app/(tools)/pdf-tools/image-to-pdf/page.tsx',
  'app/(tools)/pdf-tools/lock-unlock/page.tsx',
  'app/(tools)/pdf-tools/page-numbering/page.tsx',
  'app/(tools)/pdf-tools/pdf-to-word/page.tsx',
  'app/(tools)/pdf-tools/rotate-pdf/page.tsx',
  'app/(tools)/pdf-tools/split-pdf/page.tsx',
  'app/(tools)/pdf-tools/watermark-pdf/page.tsx',
  'app/(tools)/utilities/grammar-checker/page.tsx',
  'app/(tools)/utilities/markdown/page.tsx',
  'app/(tools)/utilities/qrcode/page.tsx',
  'app/(tools)/utilities/split-copy/page.tsx',
  'app/(tools)/utilities/text-utility/page.tsx',
  'app/(tools)/utilities/url-cleaner/page.tsx',
  'app/(tools)/utilities/validate/page.tsx',
  'app/(tools)/security-tools/hash-generator/page.tsx',
  'app/(tools)/security-tools/html-entities/page.tsx',
  'app/(tools)/security-tools/jwt-decoder/page.tsx',
  'app/(tools)/security-tools/password-generator/page.tsx',
  'app/(tools)/security-tools/url-encoder/page.tsx',
  'app/(tools)/seo-tools/image-seo/page.tsx',
  'app/(tools)/seo-tools/meta-tags/page.tsx',
  'app/(tools)/seo-tools/og-preview/page.tsx',
  'app/(tools)/seo-tools/robots-txt/page.tsx',
  'app/(tools)/seo-tools/seo-title/page.tsx',
  'app/(tools)/seo-tools/sitemap-generator/page.tsx',
  'app/(tools)/seo-tools/slug-generator/page.tsx',
  'app/(tools)/developer-tools/code-minifier/page.tsx',
  'app/(tools)/developer-tools/diff-checker/page.tsx',
  'app/(tools)/developer-tools/format/page.tsx',
  'app/(tools)/developer-tools/json-csv/page.tsx',
  'app/(tools)/developer-tools/json-formatter/page.tsx',
  'app/(tools)/developer-tools/regex/page.tsx'
];

function transform() {
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('"use client"')) {
      console.log(`Skipping (already server-side): ${filePath}`);
      continue;
    }

    // 1. Identify component name and props
    const componentMatch = content.match(/export default function (\w+)/);
    if (!componentMatch) {
      console.warn(`Could not find component in: ${filePath}`);
      continue;
    }
    const componentName = componentMatch[1];
    const clientFileName = `${componentName}Client.tsx`;
    const clientPath = path.join(path.dirname(filePath), clientFileName);

    // 2. Identify ToolShell props
    const shellMatch = content.match(/<ToolShell\s+title="([^"]+)"\s+description="([^"]+)"\s+category={cat}>\s*([\s\S]*?)<\/ToolShell>/);
    if (!shellMatch) {
      console.warn(`Could not find ToolShell in: ${filePath}`);
      continue;
    }
    const title = shellMatch[1];
    const description = shellMatch[2];

    // 3. Identify toolId from metadata or file path
    const toolIdMatch = filePath.match(/\/([^/]+)\/page\.tsx/);
    const toolId = toolIdMatch[1];

    // 4. Identify categoryId
    const catIdMatch = filePath.match(/app\/\(tools\)\/([^/]+)/);
    let catId = catIdMatch[1].replace('-tools', '');
    if (catId === 'developer') catId = 'developer';

    // 5. Create Client Component
    let clientContent = content
      .replace(/import { Metadata } from "next";\s*/g, '')
      .replace(/export const metadata: Metadata = [\s\S]*?;\s*/g, '')
      .replace(/const cat = CATEGORIES\.find\(c => c\.id === "[^"]+"\)!;\s*/g, '')
      .replace(/import { CATEGORIES } from "@\/src\/tool-registry";\s*/g, '')
      .replace(/import { ToolShell } from "@\/components\/ui\/ToolShell";\s*/g, '')
      .replace(/import { generateToolMetadata } from "@\/src\/lib\/seo";\s*/g, '');

    // Extract inner children from ToolShell
    clientContent = clientContent.replace(
      /export default function \w+\(\) {[\s\S]*?return \(\s*<ToolShell[\s\S]*?>([\s\S]*?)<\/ToolShell>\s*\);\s*}/,
      `export default function ${componentName}Client() {\n  return (\n    <div className="space-y-8">\n$1\n    </div>\n  );\n}`
    );

    fs.writeFileSync(clientPath, clientContent);

    // 6. Replace original page.tsx with Server Component
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
